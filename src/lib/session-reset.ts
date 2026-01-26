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
 * 3. User isolation - detects when a different user logs in
 *
 * Keys cleared on new session OR user change:
 * - messagesByPersona (conversation history)
 * - sidebarOpen (UI state)
 *
 * Keys preserved:
 * - sana-theme (user preference)
 * - selected-mode (nice to have for returning users within session)
 */

const SESSION_MARKER_KEY = 'dsq_session_active';
const LAST_USER_KEY = 'dsq_last_user_id';
const ANALYTICS_SESSION_KEY = 'dw_analytics_session';
const DEMO_DATA_KEYS = [
  'messagesByPersona',
  'sidebarOpen',
];

/**
 * Get current user ID from the shared analytics session
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const analyticsSession = localStorage.getItem(ANALYTICS_SESSION_KEY);
    if (analyticsSession) {
      const parsed = JSON.parse(analyticsSession);
      return parsed.userId || null;
    }
  } catch {
    console.log('[SessionReset] Could not parse analytics session');
  }
  return null;
}

/**
 * Get the last known user ID
 */
export function getLastUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_USER_KEY);
}

/**
 * Check if the user has changed since last visit
 */
export function hasUserChanged(): boolean {
  const currentUserId = getCurrentUserId();
  const lastUserId = getLastUserId();

  // If no current user, we can't determine change
  if (!currentUserId) return false;

  // If no last user, this is first visit (not a change, but new session handles this)
  if (!lastUserId) return false;

  return currentUserId !== lastUserId;
}

/**
 * Clear all demo data
 */
function clearDemoData(): void {
  DEMO_DATA_KEYS.forEach(key => {
    const exists = localStorage.getItem(key);
    if (exists) {
      localStorage.removeItem(key);
      console.log(`[SessionReset:React] Cleared: ${key}`);
    }
  });
}

/**
 * Check if this is a new browser session or different user, and clear demo data if so.
 * Called once on app initialization as a BACKUP to the sync script.
 * The sync script in layout.tsx should have already cleared the data.
 */
export function initSessionReset(): void {
  if (typeof window === 'undefined') return;

  const sessionActive = sessionStorage.getItem(SESSION_MARKER_KEY);
  const currentUserId = getCurrentUserId();
  const lastUserId = getLastUserId();
  const userChanged = currentUserId && lastUserId && currentUserId !== lastUserId;

  if (!sessionActive || userChanged) {
    // New session or user changed - clear all demo data
    const reason = !sessionActive ? 'new session' : `user changed from ${lastUserId} to ${currentUserId}`;
    console.log(`[SessionReset:React] Clearing demo data - reason: ${reason}`);

    clearDemoData();

    // Mark session as active
    sessionStorage.setItem(SESSION_MARKER_KEY, 'true');
    console.log('[SessionReset:React] Session marked as active');
  } else {
    console.log('[SessionReset:React] Existing session, same user - keeping data');
  }

  // Always update last user ID if we have a current user
  if (currentUserId) {
    localStorage.setItem(LAST_USER_KEY, currentUserId);
    console.log(`[SessionReset:React] User ID tracked: ${currentUserId}`);
  }
}

/**
 * Force clear all demo data (can be called manually)
 */
export function forceResetDemoData(): void {
  if (typeof window === 'undefined') return;

  console.log('[SessionReset] Force reset triggered');

  clearDemoData();

  // Also clear the session marker to simulate a fresh session
  sessionStorage.removeItem(SESSION_MARKER_KEY);

  // Clear user tracking
  localStorage.removeItem(LAST_USER_KEY);

  console.log('[SessionReset] All demo data cleared');
}

/**
 * Get list of all localStorage keys used by DSQ
 */
export function getDemoDataKeys(): string[] {
  return [...DEMO_DATA_KEYS];
}

/**
 * Check for user change and clear data if needed (can be called reactively)
 * Returns true if data was cleared
 */
export function checkAndClearOnUserChange(): boolean {
  if (typeof window === 'undefined') return false;

  if (hasUserChanged()) {
    const currentUserId = getCurrentUserId();
    const lastUserId = getLastUserId();
    console.log(`[SessionReset] User changed from ${lastUserId} to ${currentUserId} - clearing data`);

    clearDemoData();

    // Update tracked user
    if (currentUserId) {
      localStorage.setItem(LAST_USER_KEY, currentUserId);
    }

    return true;
  }

  return false;
}
