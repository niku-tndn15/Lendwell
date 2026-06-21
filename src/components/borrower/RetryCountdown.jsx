import { useEffect, useRef, useState } from 'react'

export default function RetryCountdown({ onComplete }) {
  const [count, setCount]    = useState(15)
  const intervalRef          = useRef(null)
  const onCompleteRef        = useRef(onComplete)
  onCompleteRef.current      = onComplete  // keep ref current without re-subscribing

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onCompleteRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  // Expose a cancel method through a ref on the component — not needed since
  // parent controls mounting. When parent unmounts this, the interval clears.

  const pct = (count / 15) * 100

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-amber-800">
            Retrying automatically in{' '}
            <span className={`text-lg tabular-nums ${count <= 5 ? 'text-red-600' : 'text-amber-700'}`}>
              {count}s
            </span>
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Detecting temporary bank-side outage…
          </p>
        </div>
        {/* Circular countdown indicator */}
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#fde68a" strokeWidth="4" />
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke={count <= 5 ? '#ef4444' : '#d97706'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 * (1 - pct / 100)}
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-700 tabular-nums">
            {count}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-[900ms] ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
