import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BANKS } from '../../data/banks'
import { useAppContext } from '../../context/AppContext'
import { useDemoContext } from '../../context/DemoContext'
import { useDemoTarget } from '../../demo/useDemoTarget'
import FetchStepItem from '../../components/borrower/FetchStepItem'
import ErrorBanner from '../../components/borrower/ErrorBanner'
import RetryCountdown from '../../components/borrower/RetryCountdown'
import RetryNudgeCard from '../../components/borrower/RetryNudgeCard'

// Step definitions — icons and labels
const FETCH_STEPS = [
  { icon: '✅', label: 'Consent Approved' },
  { icon: '🔗', label: '' },           // label filled dynamically with bank name
  { icon: '🔒', label: 'Securely Fetching Last 6 Months' },
  { icon: '🧠', label: 'Analysing Your Cash-Flow Profile' },
]

// ── Progress Animation Sub-component ────────────────────────────────────
function StateProgress({ bankName, slow, fast, onComplete }) {
  // 'loading' starts first step immediately; others start as 'pending'
  const [stepStatuses, setStepStatuses] = useState(['loading', 'pending', 'pending', 'pending'])
  const [showBanner, setShowBanner]     = useState(slow)
  const timersRef                       = useRef([])

  useEffect(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    const interval   = fast ? 750 : 1500
    const step2Dur   = slow && !fast ? 6000 : interval

    const t1 = setTimeout(() => {
      setShowBanner(false)
      setStepStatuses(['done', 'loading', 'pending', 'pending'])
    }, interval)

    const t2 = setTimeout(() => {
      setStepStatuses(['done', 'done', 'loading', 'pending'])
    }, interval + step2Dur)

    const t3 = setTimeout(() => {
      setStepStatuses(['done', 'done', 'done', 'loading'])
    }, interval + step2Dur + interval)

    const t4 = setTimeout(() => {
      setStepStatuses(['done', 'done', 'done', 'done'])
    }, interval + step2Dur + interval * 2)

    const t5 = setTimeout(() => {
      onComplete()
    }, interval + step2Dur + interval * 2 + 500)

    timersRef.current = [t1, t2, t3, t4, t5]
    return () => timersRef.current.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])   // intentionally run once on mount

  const steps = FETCH_STEPS.map((s, i) => ({
    ...s,
    label: i === 1 ? `Connecting to ${bankName}…` : s.label,
    status: stepStatuses[i],
  }))

  return (
    <div className="flex flex-col min-h-full bg-b-bg px-5 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="pt-6 pb-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-b-accent/10 flex items-center justify-center mx-auto mb-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-b-accent rounded-full animate-spin" />
        </div>
        <h2 className="text-base font-bold text-gray-800">
          {fast ? 'Retrying Connection…' : 'Fetching Your Statement'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Securely connecting to {bankName} via Sahamati AA
        </p>
      </div>

      {/* Slow fetch warning banner */}
      {showBanner && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2">
          <span className="text-amber-500 text-sm mt-0.5">⏳</span>
          <div>
            <p className="text-xs font-bold text-amber-800">SBI is experiencing high traffic</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Fetch may take up to 30 seconds. Please don't close this screen.
            </p>
          </div>
        </div>
      )}

      {/* Step list */}
      <div className="flex flex-col gap-3 mb-6">
        {steps.map((step, i) => (
          <FetchStepItem
            key={i}
            icon={step.icon}
            label={step.label}
            status={step.status}
          />
        ))}
      </div>

      {/* Bottom note */}
      <div className="mt-auto text-center">
        <p className="text-xs text-gray-500 leading-relaxed">
          🔒 Your data is encrypted in transit.
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Please don't close or refresh this page.
        </p>
      </div>
    </div>
  )
}

// ── State B: Smart Retry Sub-component ──────────────────────────────────
function StateRetry({ bankName, onRetry, onCancel }) {
  const retryWidgetRef = useDemoTarget('retry-widget')
  const [triggered, setTriggered] = useState(false)

  const handleAutoComplete = useCallback(() => {
    if (!triggered) { setTriggered(true); onRetry() }
  }, [triggered, onRetry])

  const handleManualRetry = () => {
    setTriggered(true)
    onRetry()
  }

  return (
    <div className="flex flex-col min-h-full bg-b-bg px-5 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="pt-6 pb-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">📡</span>
        </div>
        <h2 className="text-base font-bold text-gray-800">Connection Interrupted</h2>
        <p className="text-xs text-gray-500 mt-1">
          We detected a bank-side issue. Your application is safe.
        </p>
      </div>

      <div ref={retryWidgetRef} className="flex flex-col gap-3 mb-5">
        {/* Error Banner */}
        <ErrorBanner bankName={bankName} />

        {/* Explanation */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            This is a <strong>temporary bank-side issue</strong> — not a problem with your
            application or data. {bankName}'s authentication servers are momentarily unavailable.
            Your data and application details are completely safe.
          </p>
        </div>

        {/* Countdown */}
        {!triggered && (
          <RetryCountdown onComplete={handleAutoComplete} />
        )}

        {/* Nudge Card */}
        <RetryNudgeCard />
      </div>

      {/* Action buttons */}
      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={handleManualRetry}
          disabled={triggered}
          className="w-full py-4 rounded-[24px] text-white font-semibold text-base active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, hsl(245,82%,58%) 0%, hsl(260,78%,65%) 100%)',
            boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
          }}
        >
          {triggered ? 'Retrying…' : 'Try Again Now'}
        </button>

        <button
          onClick={onCancel}
          className="py-2.5 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
        >
          Cancel Application
        </button>
      </div>
    </div>
  )
}

// ── Root B4 Component ────────────────────────────────────────────────────
export default function B4_FetchStatus() {
  const navigate = useNavigate()
  const { selectedBank, setSelectedBank } = useAppContext()
  const { demoForcedBank }               = useDemoContext()

  // BANK_05 = Yes Bank (forced failure demo), BANK_03 = SBI (slow fetch demo)
  const b4State =
    demoForcedBank === 'BANK_05' ? 'retry'
    : selectedBank === 'BANK_05' ? 'retry'
    : selectedBank === 'BANK_03' ? 'slow'
    : 'success'

  // Find display bank name — demoForcedBank takes precedence over selectedBank
  const bankRecord  = BANKS.find(b => b.id === (demoForcedBank || selectedBank))
  const displayName = bankRecord?.name || 'Your Bank'

  // Retry phase: 'waiting' → 'retrying'
  const [retryPhase, setRetryPhase] = useState('waiting')

  const handleRetry   = useCallback(() => setRetryPhase('retrying'), [])
  const handleCancel  = useCallback(() => {
    setSelectedBank(null)
    navigate('/borrower/home')
  }, [setSelectedBank, navigate])
  const handleComplete = useCallback(() => navigate('/borrower/success'), [navigate])

  // State B waiting phase
  if (b4State === 'retry' && retryPhase === 'waiting') {
    return (
      <StateRetry
        bankName={displayName}
        onRetry={handleRetry}
        onCancel={handleCancel}
      />
    )
  }

  // State A (success), State C (slow), or post-retry
  return (
    <StateProgress
      bankName={displayName}
      slow={b4State === 'slow'}
      fast={retryPhase === 'retrying'}
      onComplete={handleComplete}
    />
  )
}
