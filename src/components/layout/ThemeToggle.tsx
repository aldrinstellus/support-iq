'use client';

import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

/**
 * ThemeToggle Component
 *
 * Toggles between dark and light theme.
 *
 * HYDRATION FIX (V20-OP3):
 * - Skeleton is now a proper button element (not div) to match actual UI exactly
 * - Uses identical styling to prevent any layout shift during hydration
 * - Default shows Moon icon (dark theme) to match initial server render
 */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Common button styles - extracted to ensure skeleton matches actual button exactly
  const buttonClass = `relative flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 hover:bg-muted transition-colors ${className}`;

  // Show skeleton during SSR - MUST be a button with identical styling
  // Default to Moon (dark theme) to match initial server render (html has class="dark")
  if (!mounted) {
    return (
      <button
        className={buttonClass}
        title="Switch to light mode"
        aria-label="Switch to light mode"
        disabled
      >
        <Moon className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={buttonClass}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Sun className="w-4 h-4 text-muted-foreground" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
