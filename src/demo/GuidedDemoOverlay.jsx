import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useDemoContext } from '../context/DemoContext'
import { DEMO_STEPS, DEMO_STEP_COUNT } from './demoSteps'
import { buildNavigateDemoStep } from './demoNavHandlers'
import { clearSpotlight } from './spotlightUtils'

// Auto-play interval in ms
const AUTO_PLAY_MS = 9000

// Maps step.cardPosition to Tailwind fixed-position classes
const CARD_POSITIONS = {
  'bottom-right': 'bottom-6 right-6',
  'right':        'right-6 top-1/2 -translate-y-1/2',
  'top':          'top-20 left-1/2 -translate-x-1/2',
  'top-right':    'top-20 right-6',
  'left':         'left-72 top-1/2 -translate-y-1/2',
  'top-left':     'top-20 left-72',
}

function DotProgress({ total, current, onGo }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          aria-label={`Go to step ${i + 1}`}
          className={`rounded-full transition-all duration-200 ${
            i === current
              ? 'w-4 h-2 bg-emerald'
              : i < current
              ? 'w-2 h-2 bg-emerald/40'
              : 'w-2 h-2 bg-white/20'
          }`}
        />
      ))}
    </div>
  )
}

function AutoPlayBar({ active, durationMs }) {
  return active ? (
    <div className="h-0.5 w-full bg-white/10 rounded overflow-hidden mt-3">
      <div
        className="h-full bg-emerald/60 rounded"
        style={{
          animation: `demo-progress ${durationMs}ms linear forwards`,
        }}
      />
    </div>
  ) : null
}

export default function GuidedDemoOverlay() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const demoCtx = useDemoContext()

  const { demoActive, demoStep, autoPlay, setAutoPlay, nextStep, prevStep, goToStep, exitDemo } = demoCtx

  // Build the navigator once; rebuilt when navigate/contexts change
  const navigateDemoStep = useCallback(
    buildNavigateDemoStep({ navigate, appContext, demoContext: demoCtx }),
    [navigate, appContext, demoCtx]
  )

  // Execute navigation whenever demoActive turns on or demoStep changes
  useEffect(() => {
    if (!demoActive) return
    navigateDemoStep(demoStep)
  }, [demoActive, demoStep]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-play timer
  const autoTimerRef = useRef(null)
  useEffect(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    if (!demoActive || !autoPlay) return

    autoTimerRef.current = setInterval(() => {
      if (demoStep >= DEMO_STEP_COUNT - 1) {
        exitDemo()
      } else {
        nextStep()
      }
    }, AUTO_PLAY_MS)

    return () => clearInterval(autoTimerRef.current)
  }, [demoActive, autoPlay, demoStep, nextStep, exitDemo])

  // Keyboard navigation
  useEffect(() => {
    if (!demoActive) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextStep()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevStep()
      else if (e.key === 'Escape') exitDemo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [demoActive, nextStep, prevStep, exitDemo])

  // Clean up spotlight on unmount
  useEffect(() => () => clearSpotlight(), [])

  if (!demoActive) return null

  const step = DEMO_STEPS[demoStep]
  const posClass = CARD_POSITIONS[step.cardPosition] ?? 'bottom-6 right-6'
  const isFirst = demoStep === 0
  const isLast  = demoStep === DEMO_STEP_COUNT - 1

  return (
    <div
      className={`fixed z-[1002] ${posClass} w-[340px]`}
      role="dialog"
      aria-label="Guided Demo"
      aria-modal="false"
    >
      {/* Card */}
      <div className="bg-navy border border-emerald/30 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-emerald uppercase">
              Guided Demo
            </span>
            <span className="text-[10px] text-text-sec/60 font-medium">
              {demoStep + 1} / {DEMO_STEP_COUNT}
            </span>
          </div>
          <button
            onClick={exitDemo}
            aria-label="Exit demo"
            className="p-1 rounded text-text-sec hover:text-text-pri hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-text-pri leading-snug mb-2">
            {step.title}
          </h3>
          <p className="text-xs text-text-sec leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="px-4 pb-3">
          <DotProgress total={DEMO_STEP_COUNT} current={demoStep} onGo={goToStep} />
        </div>

        {/* Auto-play bar */}
        <div className="px-4">
          <AutoPlayBar active={autoPlay} durationMs={AUTO_PLAY_MS} key={`${demoStep}-${autoPlay}`} />
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-white/8">
          {/* Auto-play toggle */}
          <button
            onClick={() => setAutoPlay(p => !p)}
            aria-label={autoPlay ? 'Pause auto-play' : 'Start auto-play'}
            className="flex items-center gap-1.5 text-xs text-text-sec hover:text-text-pri transition-colors"
          >
            {autoPlay
              ? <Pause size={12} className="text-emerald" />
              : <Play  size={12} />}
            <span className="hidden sm:inline">{autoPlay ? 'Pause' : 'Auto'}</span>
          </button>

          {/* Prev / Next */}
          <div className="flex items-center gap-2 ml-auto">
            {!isFirst && (
              <button
                onClick={prevStep}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-text-sec hover:text-text-pri hover:bg-white/5 border border-white/10 transition-all"
              >
                <ChevronLeft size={13} />
                Back
              </button>
            )}
            <button
              onClick={isLast ? exitDemo : nextStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald text-navy hover:opacity-90 transition-opacity"
            >
              {isLast ? 'Finish' : 'Next'}
              {!isLast && <ChevronRight size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
