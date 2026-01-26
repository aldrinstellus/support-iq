'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      // Base path must match the auth.ts basePath configuration
      basePath="/dsq/api/auth"
      // Disable automatic session refetch to reduce errors on demo pages
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
