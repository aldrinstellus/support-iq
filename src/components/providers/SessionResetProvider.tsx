'use client';

import { useEffect, ReactNode } from 'react';
import { initSessionReset } from '@/lib/session-reset';

interface SessionResetProviderProps {
  children: ReactNode;
}

/**
 * Provider that initializes session reset on app load.
 * Clears demo data at the start of each new browser session.
 */
export function SessionResetProvider({ children }: SessionResetProviderProps) {
  useEffect(() => {
    // Initialize session reset on mount
    initSessionReset();
  }, []);

  return <>{children}</>;
}
