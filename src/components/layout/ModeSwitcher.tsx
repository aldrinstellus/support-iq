'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, Briefcase } from 'lucide-react';
import { useMode } from '@/contexts/ModeContext';
import { usePersona } from '@/hooks/use-persona';
import { useRouter } from 'next/navigation';
import { PersonaType } from '@/types/persona';

/**
 * ModeSwitcher Component
 *
 * Switches between Government, Project, and ATC modes.
 *
 * HYDRATION FIX (V20-OP3):
 * - Handles mounting state internally (no ClientOnly wrapper needed)
 * - Shows visually identical skeleton during SSR to prevent "empty line" issue
 * - Skeleton has same dimensions and styling as actual buttons
 */
export function ModeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { currentMode, setMode } = useMode();
  const { setPersona } = usePersona();
  const router = useRouter();

  // Set mounted after hydration completes
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModeSwitch = (mode: 'government' | 'project' | 'atc') => {
    if (mode === currentMode) return; // Already on this mode

    setMode(mode);

    // Navigate to first persona of the new mode
    const firstPersonaMap = {
      government: 'cor',
      project: 'project-manager',
      atc: 'atc-executive'
    };

    const firstPersonaId = firstPersonaMap[mode] as PersonaType;
    setPersona(firstPersonaId); // Switch persona
    router.push(`/demo/${firstPersonaId}`); // Navigate to page
  };

  // Button styles - extracted for reuse in skeleton
  const baseButtonClass = "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all";
  const activeClass = "bg-primary text-primary-foreground shadow-sm";
  const inactiveClass = "text-muted-foreground hover:text-foreground hover:bg-muted/50";

  // Show skeleton during SSR - MUST match actual UI dimensions exactly
  // Default to 'government' as active to match initial server render
  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 bg-background border border-border rounded-lg">
        <div className={`${baseButtonClass} ${activeClass}`}>
          <Building2 className="h-3.5 w-3.5" />
          <span>Government</span>
        </div>
        <div className={`${baseButtonClass} ${inactiveClass}`}>
          <Users className="h-3.5 w-3.5" />
          <span>Project</span>
        </div>
        <div className={`${baseButtonClass} ${inactiveClass}`}>
          <Briefcase className="h-3.5 w-3.5" />
          <span>ATC</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-background border border-border rounded-lg">
      <button
        onClick={() => handleModeSwitch('government')}
        className={`${baseButtonClass} ${
          currentMode === 'government' ? activeClass : inactiveClass
        }`}
        aria-label="Switch to Government mode"
      >
        <Building2 className="h-3.5 w-3.5" />
        <span>Government</span>
      </button>
      <button
        onClick={() => handleModeSwitch('project')}
        className={`${baseButtonClass} ${
          currentMode === 'project' ? activeClass : inactiveClass
        }`}
        aria-label="Switch to Project mode"
      >
        <Users className="h-3.5 w-3.5" />
        <span>Project</span>
      </button>
      <button
        onClick={() => handleModeSwitch('atc')}
        className={`${baseButtonClass} ${
          currentMode === 'atc' ? activeClass : inactiveClass
        }`}
        aria-label="Switch to ATC mode"
      >
        <Briefcase className="h-3.5 w-3.5" />
        <span>ATC</span>
      </button>
    </div>
  );
}
