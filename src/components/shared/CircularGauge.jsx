// SVG circular gauge for BSA score (0–100).
// Props:
//   score: number
//   label?: string
//   size?: number   (SVG viewBox dimension, default 120)
export default function CircularGauge({ score, label, size = 120 }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius  // ≈ 301.6
  const offset = circumference * (1 - score / 100)

  const trackColor = 'hsl(222, 24%, 20%)'
  const fillColor = score >= 75
    ? 'hsl(160, 84%, 39%)'   // emerald
    : score >= 50
    ? 'hsl(38, 92%, 50%)'    // amber
    : 'hsl(0, 72%, 51%)'     // coral

  const textColor = score >= 75
    ? 'text-emerald'
    : score >= 50
    ? 'text-amber'
    : 'text-coral'

  return (
    <div className="flex flex-col items-center gap-2" style={{ minHeight: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={10}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>

      {/* Score number overlaid */}
      <div className="flex flex-col items-center -mt-2" style={{ marginTop: -(size * 0.6) }}>
        <span className={`text-2xl font-bold leading-none ${textColor}`}>{score}</span>
        <span className="text-xs text-text-sec leading-none">/ 100</span>
      </div>

      {label && (
        <p className="text-xs text-text-sec text-center max-w-[120px] leading-snug mt-1">{label}</p>
      )}
    </div>
  )
}
