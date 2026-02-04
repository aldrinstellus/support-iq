'use client';

/**
 * Escalate Ticket Modal
 * Modal for escalating tickets to external platforms (JIRA, etc.)
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  X,
  ChevronDown,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlertCircle,
} from 'lucide-react';

interface EscalateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string;
  onJiraTicketCreated?: (jiraTicketId: string) => void;
}

type Platform = 'jira' | 'zendesk' | 'servicenow';

/**
 * Clean and unescape HTML content from webhook
 * Removes escape sequences like \n, \\, etc.
 */
const cleanHtmlContent = (html: string): string => {
  // Remove escaped newlines and replace with actual newlines
  let cleaned = html.replace(/\\n/g, '\n');

  // Remove double backslashes
  cleaned = cleaned.replace(/\\\\/g, '');

  // Trim excessive whitespace and newlines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');

  return cleaned.trim();
};

/**
 * Convert ProseMirror JSON to Atlassian Document Format (ADF)
 * Preserves all formatting including underline, bold, italic, etc.
 */
const proseMirrorToAdf = (pmJson: any): any => {
  // Map ProseMirror node types to ADF node types
  const mapNodeType = (type: string): string => {
    const mapping: Record<string, string> = {
      'doc': 'doc',
      'paragraph': 'paragraph',
      'heading': 'heading',
      'bulletList': 'bulletList',
      'orderedList': 'orderedList',
      'listItem': 'listItem',
      'text': 'text',
      'hardBreak': 'hardBreak',
      'codeBlock': 'codeBlock',
      'blockquote': 'blockquote',
      'horizontalRule': 'rule',
    };
    return mapping[type] || type;
  };

  // Map ProseMirror mark types to ADF mark types
  const mapMarkType = (type: string): string => {
    const mapping: Record<string, string> = {
      'bold': 'strong',
      'italic': 'em',
      'underline': 'underline',
      'strike': 'strike',
      'code': 'code',
      'link': 'link',
    };
    return mapping[type] || type;
  };

  // Node types that should have content arrays
  const contentNodes = new Set([
    'doc', 'paragraph', 'heading', 'bulletList', 'orderedList',
    'listItem', 'codeBlock', 'blockquote'
  ]);

  // Node types that are leaf nodes (no content)
  const leafNodes = new Set(['text', 'hardBreak', 'rule']);

  // Recursively convert nodes
  const convertNode = (node: any): any => {
    const mappedType = mapNodeType(node.type);
    const adfNode: any = {
      type: mappedType,
    };

    // Add attributes based on node type
    if (node.type === 'heading' && node.attrs?.level) {
      adfNode.attrs = { level: node.attrs.level };
    } else if (node.type === 'orderedList') {
      adfNode.attrs = { order: node.attrs?.order || 1 };
    } else if (node.attrs) {
      // Copy other attributes
      adfNode.attrs = { ...node.attrs };
    }

    // Handle content (child nodes) - only for non-leaf nodes
    if (contentNodes.has(node.type)) {
      if (node.content && Array.isArray(node.content) && node.content.length > 0) {
        adfNode.content = node.content.map(convertNode).filter((n: any) => n !== null);
      } else {
        // Empty content array for block nodes
        adfNode.content = [];
      }
    }

    // Convert marks (formatting) - only for text nodes
    if (node.marks && Array.isArray(node.marks) && node.marks.length > 0) {
      adfNode.marks = node.marks.map((mark: any) => ({
        type: mapMarkType(mark.type),
        ...(mark.attrs && { attrs: mark.attrs }),
      }));
    }

    // Add text content - only for text nodes
    if (node.type === 'text') {
      adfNode.text = node.text || '';
    }

    return adfNode;
  };

  // Convert root doc node
  const adf = convertNode(pmJson);

  // Ensure version is set at root level
  return {
    version: 1,
    type: adf.type,
    content: adf.content || [],
  };
};

