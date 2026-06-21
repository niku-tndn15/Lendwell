import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { useDemoTarget } from '../../demo/useDemoTarget'

const TRUST_CARDS = [
  {
    icon: '📋',
    iconBg: 'bg-blue-50',
    title: 'What we access',
    body: 'Last 6 months bank transactions only — nothing more.',
  },
  {
    icon: '🔒',
    iconBg: 'bg-indigo-50',
    title: 'Why',
    body: 'To verify your income for this loan. Your data is never sold or shared.',
  },
  {
    icon: '⏳',
    iconBg: 'bg-amber-50',
    title: 'How long',
    body: 'One-time read. No recurring or future access — ever.',
  },
  {
    icon: '❌',
    iconBg: 'bg-green-50',
    title: 'Revoke anytime',
    body: 'Cancel consent from your AA app at any time — no questions asked.',
  },
]

export default function B2_TrustScreen() {
  const navigate    = useNavigate()
  const { loanAmount } = useAppContext()
  const trustCardsRef  = useDemoTarget('trust-cards')

  // Trigger slide-up + card stagger on mount
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  const formatINR = v => '₹' + v.toLocaleString('en-IN')

  return (
    <div
      className="flex flex-col bg-b-bg min-h-full transition-transform duration-300 ease-out"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4">
        <div
          className={`inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 mb-4 glow-pulse transition-opacity duration-500 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-green-600 text-sm">🛡️</span>
          <span className="text-xs font-semibold text-green-700">
            RBI Regulated Account Aggregator Framework
          </span>
        </div>

        <h1 className="text-xl font-bold text-gray-800 leading-snug">
          Your Data is Safe &amp;{' '}
          <span className="text-b-accent">Under Your Control</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Before we link your {formatINR(loanAmount)} loan application to your bank, here's exactly
          what happens — and what doesn't.
        </p>
      </div>

      {/* ── Trust Cards ─────────────────────────────────────────── */}
      <div ref={trustCardsRef} className="flex flex-col gap-3 px-5 pb-4">
        {TRUST_CARDS.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start gap-3 transition-all duration-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: visible ? `${80 + i * 150}ms` : '0ms',
            }}
          >
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center text-lg shrink-0`}>
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-700 mb-0.5">{card.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{card.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sahamati Attribution ────────────────────────────────── */}
      <div
        className="mx-5 mb-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 transition-opacity duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transitionDelay: visible ? '700ms' : '0ms',
        }}
      >
        <span className="text-blue-400 text-base">🔗</span>
        <div>
          <p className="text-xs font-semibold text-blue-700">Powered by Sahamati</p>
          <p className="text-[11px] text-blue-500 leading-tight mt-0.5">
            RBI's licensed Account Aggregator framework — your consent is encrypted end-to-end
          </p>
        </div>
      </div>

      {/* ── CTAs ────────────────────────────────────────────────── */}
      <div
        className="px-5 pb-6 mt-auto transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transitionDelay: visible ? '800ms' : '0ms',
        }}
      >
        <button
          onClick={() => navigate('/borrower/discovery')}
          className="w-full py-4 rounded-[24px] text-white font-semibold text-base active:scale-[0.98] transition-all duration-150 mb-3"
          style={{
            background: 'linear-gradient(135deg, hsl(245,82%,58%) 0%, hsl(260,78%,65%) 100%)',
            boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
          }}
        >
          Agree &amp; Link Bank
        </button>

        <button
          onClick={() => navigate('/borrower/home')}
          className="w-full py-3.5 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
