'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ModeType } from '@/types/persona';

const MODE_STORAGE_KEY = 'selected-mode';

interface ModeContextType {
  currentMode: ModeType;
  setMode: (mode: ModeType) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({
  children,
  initialMode
}: {
  children: ReactNode;
  initialMode?: ModeType;
}) {
  const [currentMode, setCurrentMode] = useState<ModeType>(initialMode || 'government');

  // Load from localStorage on mount (only if no initialMode provided)
  useEffect(() => {
    if (initialMode) {
      // If initialMode is provided, use it and save to localStorage
      setCurrentMode(initialMode);
      localStorage.setItem(MODE_STORAGE_KEY, initialMode);
      return;
    }

    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ModeType | null;
    if (savedMode && (savedMode === 'government' || savedMode === 'project' || savedMode === 'atc')) {
      setCurrentMode(savedMode);
    }
  }, [initialMode]);

  // Save to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem(MODE_STORAGE_KEY, currentMode);
  }, [currentMode]);

  const setMode = (mode: ModeType) => {
    setCurrentMode(mode);
    // Mode change will trigger persona filtering in usePersona hook
  };

  return (
    <ModeContext.Provider value={{ currentMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
}
