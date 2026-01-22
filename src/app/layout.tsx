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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-screen overflow-hidden bg-background font-sans antialiased">
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
      </body>
    </html>
  );
}
