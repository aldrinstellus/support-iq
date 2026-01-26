/**
 * Session Reset Utility
 *
 * IMPORTANT: The actual clearing now happens in a synchronous inline script
 * in layout.tsx that runs BEFORE React hydrates. This prevents race conditions
 * where ConversationContext might load stale data before the clear happens.
 *
 * This utility now serves as:
 * 1. A confirmation logger (verifies the sync script ran correctly)
 * 2. A fallback if somehow the sync script didn't run
 *
 * Keys cleared on new session:
 * - messagesByPersona (conversation history)
 * - sidebarOpen (UI state)
 *
 * Keys preserved:
 * - sana-theme (user preference)
 * - selected-mode (nice to have for returning users within session)
 */

const SESSION_MARKER_KEY = 'dsq_session_active';
const DEMO_DATA_KEYS = [
  'messagesByPersona',
  'sidebarOpen',
];

/**
 * Check if this is a new browser session and clear demo data if so.
 * Called once on app initialization as a BACKUP to the sync script.
 * The sync script in layout.tsx should have already cleared the data.
 */
export function initSessionReset(): void {
  if (typeof window === 'undefined') return;

  const sessionActive = sessionStorage.getItem(SESSION_MARKER_KEY);

  if (!sessionActive) {
    // This should rarely happen since sync script handles it first
    // But as a fallback, clear any remaining data
    console.log('[SessionReset:React] New session detected - clearing demo data (fallback)');

    DEMO_DATA_KEYS.forEach(key => {
      const exists = localStorage.getItem(key);
      if (exists) {
        localStorage.removeItem(key);
        console.log(`[SessionReset:React] Cleared: ${key}`);
      }
    });

    // Mark session as active
    sessionStorage.setItem(SESSION_MARKER_KEY, 'true');
    console.log('[SessionReset:React] Session marked as active');
  } else {
    console.log('[SessionReset:React] Existing session confirmed - keeping data');
  }
}

/**
 * Force clear all demo data (can be called manually)
 */
export function forceResetDemoData(): void {
  if (typeof window === 'undefined') return;

  console.log('[SessionReset] Force reset triggered');

  DEMO_DATA_KEYS.forEach(key => {
    localStorage.removeItem(key);
  });

  // Also clear the session marker to simulate a fresh session
  sessionStorage.removeItem(SESSION_MARKER_KEY);

  console.log('[SessionReset] All demo data cleared');
}

/**
 * Get list of all localStorage keys used by DSQ
 */
export function getDemoDataKeys(): string[] {
  return [...DEMO_DATA_KEYS];
}
