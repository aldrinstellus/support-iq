'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { WidgetType, WidgetData } from '@/types/widget';

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'widget';
  content?: string;
  widgetType?: WidgetType;
  widgetData?: WidgetData;
  timestamp: Date;
  feedback?: 'like' | 'dislike';
  userQuery?: string;
  isTyping?: boolean;
}

interface ConversationContextType {
  messagesByPersona: Record<string, Message[]>;
  setMessagesByPersona: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
  clearAllConversations: () => void;
  clearPersonaConversation: (personaId: string) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: ReactNode }) {
  // Per-persona message storage with localStorage persistence
  // Initialize with empty object to avoid hydration mismatch
  const [messagesByPersona, setMessagesByPersona] = useState<Record<string, Message[]>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('messagesByPersona');
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, Array<Omit<Message, 'timestamp'> & { timestamp: string }>>;
        // Convert ISO string dates back to Date objects
        const converted: Record<string, Message[]> = {};
        Object.keys(parsed).forEach(key => {
          converted[key] = parsed[key].map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        });
        console.log('[ConversationContext] Loaded messages from localStorage:', converted);
        setMessagesByPersona(converted);
      }
    } catch (error) {
      console.error('[ConversationContext] Failed to load messages from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever messagesByPersona changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return; // Don't save until hydrated to avoid overwriting with empty state
    try {
      localStorage.setItem('messagesByPersona', JSON.stringify(messagesByPersona));
      console.log('[ConversationContext] Saved messages to localStorage');
    } catch (error) {
      console.error('[ConversationContext] Failed to save messages to localStorage:', error);
    }
  }, [messagesByPersona, isHydrated]);

  const clearAllConversations = () => {
    setMessagesByPersona({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('messagesByPersona');
      console.log('[ConversationContext] Cleared all conversations');
    }
  };

  const clearPersonaConversation = (personaId: string) => {
    setMessagesByPersona(prev => {
      const updated = { ...prev };
      delete updated[personaId];
      console.log('[ConversationContext] Cleared conversation for persona:', personaId);
      return updated;
    });
  };

  return (
    <ConversationContext.Provider value={{ messagesByPersona, setMessagesByPersona, clearAllConversations, clearPersonaConversation }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
}
