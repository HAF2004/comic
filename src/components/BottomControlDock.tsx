import { ChevronDown, ChevronUp, Gift } from 'lucide-react';
import {
  EXPERIENCE_STEPS,
  ExperienceStepId,
} from '../utils/experienceState';

interface BottomControlDockProps {
  currentStep: ExperienceStepId;
  collapsed: boolean;
  onSelectStep: (stepId: ExperienceStepId) => void;
  onToggleCollapsed: () => void;
  onSkipToGift: () => void;
}

export function BottomControlDock({
  currentStep,
  collapsed,
  onSelectStep,
  onToggleCollapsed,
  onSkipToGift,
}: BottomControlDockProps) {
  return (
    <aside
      aria-label="Scene and Story Controls"
      className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-20 w-full max-w-[min(680px,94vw)] flex flex-col items-center pointer-events-none"
    >
      {/* Collapse / Expand toggle tab */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Show Controls' : 'Hide Controls'}
        className={`pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 border border-[#D9B4AA]/75 dock-solid-surface text-[11px] font-medium text-[#463A38] hover:text-[#C77B87] transition-colors whitespace-nowrap shrink-0 shadow-xs ${
          collapsed ? 'rounded-full' : 'rounded-t-xl border-b-0'
        }`}
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-[#C77B87]" />
            <span>Story Steps</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-[#A99A91]" />
            <span>Hide Controls</span>
          </>
        )}
      </button>

      {/* Main Dock Bar (wraps cleanly on mobile with zero horizontal scrollbar) */}
      {!collapsed && (
        <div className="pointer-events-auto w-full dock-solid-surface border border-[#D9B4AA]/80 rounded-2xl px-2.5 py-2 shadow-[0_10px_30px_rgba(70,58,56,0.10)] flex flex-wrap items-center justify-center sm:justify-between gap-1.5">
          {/* Step selector buttons */}
          <nav
            aria-label="Birthday surprise steps"
            className="flex flex-wrap items-center justify-center gap-1"
          >
            {EXPERIENCE_STEPS.map((step) => {
              const isActive = step.id === currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#C77B87] text-[#FFFDF9] shadow-xs'
                      : 'text-[#463A38] hover:bg-[#F8F3EE]'
                  }`}
                >
                  {step.shortLabel}
                </button>
              );
            })}
          </nav>

          {/* Quick Gift Action */}
          {currentStep !== 'final_state' && (
            <button
              type="button"
              onClick={onSkipToGift}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium border border-[#C77B87]/50 bg-[#FFFDF9] hover:bg-[#F8F3EE] text-[#463A38] transition-colors whitespace-nowrap shrink-0"
            >
              <Gift className="w-3 h-3 text-[#C77B87]" />
              <span>Skip to Gift</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
