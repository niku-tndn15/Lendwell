import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BANKS } from '../../data/banks'
import { useAppContext } from '../../context/AppContext'
import BankCard from '../../components/borrower/BankCard'
import OTPModal from '../../components/borrower/OTPModal'

export default function B3_BankDiscovery() {
  const navigate = useNavigate()
  const { setSelectedBank } = useAppContext()

  const [search, setSearch]           = useState('')
  const [selectedBankId, setSelectedBankId] = useState(null)
  const [showOTP, setShowOTP]         = useState(false)

  const filteredBanks = BANKS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedBank = BANKS.find(b => b.id === selectedBankId)

  const handleBankClick = (bank) => {
    setSelectedBankId(bank.id)
    setShowOTP(true)
  }

  const handleApprove = () => {
    setSelectedBank(selectedBankId)   // store in context for B4
    navigate('/borrower/fetch')
  }

  const handleCancel = () => {
    setSelectedBank(null)
    navigate('/borrower/home')
  }

  return (
    // relative + overflow-hidden enables the OTP modal to overlay within the phone frame
    <div className="relative flex flex-col bg-white min-h-full overflow-hidden">

      {/* ── AA Portal Header ──────────────────────────────────── */}
      <div
        className="px-5 pt-4 pb-5 shrink-0"
        style={{ background: 'linear-gradient(135deg, hsl(222,60%,22%) 0%, hsl(240,55%,30%) 100%)' }}
      >
        {/* Sahamati branding */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
            <span className="text-white text-xs">🔗</span>
          </div>
          <p className="text-white/80 text-xs font-medium tracking-wide">
            Secured by Sahamati AA Framework
          </p>
        </div>

        <h2 className="text-white font-bold text-base mb-1">Link Your Bank Account</h2>
        <p className="text-white/60 text-xs">
          Authenticate to securely share your last 6 months bank statement
        </p>

        {/* Pre-filled phone number */}
        <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
          <span className="text-white/50 text-xs">📱</span>
          <span className="text-white/80 text-xs font-medium">+91 98XXX XXXXX</span>
          <span className="ml-auto text-white/40 text-[10px]">Pre-filled</span>
        </div>
      </div>

      {/* ── Search Bar ───────────────────────────────────────── */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search banks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-xs">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Bank Grid ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filteredBanks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <span className="text-3xl mb-2">🏦</span>
            <p className="text-sm">No banks match "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredBanks.map(bank => (
              <BankCard
                key={bank.id}
                bank={bank}
                selected={selectedBankId === bank.id}
                onClick={() => handleBankClick(bank)}
              />
            ))}
          </div>
        )}

        {/* Downtime notice for Yes Bank */}
        {filteredBanks.some(b => b.status === 'Downtime') && (
          <div className="mt-3 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
            <span className="text-red-400 text-xs mt-0.5">⚠️</span>
            <p className="text-xs text-red-600 leading-relaxed">
              <strong>Yes Bank</strong> is currently experiencing an outage. Our Smart Retry Engine
              will automatically recover your session if selected.
            </p>
          </div>
        )}
      </div>

      {/* ── Cancel Link ──────────────────────────────────────── */}
      <div className="px-5 py-4 border-t border-gray-100 bg-white shrink-0">
        <button
          onClick={handleCancel}
          className="w-full py-3 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
        >
          Cancel Handoff — Return to Application
        </button>
      </div>

      {/* ── OTP Modal Overlay ────────────────────────────────── */}
      {showOTP && selectedBank && (
        <OTPModal
          bank={selectedBank}
          onApprove={handleApprove}
          onClose={() => {
            setShowOTP(false)
            setSelectedBankId(null)
          }}
        />
      )}
    </div>
  )
}
