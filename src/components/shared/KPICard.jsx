// Reusable KPI card for L1 dashboard.
// Props:
//   label: string
//   value: string
//   trend?: string          e.g. "▼ -5% MoM"
//   trendDirection?: 'up' | 'down' | 'neutral'
//   accent?: 'red' | 'green' | 'neutral'
export default function KPICard({ label, value, trend, trendDirection = 'neutral', accent = 'neutral' }) {
  const accentBar = {
    red:     'bg-coral',
    green:   'bg-emerald',
    neutral: 'bg-white/10',
  }[accent]

  const trendColor = {
    up:      'text-emerald',
    down:    'text-coral',
    neutral: 'text-text-sec',
  }[trendDirection]

  return (
    <div className="bg-surface rounded-card p-5 flex flex-col gap-3 border border-white/5 relative overflow-hidden">
      {/* Accent stripe */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentBar}`} />

      <p className="text-xs font-medium text-text-sec uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-text-pri leading-none">{value}</p>

      {trend && (
        <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
      )}
    </div>
  )
}
