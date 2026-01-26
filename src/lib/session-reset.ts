/**
 * Session Reset Utility
 *
 * Clears conversation data at the start of each new browser session.
 * This ensures the demo always starts fresh for new visitors.
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
 * Called once on app initialization.
 */
export function initSessionReset(): void {
  if (typeof window === 'undefined') return;

  const sessionActive = sessionStorage.getItem(SESSION_MARKER_KEY);

  if (!sessionActive) {
    // New session - clear all demo data
    console.log('[SessionReset] New session detected - clearing demo data');

    DEMO_DATA_KEYS.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[SessionReset] Cleared: ${key}`);
    });

    // Mark session as active
    sessionStorage.setItem(SESSION_MARKER_KEY, 'true');
    console.log('[SessionReset] Session marked as active');
  } else {
    console.log('[SessionReset] Existing session - keeping data');
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
