import type { Metadata } from "next";
import "./globals.css";
import packageJson from "../../package.json";
import { ModeProvider } from "@/contexts/ModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
// import { FeedbackWidget } from "@/components/feedback";
// import { DemoModeIndicator } from "@/components/demo/DemoModeIndicator";
import { SessionProvider } from "@/components/auth/SessionProvider";

// Helper function to format version for display
// Extracts suffix from package name (e.g., "atc-support-v20-op2" → "V20-OP2")
function getVersionDisplay(version: string, packageName: string): string {
  const parts = version.split('.');
  const major = parts[0];

  // Check for suffix in package name (e.g., "-op2")
  const suffixMatch = packageName.match(/-v\d+(-\w+)?$/);
  const suffix = suffixMatch?.[1]?.toUpperCase() || '';

  return `V${major}${suffix}`;
}

const versionDisplay = getVersionDisplay(packageJson.version, packageJson.name);

export const metadata: Metadata = {
  title: `EAS ${versionDisplay}`,
  description: "Demo reference with mock data - Three personas: C-Level, CS Manager, Support Agent",
  keywords: ["support", "ticketing", "AI", "dashboard", "analytics", "demo", "multi-persona"],
  icons: {
    icon: [
      { url: '/ctis-logo-dark.png', type: 'image/png' },
    ],
    shortcut: '/ctis-logo-dark.png',
    apple: '/ctis-logo-dark.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
      </head>
      <body className="h-screen overflow-hidden bg-background font-sans antialiased">
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
      </body>
    </html>
  );
}
