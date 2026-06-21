// Coloured status pill.
// status: 'Online' | 'Latency Warning' | 'Downtime' | 'Pending' | 'Active' | 'Clear' | 'High Alert' | string
export default function StatusBadge({ status }) {
  const style = (() => {
    switch (status) {
      case 'Online':
      case 'Active':
      case 'Clear':
        return 'bg-emerald/15 text-emerald border-emerald/30'
      case 'Latency Warning':
      case 'Pending':
        return 'bg-amber/15 text-amber border-amber/30'
      case 'Downtime':
      case 'High Alert':
        return 'bg-coral/15 text-coral border-coral/30'
      default:
        return 'bg-white/8 text-text-sec border-white/10'
    }
  })()

  const dot = (() => {
    switch (status) {
      case 'Online':
      case 'Active':
      case 'Clear':
        return 'bg-emerald'
      case 'Latency Warning':
      case 'Pending':
        return 'bg-amber'
      case 'Downtime':
      case 'High Alert':
        return 'bg-coral'
      default:
        return 'bg-text-sec'
    }
  })()

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}
