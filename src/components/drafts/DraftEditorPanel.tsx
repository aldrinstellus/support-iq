'use client';

/**
 * Draft Editor Panel with TipTap
 * Displays editable draft response below ticket conversation history
 */

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Loader2,
  Save,
  AlertCircle,
  RefreshCw,
  Send,
  AlertTriangle,
  X,
  CheckCircle
} from 'lucide-react';
import { EscalateTicketModal } from '@/components/modals/EscalateTicketModal';
import { migratePlainTextToHtml } from '@/lib/draft-content-utils';

interface DraftEditorPanelProps {
  ticketNumber: string;
  onJiraTicketCreated?: (jiraTicketId: string) => void;
}

interface Draft {
  id: number;
  ticketNumber: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'sent';
}

export function DraftEditorPanel({ ticketNumber, onJiraTicketCreated }: DraftEditorPanelProps) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);
  const [regenerateInstructions, setRegenerateInstructions] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [isJiraTicketCreated, setIsJiraTicketCreated] = useState(false);
  const [jiraTicketId, setJiraTicketId] = useState<string | null>(null);

  // TipTap editor configuration
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: 'Start typing your draft response...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      // Debounced auto-save
      handleAutoSave(editor.getHTML());
    },
  });

  // Fetch draft and check Jira ticket status when component mounts or ticket changes
  useEffect(() => {
    fetchDraft();
    checkJiraTicketStatus();
  }, [ticketNumber]);

  // Check if Jira ticket was already created
  const checkJiraTicketStatus = async () => {
    try {
      const basePath = window.location.pathname.startsWith('/dsq') ? '/dsq' : '';
      const response = await fetch(`${basePath}/api/tickets/${ticketNumber}`);
      const data = await response.json();

      if (response.ok && data.ticket && data.ticket.isJiraTicketCreated) {
        setIsJiraTicketCreated(true);
        console.log('[Draft] Jira ticket already created, disabling escalation button');
      }
    } catch (error) {
      console.error('[Draft] Error checking Jira ticket status:', error);
    }
  };

  // Debug: Log when toast state changes
  useEffect(() => {
    console.log('[Draft] Toast state changed:', toast);
  }, [toast]);

  // Update editor content when draft loads (only if pending)
  useEffect(() => {
    if (editor && draft && draft.status === 'pending') {
      // Use robust migration function to handle plain text, markdown, and HTML
      const htmlContent = migratePlainTextToHtml(draft.content);

      editor.commands.setContent(htmlContent);
      console.log('[Draft] Raw content from DB:', draft.content);
      console.log('[Draft] Converted HTML:', htmlContent);
    }
  }, [editor, draft]);

  // Fetch draft from API
  const fetchDraft = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const basePath = window.location.pathname.startsWith('/dsq') ? '/dsq' : '';
      const response = await fetch(`${basePath}/api/tickets/${ticketNumber}/draft`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch draft');
      }

      setDraft(data.draft);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load draft';
      setError(errorMsg);
      console.error('[DraftEditorPanel] Fetch error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced auto-save (2 seconds)
  const handleAutoSave = useCallback(
    debounce(async (content: string) => {
      setSaveStatus('saving');
      setIsSaving(true);

      try {
        const basePath = window.location.pathname.startsWith('/dsq') ? '/dsq' : '';
        const response = await fetch(`${basePath}/api/tickets/${ticketNumber}/draft`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save draft');
        }

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to save draft';
        setError(errorMsg);
        console.error('[DraftEditorPanel] Save error:', errorMsg);
        setSaveStatus('idle');
      } finally {
        setIsSaving(false);
      }
    }, 2000),
    [ticketNumber]
  );

  // Send response via n8n webhook
  const handleSendResponse = async () => {
    if (!editor) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // Extract numeric ticket ID
      const numericTicketNumber = ticketNumber.replace(/^TICK-?/i, '');

      // Get final draft content from editor as HTML (preserves all formatting)
      const finalDraft = editor.getHTML();

      console.log('[Draft] Calling n8n webhook to send message');
      console.log('[Draft] Final HTML with all formatting:', finalDraft);
      console.log('[Draft] Payload:', {
        ticket_id: numericTicketNumber,
        final_draft: finalDraft
      });

      // Call n8n webhook
      const response = await fetch('https://auzmor.app.n8n.cloud/webhook/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket_id: numericTicketNumber,
          final_draft: finalDraft,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send response');
      }

      const data = await response.json();
      console.log('[Draft] Message sent successfully:', data);
      console.log('[Draft] Response is array?', Array.isArray(data));
      console.log('[Draft] Response length:', data?.length);

      // Validate response format (array with objects)
      if (Array.isArray(data) && data.length > 0) {
        console.log('[Draft] Message sent successfully');

        // Reload the draft to get updated status
        await fetchDraft();
      } else {
        console.log('[Draft] Invalid response format, throwing error');
        throw new Error('Invalid response format from webhook');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send response';
      console.error('[DraftEditorPanel] Send error:', errorMsg);

      // Show error toast
      console.log('[Draft] Setting error toast at', new Date().toISOString());
      setToast({ type: 'error', message: 'Failed to Send! Please try again.' });
      setTimeout(() => {
        console.log('[Draft] Clearing error toast at', new Date().toISOString());
        setToast(null);
      }, 3000);
    } finally {
      setIsSending(false);
    }
  };

  // Regenerate draft via n8n webhook
  const handleRegenerateDraft = async () => {
    if (!regenerateInstructions.trim() || !editor) {
      return;
    }

    setIsRegenerating(true);
    setError(null);

    try {
      // Extract numeric ticket ID
      const numericTicketNumber = ticketNumber.replace(/^TICK-?/i, '');

      // Get current draft content
      const currentContent = editor.getHTML();

      console.log('[Draft] Calling n8n webhook to regenerate draft');
      console.log('[Draft] Payload:', {
        ticketId: numericTicketNumber,
        currentDraft: currentContent,
        instructions: regenerateInstructions
      });

      // Call n8n webhook
      const response = await fetch('https://auzmor.app.n8n.cloud/webhook/regenerateDraft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: numericTicketNumber,
          currentDraft: currentContent,
          instructions: regenerateInstructions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate draft');
      }

      const data = await response.json();
      console.log('[Draft] Regenerated draft received:', data);

      // Response is an array with one object containing modified_draft
      if (Array.isArray(data) && data.length > 0 && data[0].modified_draft) {
        const modifiedDraft = data[0].modified_draft;
        console.log('[Draft] Raw regenerated draft from webhook:', modifiedDraft);

        // Use the same migration function to ensure consistent formatting
        const htmlContent = migratePlainTextToHtml(modifiedDraft);
        console.log('[Draft] Converted HTML for editor:', htmlContent);

        // Update editor with properly formatted HTML
        editor.commands.setContent(htmlContent);

        // Close regenerate input
        setShowRegenerateInput(false);
        setRegenerateInstructions('');
      } else {
        throw new Error('Invalid response format from webhook');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to regenerate draft';
      setError(errorMsg);
      console.error('[DraftEditorPanel] Regenerate error:', errorMsg);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mr-2" />
        <span className="text-sm text-muted-foreground">Loading draft...</span>
      </div>
    );
  }

  if (error && !draft) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Failed to load draft</p>
            <p className="text-xs text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // If draft status is 'sent', show read-only message with buttons
  if (draft && draft.status === 'sent') {
    return (
      <>
        {/* Toast Notification - Rendered via Portal */}
        {toast && typeof document !== 'undefined' && createPortal(
          <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-2 fade-in duration-300">
            <div className={`
              flex items-center gap-3 px-4 py-3 rounded-lg
              border backdrop-blur-md shadow-lg min-w-[320px]
              ${toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
              }
            `}>
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium flex-1">{toast.message}</span>
              <button
                onClick={() => setToast(null)}
                className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>,
          document.body
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Draft Response</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-500">
              Sent
            </span>
          </div>
          <div className="p-8 bg-muted/30 border border-border rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              No drafts available. The previous draft has been sent.
            </p>
          </div>

          {/* Footer with Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Draft Info */}
            <div className="flex-shrink-0">
              <p className="text-xs text-muted-foreground">
                Draft sent: {new Date(draft.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Right: Action Buttons or Regenerate Input */}
            {showRegenerateInput ? (
              /* Regenerate Input Mode */
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={regenerateInstructions}
                  onChange={(e) => setRegenerateInstructions(e.target.value)}
                  placeholder="Enter instructions for AI (e.g., make it more professional, add technical details...)"
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-muted-foreground"
                  autoFocus
                  disabled={isRegenerating}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && regenerateInstructions.trim() && !isRegenerating) {
                      handleRegenerateDraft();
                    } else if (e.key === 'Escape') {
                      setShowRegenerateInput(false);
                      setRegenerateInstructions('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setShowRegenerateInput(false);
                    setRegenerateInstructions('');
                  }}
                  disabled={isRegenerating}
                  className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRegenerateDraft}
                  disabled={!regenerateInstructions.trim() || isRegenerating}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send instructions"
                >
                  {isRegenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              /* Normal Button Mode */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRegenerateInput(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
                  title="Regenerate draft using AI"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Draft
                </button>

                <button
                  onClick={() => setShowEscalateModal(true)}
                  disabled={isJiraTicketCreated}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-amber-600/20 text-amber-500 border border-amber-600/30 rounded-lg hover:bg-amber-600/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  title={isJiraTicketCreated ? "Ticket already escalated to Jira" : "Escalate this ticket"}
                >
                  <AlertTriangle className="w-4 h-4" />
                  {isJiraTicketCreated ? 'Escalated to Jira' : 'Escalate Ticket'}
                </button>

                <button
                  onClick={handleSendResponse}
                  disabled={isSending}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send response to customer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Response
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Escalate Ticket Modal */}
        <EscalateTicketModal
          isOpen={showEscalateModal}
          onClose={() => {
            setShowEscalateModal(false);
            // Refresh Jira ticket status after modal closes
            checkJiraTicketStatus();
          }}
          ticketNumber={ticketNumber}
          onJiraTicketCreated={(newJiraTicketId) => {
            setIsJiraTicketCreated(true);
            setJiraTicketId(newJiraTicketId);
            // Notify parent component (LiveTicketDetailWidget)
            if (onJiraTicketCreated) {
              onJiraTicketCreated(newJiraTicketId);
            }
          }}
        />
      </>
    );
  }

  // Debug: Log before render
  console.log('[Draft] Rendering component, toast =', toast);

  return (
    <>
      {/* Toast Notification - Rendered via Portal */}
      {toast && typeof document !== 'undefined' && createPortal(
        <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`
            flex items-center gap-3 px-4 py-3 rounded-lg
            border backdrop-blur-md shadow-lg min-w-[320px]
            ${toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
            }
          `}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>,
        document.body
      )}

      <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Draft Response</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-500">
              <Save className="w-3 h-3" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      {editor && (
        <div className="flex items-center gap-1 p-2 bg-card border border-border rounded-lg">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-accent ${
              editor.isActive('bold') ? 'bg-accent text-primary' : 'text-muted-foreground'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-accent ${
              editor.isActive('italic') ? 'bg-accent text-primary' : 'text-muted-foreground'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-accent ${
              editor.isActive('bulletList') ? 'bg-accent text-primary' : 'text-muted-foreground'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-accent ${
              editor.isActive('orderedList') ? 'bg-accent text-primary' : 'text-muted-foreground'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-accent text-muted-foreground disabled:opacity-30"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-accent text-muted-foreground disabled:opacity-30"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <EditorContent editor={editor} />
      </div>

      {/* Footer with Actions */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Draft Info */}
        <div className="flex-shrink-0">
          {draft && (
            <p className="text-xs text-muted-foreground">
              Draft created: {new Date(draft.createdAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Right: Action Buttons or Regenerate Input */}
        {showRegenerateInput ? (
          /* Regenerate Input Mode */
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={regenerateInstructions}
              onChange={(e) => setRegenerateInstructions(e.target.value)}
              placeholder="Enter instructions for AI (e.g., make it more professional, add technical details...)"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-muted-foreground"
              autoFocus
              disabled={isRegenerating}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && regenerateInstructions.trim() && !isRegenerating) {
                  handleRegenerateDraft();
                } else if (e.key === 'Escape') {
                  setShowRegenerateInput(false);
                  setRegenerateInstructions('');
                }
              }}
            />
            <button
              onClick={() => {
                setShowRegenerateInput(false);
                setRegenerateInstructions('');
              }}
              disabled={isRegenerating}
              className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleRegenerateDraft}
              disabled={!regenerateInstructions.trim() || isRegenerating}
              className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send instructions"
            >
              {isRegenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        ) : (
          /* Normal Button Mode */
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRegenerateInput(true)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
              title="Regenerate draft using AI"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate Draft
            </button>

            <button
              onClick={() => setShowEscalateModal(true)}
              disabled={isJiraTicketCreated}
              className="inline-flex items-center gap-2 px-3 py-2 bg-amber-600/20 text-amber-500 border border-amber-600/30 rounded-lg hover:bg-amber-600/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title={isJiraTicketCreated ? "Ticket already escalated to Jira" : "Escalate this ticket"}
            >
              <AlertTriangle className="w-4 h-4" />
              {isJiraTicketCreated ? 'Escalated to Jira' : 'Escalate Ticket'}
            </button>

            <button
              onClick={handleSendResponse}
              disabled={isSending}
              className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send response to customer"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Response
                </>
              )}
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Escalate Ticket Modal */}
      <EscalateTicketModal
        isOpen={showEscalateModal}
        onClose={() => {
          setShowEscalateModal(false);
          // Refresh Jira ticket status after modal closes
          checkJiraTicketStatus();
        }}
        ticketNumber={ticketNumber}
        onJiraTicketCreated={(newJiraTicketId) => {
          setIsJiraTicketCreated(true);
          setJiraTicketId(newJiraTicketId);
          // Notify parent component (LiveTicketDetailWidget)
          if (onJiraTicketCreated) {
            onJiraTicketCreated(newJiraTicketId);
          }
        }}
      />
    </>
  );
}

// Debounce utility
function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
