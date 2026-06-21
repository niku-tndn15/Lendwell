import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

function formatINR(value) {
  return '₹' + value.toLocaleString('en-IN')
}

export default function B5_Success() {
  const { loanAmount, loanTenure, loanEmi, showToast } = useAppContext()
  const [animIn, setAnimIn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col bg-b-bg min-h-full overflow-y-auto pb-6">

      {/* ── Success Hero ──────────────────────────────────────── */}
      <div className="flex flex-col items-center pt-8 pb-6 px-5">
        {/* Animated checkmark with pulse ring */}
        <div className="relative flex items-center justify-center mb-5">
          {/* Outer pulse ring */}
          <div
            className={`absolute w-24 h-24 rounded-full bg-green-100 pulse-ring transition-opacity duration-500 ${
              animIn ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Middle ring */}
          <div
            className={`absolute rounded-full bg-green-200/50 transition-all duration-700 ${
              animIn ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{ width: 72, height: 72 }}
          />
          {/* Checkmark circle */}
          <div
            className={`relative z-10 w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40 ${
              animIn ? 'check-pop' : 'opacity-0 scale-50'
            }`}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M7 16l6 6 12-12"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1
          className={`text-xl font-bold text-gray-800 text-center transition-all duration-500 delay-300 ${
            animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Bank Linked Successfully!
        </h1>
        <p
          className={`text-sm text-gray-500 text-center mt-2 leading-relaxed px-4 transition-all duration-500 delay-[400ms] ${
            animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Your 6-month statement has been securely shared. Our team is analysing your application.
        </p>
      </div>

      {/* ── Cards ─────────────────────────────────────────────── */}
      <div
        className={`px-5 flex flex-col gap-3 transition-all duration-500 delay-500 ${
          animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Timeline card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <span className="text-base">⏱️</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Decision expected in
            </p>
            <p className="text-sm font-bold text-gray-800">Typically within 2 minutes</p>
          </div>
        </div>

        {/* Loan Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Your Application
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Loan Amount', value: formatINR(loanAmount) },
              { label: 'Tenure', value: `${loanTenure} months` },
              { label: 'Monthly EMI', value: formatINR(loanEmi) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-[10px] text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-b-accent leading-tight">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* EWS Notice Card */}
        <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-base">🛡️</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                Borrower Protection Programme
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Once approved, your account will be enrolled in our Early Warning System. You'll
                receive alerts if we detect any repayment risk — before it impacts your credit score.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <div
        className={`px-5 mt-5 transition-all duration-500 delay-700 ${
          animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button
          onClick={() =>
            showToast(
              'This would navigate to your loan dashboard in the live app.',
              'info'
            )
          }
          className="w-full py-4 rounded-[24px] text-white font-semibold text-base active:scale-[0.98] transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg, hsl(245,82%,58%) 0%, hsl(260,78%,65%) 100%)',
            boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
          }}
        >
          Go to Dashboard
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          We'll notify you as soon as your decision is ready
        </p>
      </div>
    </div>
  )
}
