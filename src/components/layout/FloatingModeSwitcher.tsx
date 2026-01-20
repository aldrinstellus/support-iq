'use client';

import { useState, useRef, useEffect } from 'react';
import { Building2, Users, Landmark, ChevronDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMode } from '@/contexts/ModeContext';
import { usePersona } from '@/hooks/use-persona';
import { useRouter } from 'next/navigation';
import { PersonaType } from '@/types/persona';

interface ModeConfig {
  id: 'government' | 'project' | 'atc';
  label: string;
  shortLabel: string;
  description: string;
  icon: typeof Building2;
  gradient: string;
  glowColor: string;
  firstPersona: PersonaType;
}

const modes: ModeConfig[] = [
  {
    id: 'government',
    label: 'Government',
    shortLabel: 'GOV',
    description: 'Federal & public sector workflows',
    icon: Building2,
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    firstPersona: 'cor',
  },
  {
    id: 'project',
    label: 'Project',
    shortLabel: 'PRJ',
    description: 'Project management & teams',
    icon: Users,
    gradient: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    firstPersona: 'project-manager',
  },
  {
    id: 'atc',
    label: 'ATC',
    shortLabel: 'ATC',
    description: 'SME',
    icon: Landmark,
    gradient: 'from-orange-500 to-amber-600',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    firstPersona: 'atc-executive',
  },
];

interface FloatingModeSwitcherProps {
  className?: string;
}

export function FloatingModeSwitcher({ className = '' }: FloatingModeSwitcherProps) {
  const { currentMode, setMode, isHydrated } = useMode();
  const { setPersona } = usePersona();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModeConfig = modes.find((m) => m.id === currentMode) || modes[0];
  const CurrentIcon = currentModeConfig.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleModeSwitch = (mode: ModeConfig) => {
    if (mode.id === currentMode) {
      setIsOpen(false);
      return;
    }

    setMode(mode.id);
    setPersona(mode.firstPersona);
    router.push(`/demo/${mode.firstPersona}`);
    setIsOpen(false);
  };

  // Show skeleton during SSR
  if (!isHydrated) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-muted/50 border border-border">
          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">GOV</span>
          <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button - Responsive */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Current mode: ${currentModeConfig.label}. Click to switch modes.`}
        aria-expanded={isOpen}
      >
        {/* Animated gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${currentModeConfig.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg sm:rounded-xl"
          animate={{
            boxShadow: isHovered || isOpen
              ? `0 0 20px ${currentModeConfig.glowColor}, inset 0 0 20px ${currentModeConfig.glowColor}20`
              : '0 0 0px transparent',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon with animation */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          className="relative z-10"
        >
          <CurrentIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
        </motion.div>

        {/* Mode label */}
        <span className="relative z-10 text-[10px] sm:text-xs font-semibold text-foreground tracking-wide">
          {currentModeConfig.shortLabel}
        </span>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu - Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-full right-0 mt-2 w-56 sm:w-64 rounded-xl sm:rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wider">
                  Switch Mode
                </span>
              </div>
            </div>

            {/* Mode Options */}
            <div className="p-1.5 sm:p-2">
              {modes.map((mode, index) => {
                const Icon = mode.icon;
                const isActive = mode.id === currentMode;

                return (
                  <motion.button
                    key={mode.id}
                    onClick={() => handleModeSwitch(mode)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 group relative overflow-hidden
                      ${isActive
                        ? 'bg-primary/15 border border-primary/30'
                        : 'hover:bg-muted/50 border border-transparent'
                      }
                    `}
                  >
                    {/* Gradient accent on hover */}
                    <motion.div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${mode.gradient} rounded-full`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isActive ? 1 : 0 }}
                      whileHover={{ scaleY: 1 }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Icon container */}
                    <div
                      className={`
                        flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg transition-all duration-200 flex-shrink-0
                        ${isActive
                          ? `bg-gradient-to-br ${mode.gradient} shadow-lg`
                          : 'bg-muted/50 group-hover:bg-muted'
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className={`text-xs sm:text-sm font-semibold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                          {mode.label}
                        </span>
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-primary flex-shrink-0"
                          >
                            <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-primary-foreground" />
                          </motion.span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                        {mode.description}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 border-t border-border/50 bg-muted/20">
              <p className="text-[9px] sm:text-[10px] text-muted-foreground text-center">
                Switching mode updates available personas
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
