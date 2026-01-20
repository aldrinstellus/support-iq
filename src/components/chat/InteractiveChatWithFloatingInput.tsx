'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, PanelLeft, PanelLeftClose } from 'lucide-react';
import { InteractiveChat, type InteractiveChatRef } from './InteractiveChat';
import { CommandPalette } from '../concepts/CommandPalette';
import { usePersona } from '@/hooks/use-persona';
import { useSidebar } from '@/contexts/SidebarContext';
import { useQuickAction } from '@/contexts/QuickActionContext';
import { getDashboardWidgets } from '@/config/dashboard-widgets';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { FloatingModeSwitcher } from '@/components/layout/FloatingModeSwitcher';

export function InteractiveChatWithFloatingInput() {
  const { currentPersona, isHydrated } = usePersona();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const { quickActionQuery, setQuickActionQuery } = useQuickAction();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isMac, setIsMac] = useState(true); // Default to Mac, update on mount
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<InteractiveChatRef>(null);
  const processingQueryRef = useRef<string | null>(null);

  // Detect OS for keyboard shortcut display
  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    const isMacOS = platform.includes('mac') || userAgent.includes('mac');
    setIsMac(isMacOS);
  }, []);

  // Get widgets from dashboard config
  const widgets = getDashboardWidgets(currentPersona.id);

  // Monitor QuickAction context for widget click events
  useEffect(() => {
    if (quickActionQuery && quickActionQuery !== processingQueryRef.current) {
      processingQueryRef.current = quickActionQuery;
      chatRef.current?.submitQuery(quickActionQuery);
      setQuickActionQuery(null);
      // Clear the processing ref after a brief delay
      setTimeout(() => {
        processingQueryRef.current = null;
      }, 100);
    }
  }, [quickActionQuery, setQuickActionQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to toggle command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWidgetClick = (query: string) => {
    // Trigger the query in InteractiveChat via ref
    chatRef.current?.submitQuery(query);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Trigger query via ref
    chatRef.current?.submitQuery(inputValue);

    // Clear input
    setInputValue('');
  };

  // Note: Hydration is now handled by HydrationGate in DemoLayout
  // This component only renders after isHydrated is true

  return (
    <div className="relative h-full">
      {/* Hide InteractiveChat's default input with CSS */}
      <style jsx global>{`
        .floating-input-wrapper .absolute.bottom-0 {
          display: none;
        }
      `}</style>

      {/* Top Left - Sidebar Toggle */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center rounded-lg border border-border bg-card p-2 hover:bg-muted transition-all"
          title={`${sidebarOpen ? 'Close' : 'Open'} sidebar (${isMac ? '⌘B' : 'Ctrl+B'})`}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
          ) : (
            <PanelLeft className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Top Right - Mode Switcher & Theme Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <FloatingModeSwitcher />
        <ThemeToggle />
      </div>

      <div className="floating-input-wrapper h-full">
        <InteractiveChat ref={chatRef} persona={currentPersona} />
      </div>

      {/* Floating Input Bar - Responsive */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${sidebarOpen ? 'lg:left-[calc(50%+150px)]' : ''} w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-[calc(100vw-320px)] px-4 sm:px-6 flex flex-col sm:flex-row items-center gap-3 z-10 transition-all duration-300`}>
          {/* Input with inline Send button */}
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What would you like to do?"
              data-testid="chat-input"
              className="w-full pl-6 pr-14 py-4 bg-card/90 backdrop-blur-xl border border-border/50 rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xl transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              data-testid="send-button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Launch Button */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-5 py-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 hover:bg-primary/90 whitespace-nowrap"
          >
            <span className="text-sm font-medium">Quick Launch</span>
            <kbd className="hidden lg:inline px-2 py-1 bg-primary-foreground/20 rounded text-xs">{isMac ? '⌘K' : 'Ctrl+K'}</kbd>
          </button>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        widgets={widgets}
        onWidgetClick={handleWidgetClick}
      />
    </div>
  );
}
