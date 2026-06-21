import { useCallback, useEffect, useRef, useState } from 'react'

export default function OTPModal({ bank, onApprove, onClose }) {
  const [digits, setDigits]     = useState(['', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(60)
  const [expired, setExpired]   = useState(false)
  const inputRefs               = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const timerRef                = useRef(null)

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs[0].current?.focus(), 100)
  }, [])

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleResend = () => {
    setExpired(false)
    setTimeLeft(60)
    setDigits(['', '', '', ''])
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setExpired(true); return 0 }
        return prev - 1
      })
    }, 1000)
    setTimeout(() => inputRefs[0].current?.focus(), 50)
  }

  const handleInput = useCallback((index, value) => {
    if (!/^\d*$/.test(value)) return
    const char = value.slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    if (char && index < 3) {
      setTimeout(() => inputRefs[index + 1].current?.focus(), 10)
    }
  }, [digits, inputRefs])

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits]
      next[index - 1] = ''
      setDigits(next)
      setTimeout(() => inputRefs[index - 1].current?.focus(), 10)
    }
  }, [digits, inputRefs])

  const allFilled = digits.every(d => d !== '')

  return (
    // Slide-up sheet anchored to bottom of phone screen
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-8 shadow-2xl">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-base font-bold text-gray-800">Enter OTP</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Sent to +91 98XXX XXXXX for {bank.name}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 -mt-1">
            ✕
          </button>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-4 justify-center my-6">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`otp-input ${d ? 'filled' : ''}`}
            />
          ))}
        </div>

        {/* Timer / Resend */}
        <div className="text-center mb-5">
          {expired ? (
            <button
              onClick={handleResend}
              className="text-sm font-semibold text-b-accent underline underline-offset-2"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-xs text-gray-500">
              OTP valid for{' '}
              <span className={`font-semibold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                {timeLeft}s
              </span>
            </p>
          )}
        </div>

        {/* Approve button */}
        <button
          disabled={!allFilled}
          onClick={() => allFilled && onApprove()}
          className={`w-full py-4 rounded-[24px] font-semibold text-base transition-all duration-200 ${
            allFilled
              ? 'text-white active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          style={
            allFilled
              ? {
                  background: 'linear-gradient(135deg, hsl(245,82%,58%) 0%, hsl(260,78%,65%) 100%)',
                  boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                }
              : {}
          }
        >
          Approve Data Share
        </button>

        <p className="text-center text-[10px] text-gray-400 mt-3">
          🔒 Encrypted · Sahamati AA Framework
        </p>
      </div>
    </div>
  )
}
