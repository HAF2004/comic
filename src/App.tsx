import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Gift, Heart, Music, VolumeX } from 'lucide-react';
import {
  ExperienceStepId,
  RECIPIENT_INFO,
  getNextStepId,
  getStepConfig,
  parseInitialStepFromSearch,
  skipToGiftStep,
} from './utils/experienceState';
import { ambientMusic } from './utils/ambientAudio';
import { BirthdaySceneCanvas } from './components/BirthdaySceneCanvas';
import { QrGiftCardModal } from './components/QrGiftCardModal';
import { BottomControlDock } from './components/BottomControlDock';

export default function App() {
  const [currentStep, setCurrentStep] = useState<ExperienceStepId>(() =>
    typeof window !== 'undefined'
      ? parseInitialStepFromSearch(window.location.search)
      : 'envelope',
  );
  // Track whether the user jumped directly to a step so they can read the card wishes without rushing
  const [manualHold, setManualHold] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).has('step')
      : false,
  );
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  // Listen to prefers-reduced-motion changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Expose current step on document.body for deterministic inspection
  useEffect(() => {
    document.body.setAttribute('data-state', currentStep);
  }, [currentStep]);

  // Automatic transition for Step 2 (Birthday Reveal -> Flower Bloom) and Step 4 (Gift Reveal -> Final State)
  useEffect(() => {
    if (manualHold && currentStep === 'birthday_reveal') return;
    const cfg = getStepConfig(currentStep);
    if (!cfg.autoAdvanceMs) return;

    const timer = window.setTimeout(() => {
      setCurrentStep((prev) => getNextStepId(prev));
    }, cfg.autoAdvanceMs);

    return () => window.clearTimeout(timer);
  }, [currentStep, manualHold]);

  // Keyboard shortcut 'H' to toggle bottom control dock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelectStep = useCallback((stepId: ExperienceStepId) => {
    setManualHold(stepId === 'birthday_reveal');
    setCurrentStep(stepId);
  }, []);

  const handlePrimaryAdvance = useCallback(() => {
    setManualHold(false);
    setCurrentStep((prev) => getNextStepId(prev));
  }, []);

  const handleSkipToGift = useCallback(() => {
    setManualHold(false);
    setCurrentStep(skipToGiftStep());
  }, []);

  const handleToggleMusic = async () => {
    const nextState = await ambientMusic.toggle();
    setMusicPlaying(nextState);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* Full-bleed 3D WebGL Scene (100vw x 100vh) */}
      <BirthdaySceneCanvas
        currentStep={currentStep}
        reducedMotion={reducedMotion}
        onScenePrimaryInteract={handlePrimaryAdvance}
      />

      {/* Soft Window Light Atmosphere Scrim */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none window-sunlight-overlay z-[1]"
      />

      {/* Minimal Top Bar (1-Row, 3-Zone Contract) */}
      <header className="fixed top-0 inset-x-0 z-20 flex items-center justify-between gap-8 px-5 sm:px-8 py-4 pointer-events-none">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleSelectStep('envelope');
          }}
          className="pointer-events-auto font-serif text-lg sm:text-xl font-medium tracking-tight text-[#463A38] whitespace-nowrap shrink-0"
        >
          For {RECIPIENT_INFO.shortName}
        </a>

        {/* Zone 2: Quiet unboxed recipient birthday metadata */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#A99A91] whitespace-nowrap shrink-0">
          <span>{RECIPIENT_INFO.name}</span>
          <span aria-hidden="true">·</span>
          <span>{RECIPIENT_INFO.birthday}</span>
        </div>

        {/* Zone 3: Accessible Manual Music Control (off by default) */}
        <div className="pointer-events-auto flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleMusic}
            aria-pressed={musicPlaying}
            aria-label={
              musicPlaying ? 'Mute background music' : 'Play background music'
            }
            className="w-10 h-10 rounded-full dock-solid-surface border border-[#D9B4AA]/80 flex items-center justify-center text-[#463A38] hover:text-[#C77B87] hover:border-[#C77B87] transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C77B87]"
          >
            {musicPlaying ? (
              <Music className="w-4 h-4 text-[#C77B87]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#A99A91]" />
            )}
          </button>
        </div>
      </header>

      {/* Main Storyboard Overlay */}
      <main
        data-step={currentStep}
        className={`relative z-10 w-full h-full flex flex-col justify-between items-center pt-14 sm:pt-16 px-4 pointer-events-none ${
          dockCollapsed ? 'pb-14 sm:pb-16' : 'pb-36 sm:pb-28'
        }`}
      >
        {/* Step 1: Sealed Envelope */}
        {currentStep === 'envelope' && (
          <>
            <div className="text-center mt-1 sm:mt-3 animate-fade-up">
              <p className="font-serif text-base sm:text-lg text-[#8C6268] tracking-wide">
                For
              </p>
              <h1 className="mt-0.5 font-serif text-3xl sm:text-5xl font-medium text-[#463A38] tracking-tight text-balance">
                {RECIPIENT_INFO.name}
              </h1>
              <p className="mt-1.5 font-serif italic text-base sm:text-lg text-[#7A6863] inline-flex items-center justify-center gap-1.5">
                <span>A little surprise for you</span>
                <Heart className="w-3.5 h-3.5 text-[#C77B87] shrink-0" aria-hidden="true" />
              </p>
            </div>

            <div className="flex flex-col items-center gap-2.5 animate-fade-up pointer-events-auto">
              <button
                type="button"
                onClick={handlePrimaryAdvance}
                className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full bg-[#C77B87] hover:bg-[#b56975] text-[#FFFDF9] font-serif text-lg tracking-wide shadow-[0_8px_24px_rgba(199,123,135,0.35)] transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#463A38]"
              >
                <span>Open</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Birthday Card Rising from Open Envelope (Unobstructed 3D Letterpress Card) */}
        {currentStep === 'birthday_reveal' && (
          <>
            <div className="max-w-md mx-auto text-center mt-1 sm:mt-2 animate-fade-up">
              <p className="font-serif italic text-sm sm:text-base text-[#8C6268]">
                {RECIPIENT_INFO.birthday}
              </p>
              <h1 className="mt-0.5 font-serif text-3xl sm:text-4xl font-medium text-[#463A38] tracking-tight text-balance">
                Happy Birthday, {RECIPIENT_INFO.shortName}.
              </h1>
              <p className="sr-only">{RECIPIENT_INFO.wishes}</p>
            </div>

            <div className="flex items-center gap-3 animate-fade-up pointer-events-auto">
              <button
                type="button"
                onClick={handlePrimaryAdvance}
                className="inline-flex items-center gap-2.5 px-7 py-2.5 rounded-full bg-[#C77B87] hover:bg-[#b56975] text-[#FFFDF9] font-serif text-base sm:text-lg tracking-wide shadow-[0_8px_24px_rgba(199,123,135,0.35)] transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>See Your Flowers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Pink Tulip Bouquet Bloom */}
        {currentStep === 'flower_bloom' && (
          <>
            <div className="text-center mt-1 sm:mt-2 animate-fade-up">
              <p className="font-serif text-xl sm:text-2xl text-[#C77B87] tracking-wide">
                Happy Birthday
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#463A38] tracking-tight text-balance">
                {RECIPIENT_INFO.name}
              </h1>
              <div className="mt-1.5 flex justify-center" aria-hidden="true">
                <Heart className="w-4 h-4 text-[#C77B87]" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up pointer-events-auto">
              <button
                type="button"
                onClick={handlePrimaryAdvance}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#C77B87] hover:bg-[#b56975] text-[#FFFDF9] font-serif text-lg tracking-wide shadow-[0_8px_24px_rgba(199,123,135,0.35)] transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#463A38]"
              >
                <Gift className="w-4 h-4" />
                <span>Open Your Gift</span>
              </button>
            </div>
          </>
        )}

        {/* Step 4 & Step 5: Gift Box Opens & Final QR State */}
        {(currentStep === 'gift_reveal' || currentStep === 'final_state') && (
          <div className="my-auto w-full flex items-center justify-center animate-fade-up">
            <QrGiftCardModal
              currentStep={currentStep}
              onAdvanceToFinal={() => handleSelectStep('final_state')}
              onReplayExperience={() => handleSelectStep('envelope')}
              onBackToBouquet={() => handleSelectStep('flower_bloom')}
            />
          </div>
        )}
      </main>

      {/* Collapsible Bottom Control Dock (<= 15% viewport footprint, solid surface) */}
      <BottomControlDock
        currentStep={currentStep}
        collapsed={dockCollapsed}
        onSelectStep={handleSelectStep}
        onToggleCollapsed={() => setDockCollapsed((prev) => !prev)}
        onSkipToGift={handleSkipToGift}
      />
    </div>
  );
}
