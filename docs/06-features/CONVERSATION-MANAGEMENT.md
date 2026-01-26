# Conversation Management

**Last Updated**: January 26, 2026
**Version**: 1.2.5

---

## Overview

Support IQ (dSQ) manages conversation state per-persona using localStorage, with automatic session reset to ensure every new browser session starts fresh.

---

## Session Reset Protocol

### Purpose
Every new browser session should start with a clean slate - no previous conversation history. This ensures:
1. Demo visitors always see a fresh interface
2. No stale data from previous sessions
3. Consistent demo experience across all users

### Implementation Architecture

The session reset uses a **two-layer approach**:

#### Layer 1: Synchronous Inline Script (Primary)
Located in `src/app/layout.tsx`, this script runs **BEFORE React hydrates**:

```javascript
// Runs synchronously in <head> before any React components mount
(function() {
  var SESSION_MARKER_KEY = 'dsq_session_active';
  var sessionActive = sessionStorage.getItem(SESSION_MARKER_KEY);

  if (!sessionActive) {
    // New session - clear all demo data
    localStorage.removeItem('messagesByPersona');
    localStorage.removeItem('sidebarOpen');
    sessionStorage.setItem(SESSION_MARKER_KEY, 'true');
  }
})();
```

**Why synchronous?** React useEffect hooks run asynchronously after render. Without the sync script, ConversationContext might read stale localStorage data before SessionResetProvider clears it.

#### Layer 2: React Provider (Backup)
Located in `src/components/providers/SessionResetProvider.tsx`:
- Confirms the sync script ran correctly
- Acts as fallback if sync script somehow failed
- Logs session state for debugging

### Session Marker

| Key | Storage | Purpose |
|-----|---------|---------|
| `dsq_session_active` | sessionStorage | Marks an active browser session |

- **New session**: Marker absent → clear localStorage → set marker
- **Existing session**: Marker present → keep localStorage data

### Data Keys Cleared on New Session

| Key | Description |
|-----|-------------|
| `messagesByPersona` | All conversation history |
| `sidebarOpen` | Sidebar open/closed state |

### Data Keys Preserved

| Key | Description |
|-----|-------------|
| `sana-theme` | User's theme preference (dark/light) |
| `selected-mode` | Current mode (Government/Project/ATC) |

---

## Conversation Context

### Storage Structure

```typescript
interface MessagesByPersona {
  [personaId: string]: Message[];
}

// Example:
{
  "atc-support": [
    { id: "1", type: "user", content: "Show my tickets", ... },
    { id: "2", type: "ai", content: "Here are your tickets...", ... }
  ],
  "cor": [
    { id: "3", type: "user", content: "Contract status", ... }
  ]
}
```

### ConversationProvider Features

| Feature | Description |
|---------|-------------|
| `messagesByPersona` | State containing all persona conversations |
| `clearAllConversations()` | Clears all conversations across all personas |
| `clearPersonaConversation(id)` | Clears a single persona's conversation |

### Hydration Handling

The provider uses a two-phase approach to prevent hydration mismatches:

1. **Server render**: Initialize with empty object `{}`
2. **Client hydration**: Load from localStorage in useEffect
3. **isHydrated flag**: Prevents saving until load is complete

---

## Console Logging

### New Session Logs
```
[SessionReset:Sync] New session detected - clearing demo data
[SessionReset:Sync] Cleared: messagesByPersona
[SessionReset:Sync] Cleared: sidebarOpen
[SessionReset:Sync] Session marked as active
[SessionReset:React] Existing session confirmed - keeping data
```

### Existing Session Logs
```
[SessionReset:Sync] Existing session - keeping data
[SessionReset:React] Existing session confirmed - keeping data
```

---

## Manual Reset

Users can manually reset all conversation data using:
1. **Reset Data button** in sidebar (trash icon)
2. **Browser DevTools**: Clear localStorage

### Programmatic Reset
```typescript
import { forceResetDemoData } from '@/lib/session-reset';

// Clears all demo data and session marker
forceResetDemoData();
```

---

## Troubleshooting

### Messages persist after closing browser
1. Check browser console for `[SessionReset:Sync]` logs
2. Verify sessionStorage is being cleared (close ALL tabs)
3. Check if another tab is keeping the session active

### Race condition (stale data loads)
- Fixed in v1.2.5 with synchronous inline script
- Previously, useEffect race condition could cause stale data to load

### Data not persisting within session
1. Check for localStorage quota exceeded errors
2. Verify `isHydrated` flag is true before saving
3. Check browser privacy settings (some block localStorage)

---

## Related Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Synchronous session reset script |
| `src/lib/session-reset.ts` | Session reset utility functions |
| `src/components/providers/SessionResetProvider.tsx` | React provider backup |
| `src/contexts/ConversationContext.tsx` | Conversation state management |

---

*Last verified: January 26, 2026 - v1.2.5 session reset fix deployed*
