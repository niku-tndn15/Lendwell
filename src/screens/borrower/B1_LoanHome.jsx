import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

// EMI formula: P × r × (1+r)^n / ((1+r)^n - 1), r = 1.5%/month (18% p.a.)
// Rounded up to nearest ₹100 to match PRD display value (₹7,400 for ₹80k/12mo)
const MONTHLY_RATE   = 0.015
const MIN_LOAN       = 10000
const MAX_LOAN       = 500000
const LOAN_STEP      = 5000
const TENURE_OPTIONS = [6, 12, 18, 24]
const DEFAULT_AMOUNT = 80000
const DEFAULT_TENURE = 12

function calcEMI(principal, months) {
  if (months === 0 || principal === 0) return 0
  const pow = Math.pow(1 + MONTHLY_RATE, months)
  const raw = (principal * MONTHLY_RATE * pow) / (pow - 1)
  return Math.ceil(raw / 100) * 100
}

function formatINR(value) {
  return '₹' + value.toLocaleString('en-IN')
}

export default function B1_LoanHome() {
  const navigate = useNavigate()
  const { setLoanState } = useAppContext()

  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const [tenure, setTenure] = useState(DEFAULT_TENURE)

  const emi = calcEMI(amount, tenure)
  const fillPct = ((amount - MIN_LOAN) / (MAX_LOAN - MIN_LOAN)) * 100

  const handleCTA = () => {
    setLoanState({ amount, tenure, emi })
    navigate('/borrower/trust')
  }

  return (
    <div className="flex flex-col bg-b-bg min-h-full px-5 pb-6 overflow-y-auto">

      {/* ── App Header ─────────────────────────────────────────── */}
      <div className="pt-5 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-b-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">LW</span>
          </div>
          <span className="font-bold text-gray-800 text-lg">LendWell</span>
        </div>
        <p className="text-xs text-gray-400 tracking-wide">Quick Loans, Smart Decisions</p>
      </div>

      {/* ── Loan Amount Card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl px-5 pt-5 pb-6 shadow-sm border border-gray-100 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Loan Amount
        </p>
        <p className="text-5xl font-bold text-b-accent mb-1 tabular-nums">
          {formatINR(amount)}
        </p>
        <p className="text-xs text-gray-500 mb-5">
          Repaid over {tenure} months at 18% p.a.
        </p>

        <input
          type="range"
          min={MIN_LOAN}
          max={MAX_LOAN}
          step={LOAN_STEP}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full mb-2"
          style={{
            background: `linear-gradient(to right, hsl(245,82%,58%) ${fillPct}%, #e5e7eb ${fillPct}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>₹10,000</span>
          <span>₹5,00,000</span>
        </div>
      </div>

      {/* ── Tenure Selector ─────────────────────────────────────── */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Repayment Tenure
        </p>
        <div className="flex gap-2">
          {TENURE_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => setTenure(t)}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                tenure === t
                  ? 'bg-b-accent text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-b-accent/40'
              }`}
            >
              {t}<span className="text-xs font-normal opacity-75"> mo</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── EMI Card ────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 mb-4 border border-b-accent/20"
        style={{ background: 'linear-gradient(135deg, hsl(245,82%,97%) 0%, hsl(260,80%,97%) 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Your Monthly EMI</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-800 tabular-nums">
                {formatINR(emi)}
              </span>
              <span className="text-sm text-gray-500">/mo</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-b-accent bg-b-accent/10 px-2.5 py-1 rounded-full block mb-1">
              18% p.a.
            </span>
            <span className="text-xs text-gray-400">Flat Interest</span>
          </div>
        </div>
      </div>

      {/* ── Summary Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'Principal', value: formatINR(amount) },
          { label: 'Tenure', value: `${tenure} months` },
          { label: 'Total Pay', value: formatINR(emi * tenure) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 mb-1">{label}</p>
            <p className="text-xs font-bold text-gray-700 leading-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Primary CTA ──────────────────────────────────────────── */}
      <button
        onClick={handleCTA}
        className="w-full py-4 rounded-[24px] text-white font-semibold text-base tracking-wide active:scale-[0.98] transition-all duration-150"
        style={{
          background: 'linear-gradient(135deg, hsl(245,82%,58%) 0%, hsl(260,78%,65%) 100%)',
          boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
        }}
      >
        Link Bank via Account Aggregator
      </button>

      <p className="text-center text-xs text-gray-500 mt-3 leading-relaxed">
        🔒 Powered by RBI-regulated Account Aggregator framework
      </p>
    </div>
  )
}
