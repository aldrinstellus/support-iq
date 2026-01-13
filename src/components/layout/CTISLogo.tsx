'use client';

import Image from 'next/image';
import { ModeSwitcher } from './ModeSwitcher';

/**
 * CTIS Logo Component
 *
 * Displays the CTIS (Customer Technology & Information Services) branding
 * with mode switcher in the application sidebar.
 *
 * V17 Mode Switcher - Government/Project mode toggle
 * V19 - Theme-aware logo switching using CSS (instant, no flicker)
 * V20-OP3 - Removed ClientOnly wrapper; ModeSwitcher now handles hydration internally
 *           with a proper skeleton that matches actual UI (fixes "empty line" bug)
 *
 * Both logos are preloaded and CSS controls visibility based on theme class.
 * This eliminates network lag and hydration flicker.
 */

export const CTISLogo = () => {
  return (
    <div className="flex-shrink-0 px-3 pt-3 pb-3 space-y-2">
      {/* CTIS Logo - Both versions rendered, CSS controls visibility */}
      <div className="flex items-center justify-center py-2 relative h-10">
        {/* Dark theme logo - shown when .dark class is on html */}
        <Image
          src="/ctis-logo-dark.png"
          alt="CTIS Logo"
          width={160}
          height={40}
          className="h-10 object-contain dark:block hidden"
          style={{ width: 'auto' }}
          priority
        />
        {/* Light theme logo - shown when .light class is on html */}
        <Image
          src="/ctis-logo.png"
          alt="CTIS Logo"
          width={160}
          height={40}
          className="h-10 object-contain dark:hidden block"
          style={{ width: 'auto' }}
          priority
        />
      </div>

      {/* Mode Switcher - Government vs Project vs ATC */}
      {/* No ClientOnly wrapper needed - ModeSwitcher handles hydration internally */}
      <ModeSwitcher />
    </div>
  );
};

export default CTISLogo;
