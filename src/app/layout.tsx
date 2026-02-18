import type { Metadata } from "next";
import "./globals.css";
import packageJson from "../../package.json";
import { ModeProvider } from "@/contexts/ModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
// import { FeedbackWidget } from "@/components/feedback";
// import { DemoModeIndicator } from "@/components/demo/DemoModeIndicator";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { TrackingWrapper } from "@/components/providers/TrackingWrapper";
import { SessionResetProvider } from "@/components/providers/SessionResetProvider";

// Helper function to format version for display
// Extracts suffix from package name (e.g., "atc-support-v20-op2" → "V20-OP2")
function _getVersionDisplay(version: string, packageName: string): string {
  const parts = version.split('.');
  const major = parts[0];

  // Check for suffix in package name (e.g., "-op2")
  const suffixMatch = packageName.match(/-v\d+(-\w+)?$/);
  const suffix = suffixMatch?.[1]?.toUpperCase() || '';

  return `V${major}${suffix}`;
}

// Version display available for future use (e.g., in browser tab or footer)
const _versionDisplay = _getVersionDisplay(packageJson.version, packageJson.name);

export const metadata: Metadata = {
  title: "dSQ | Support Portal",
  description: "AI-powered enterprise support portal - Digital Workplace AI",
  keywords: ["support", "ticketing", "AI", "dashboard", "analytics", "enterprise", "digital workplace"],
};

// Script to set theme before React hydrates (prevents flash)
const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('sana-theme');
      if (theme === 'light' || theme === 'dark') {
        document.documentElement.className = theme;
      } else {
        document.documentElement.className = 'dark';
      }
    } catch (e) {
      document.documentElement.className = 'dark';
    }
  })();
`;

// Script to clear session data BEFORE React hydrates (prevents stale data loading)
// This runs synchronously, BEFORE any React components mount
// Also handles user isolation - different users on same device get clean slate
const sessionResetScript = `
  (function() {
    try {
      var SESSION_MARKER_KEY = 'dsq_session_active';
      var LAST_USER_KEY = 'dsq_last_user_id';
      var ANALYTICS_SESSION_KEY = 'dw_analytics_session';
      var DEMO_DATA_KEYS = ['messagesByPersona', 'sidebarOpen'];

      // Get current user ID from analytics session (shared with main app)
      var currentUserId = null;
      try {
        var analyticsSession = localStorage.getItem(ANALYTICS_SESSION_KEY);
        if (analyticsSession) {
          var parsed = JSON.parse(analyticsSession);
          currentUserId = parsed.userId || null;
        }
      } catch (e) {
        console.log('[SessionReset:Sync] Could not parse analytics session');
      }

      // Get last known user ID
      var lastUserId = localStorage.getItem(LAST_USER_KEY);
      var sessionActive = sessionStorage.getItem(SESSION_MARKER_KEY);

      // Clear data if: new session OR different user
      var shouldClear = !sessionActive || (currentUserId && lastUserId && currentUserId !== lastUserId);

      if (shouldClear) {
        var reason = !sessionActive ? 'new session' : 'user changed from ' + lastUserId + ' to ' + currentUserId;
        console.log('[SessionReset:Sync] Clearing demo data - reason: ' + reason);

        DEMO_DATA_KEYS.forEach(function(key) {
          localStorage.removeItem(key);
          console.log('[SessionReset:Sync] Cleared: ' + key);
        });

        // Mark session as active
        sessionStorage.setItem(SESSION_MARKER_KEY, 'true');
        console.log('[SessionReset:Sync] Session marked as active');
      } else {
        console.log('[SessionReset:Sync] Existing session, same user - keeping data');
      }

      // Always update last user ID if we have a current user
      if (currentUserId) {
        localStorage.setItem(LAST_USER_KEY, currentUserId);
        console.log('[SessionReset:Sync] User ID tracked: ' + currentUserId);
      }
    } catch (e) {
      console.error('[SessionReset:Sync] Error:', e);
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/dsq/favicon.png" type="image/png" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: sessionResetScript }} />
      </head>
      <body className="h-screen overflow-hidden bg-background font-sans antialiased">
        <SessionResetProvider>
          <TrackingWrapper>
            <SessionProvider>
              <ThemeProvider>
                <ModeProvider>
                  <FeedbackProvider>
                    {children}
                    {/* <FeedbackWidget /> - Hidden for demo, see docs/06-features/FEEDBACK-WIDGET.md */}
                    {/* <DemoModeIndicator /> */}
                  </FeedbackProvider>
                </ModeProvider>
              </ThemeProvider>
            </SessionProvider>
          </TrackingWrapper>
        </SessionResetProvider>
      </body>
    </html>
  );
}