export function EscalateTicketModal({ isOpen, onClose, ticketNumber, onJiraTicketCreated }: EscalateTicketModalProps) {
  const [platform, setPlatform] = useState<Platform>('jira');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [jiraContent, setJiraContent] = useState<string | null>(null);
  const [isJiraTicketCreated, setIsJiraTicketCreated] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // TipTap editor for description with Jira ADF support
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: '<p>Ticket Description</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px] px-3 py-2',
      },
    },
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setJiraContent(null);
      setTitle('');
    }
  }, [isOpen]);

  // Fetch ticket data and Jira content preview when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoadingTicket(true);
      setIsLoadingContent(true);

      try {
        // Extract numeric ticket ID
        const numericTicketNumber = ticketNumber.replace(/^TICK-?/i, '');

        // Fetch ticket data and Jira content preview in parallel
        const [ticketResponse, jiraContentResponse] = await Promise.all([
          fetch(
            `${window.location.pathname.startsWith('/dsq') ? '/dsq' : ''}/api/tickets/${ticketNumber}`
          ),
          fetch('https://auzmor.app.n8n.cloud/webhook/previewJiraContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_id: numericTicketNumber }),
          }),
        ]);

        // Process ticket data
        if (ticketResponse.ok) {
          const ticketData = await ticketResponse.json();
          if (ticketData.ticket) {
            setTitle(ticketData.ticket.subject || '');

            // Check if Jira ticket was already created
            if (ticketData.ticket.isJiraTicketCreated) {
              setIsJiraTicketCreated(true);
              console.log('[EscalateModal] Jira ticket already exists, disabling escalation');
            }
          }
        }

        // Process Jira content preview
        if (jiraContentResponse.ok) {
          const jiraData = await jiraContentResponse.json();
          console.log('[EscalateModal] Jira preview response:', jiraData);

          // Response format: [{"description": "htmlString"}]
          if (Array.isArray(jiraData) && jiraData.length > 0 && jiraData[0].description) {
            const rawHtml = jiraData[0].description;
            console.log('[EscalateModal] Raw HTML content:', rawHtml.substring(0, 200));

            // Clean and unescape the HTML content
            const cleanedHtml = cleanHtmlContent(rawHtml);
            console.log('[EscalateModal] Cleaned HTML content:', cleanedHtml.substring(0, 200));

            // Store content in state
            setJiraContent(cleanedHtml);
          } else {
            console.log('[EscalateModal] Invalid response format:', jiraData);
          }
        } else {
          console.log('[EscalateModal] Jira content response not ok:', jiraContentResponse.status);
        }
      } catch (error) {
        console.error('[EscalateModal] Error fetching data:', error);
      } finally {
        setIsLoadingTicket(false);
        setIsLoadingContent(false);
      }
    };

    fetchData();
  }, [isOpen, ticketNumber]);

  // Set editor content when both editor and jiraContent are ready
  useEffect(() => {
    if (editor && jiraContent) {
      console.log('[EscalateModal] Setting editor content from state');
      console.log('[EscalateModal] Editor ready?', editor.isEditable);
      editor.commands.setContent(jiraContent);
      console.log('[EscalateModal] Content set, current HTML:', editor.getHTML().substring(0, 100));
    }
  }, [editor, jiraContent]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = async () => {
    if (!editor) return;

    setIsSubmitting(true);

    try {
      // Extract numeric ticket ID
      const numericTicketNumber = ticketNumber.replace(/^TICK-?/i, '');

      // Get ProseMirror JSON from editor
      const pmJson = editor.getJSON();
      console.log('[Escalate] ProseMirror JSON:', JSON.stringify(pmJson, null, 2));

      // Convert to Jira ADF format
      const adfContent = proseMirrorToAdf(pmJson);
      console.log('[Escalate] Jira ADF:', JSON.stringify(adfContent, null, 2));

      // Prepare payload
      const payload = {
        ticket_id: numericTicketNumber,
        title: title,
        description: adfContent, // This is the Jira ADF object
      };

      console.log('[Escalate] Submitting to Jira webhook:', payload);

      // Call n8n webhook to escalate to Jira
      const response = await fetch('https://auzmor.app.n8n.cloud/webhook/escalateToJira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('[Escalate] Jira escalation response:', result);

      // Validate response format: [{ jiraTicketId: "KAN-135", ... }]
      if (Array.isArray(result) && result.length > 0 && result[0].jiraTicketId) {
        console.log('[Escalate] Jira ticket created:', result[0].jiraTicketId);

        // Optimistically disable the escalate button
        setIsJiraTicketCreated(true);

        // Notify parent component with the jiraTicketId
        if (onJiraTicketCreated) {
          onJiraTicketCreated(result[0].jiraTicketId);
        }

        // Close modal on success
        onClose();
      } else {
        // Invalid response format
        console.error('[Escalate] Invalid response format:', result);
        setToast({ type: 'error', message: 'Failed to create a ticket.' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error('[Escalate] Error:', error);
      setToast({ type: 'error', message: 'Failed to create a ticket.' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const platformOptions = [
    { value: 'jira', label: 'JIRA', icon: '🔷' },
    { value: 'zendesk', label: 'Zendesk', icon: '🎫' },
    { value: 'servicenow', label: 'ServiceNow', icon: '⚡' },
  ] as const;

  const selectedPlatform = platformOptions.find(opt => opt.value === platform);

  return createPortal(
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[10001] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`
            flex items-center gap-3 px-4 py-3 rounded-lg
            border backdrop-blur-md shadow-lg min-w-[320px]
            ${toast.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }
          `}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div className="relative w-full max-w-2xl mx-4 bg-card border border-border rounded-lg shadow-2xl overflow-hidden">

        {/* Loading Overlay */}
        {isLoadingContent && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading content...</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Escalate To
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 h-[calc(90vh-200px)] overflow-y-auto">

          {/* Platform Dropdown */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Platform
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
              >
                <span className="text-lg">{selectedPlatform?.icon}</span>
                <span className="flex-1 text-left">{selectedPlatform?.label}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {/* TODO: Implement dropdown menu */}
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Title
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isLoadingTicket ? "Loading ticket subject..." : "Ticket Title"}
              rows={3}
              disabled={isLoadingTicket}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-50"
            />
          </div>

          {/* Description Field with TipTap Editor */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Description
            </label>

            {/* Formatting Toolbar */}
            {editor && (
              <div className="flex items-center gap-1 p-2 bg-background border border-border rounded-t-lg">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-accent ${
                    editor.isActive('bold') ? 'bg-accent text-primary' : 'text-muted-foreground'
                  }`}
                  title="Bold"
                  type="button"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-accent ${
                    editor.isActive('italic') ? 'bg-accent text-primary' : 'text-muted-foreground'
                  }`}
                  title="Italic"
                  type="button"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-2 rounded hover:bg-accent ${
                    editor.isActive('underline') ? 'bg-accent text-primary' : 'text-muted-foreground'
                  }`}
                  title="Underline"
                  type="button"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-accent ${
                    editor.isActive('bulletList') ? 'bg-accent text-primary' : 'text-muted-foreground'
                  }`}
                  title="Bullet List"
                  type="button"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-accent ${
                    editor.isActive('orderedList') ? 'bg-accent text-primary' : 'text-muted-foreground'
                  }`}
                  title="Numbered List"
                  type="button"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Editor */}
            <div className="bg-background border border-border border-t-0 rounded-b-lg overflow-hidden">
              <EditorContent editor={editor} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>

        </div>
      </div>
    </>,
    document.body
  );
}
