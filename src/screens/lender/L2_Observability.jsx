import { useState } from 'react'
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad'
import { useDemoTarget } from '../../demo/useDemoTarget'
import StatusBadge from '../../components/shared/StatusBadge'
import SkeletonKPICard from '../../components/shared/skeletons/SkeletonKPICard'
import SkeletonTable from '../../components/shared/skeletons/SkeletonTable'
import SkeletonChart from '../../components/shared/skeletons/SkeletonChart'
import { BANKS } from '../../data/banks'
import { FUNNEL_STAGES } from '../../data/metrics'

// ── Derived telemetry metrics ─────────────────────────────────────────────────
const totalFailures = BANKS.reduce((s, b) => s + b.monthlyFailures, 0)       // 66,600

// FIP-caused failures per bank: monthlyFailures × (fipUnavailable / 100)
const fipFailures = BANKS.reduce((s, b) => s + b.monthlyFailures * (b.failureBreakdown.fipUnavailable / 100), 0)
const otpFailures = BANKS.reduce((s, b) => s + b.monthlyFailures * (b.failureBreakdown.otpTimeout / 100), 0)
const intercepted = Math.round(fipFailures + otpFailures)
const recovered   = Math.round(intercepted * 0.92)
const recoveryPct = 92

const TELEMETRY_KPIS = [
  {
    label: 'Consent Completion Rate',
    value: '55%',
    sub: `${FUNNEL_STAGES[1].volume.toLocaleString('en-IN')} / month`,
    accent: 'neutral',
  },
  {
    label: 'Monthly AA Failures',
    value: totalFailures.toLocaleString('en-IN'),
    sub: 'Across all FIPs',
    accent: 'red',
  },
  {
    label: 'Smart Retry Intercepted',
    value: intercepted.toLocaleString('en-IN'),
    sub: 'FIP + OTP failures / month',
    accent: 'amber',
  },
  {
    label: 'Failures Recovered',
    value: recovered.toLocaleString('en-IN'),
    sub: `${recoveryPct}% recovery rate`,
    accent: 'green',
  },
]

// ── Failure type columns for heatmap ─────────────────────────────────────────
const FAILURE_COLS = [
  { key: 'userAbandoned',          label: 'User\nAbandoned' },
  { key: 'consentDenied',          label: 'Consent\nDenied' },
  { key: 'fipUnavailable',         label: 'FIP\nUnavailable' },
  { key: 'accountDiscoveryFailed', label: 'Account\nDiscovery' },
  { key: 'otpTimeout',             label: 'OTP\nTimeout' },
]

// ── Telemetry KPI strip (compact) ─────────────────────────────────────────────
function TelemetryKPI({ label, value, sub, accent }) {
  const accentBar = { red: 'bg-coral', green: 'bg-emerald', amber: 'bg-amber', neutral: 'bg-white/10' }[accent]
  return (
    <div className="bg-surface rounded-card p-4 border border-white/5 relative overflow-hidden flex flex-col gap-1.5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentBar}`} />
      <p className="text-[10px] font-medium text-text-sec uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-text-pri leading-none">{value}</p>
      <p className="text-[10px] text-text-sec">{sub}</p>
    </div>
  )
}

// ── Heatmap ───────────────────────────────────────────────────────────────────
function FailureHeatmap() {
  const ref = useDemoTarget('failure-heatmap')
  const [hovered, setHovered] = useState(null)

  // Find max value across all cells for normalization
  const allVals = BANKS.flatMap(b => FAILURE_COLS.map(c => b.failureBreakdown[c.key]))
  const maxVal  = Math.max(...allVals)

  const cellColor = (val) => {
    const norm = val / maxVal
    if (norm >= 0.65) return 'bg-coral/80 text-white'
    if (norm >= 0.35) return 'bg-amber/60 text-navy'
    if (norm >= 0.12) return 'bg-amber/20 text-text-sec'
    return 'bg-white/5 text-text-sec/50'
  }

  return (
    <div ref={ref} className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="text-[10px] text-text-sec font-medium uppercase tracking-wider pb-3 pr-4 w-28">
              Bank / FIP
            </th>
            {FAILURE_COLS.map(c => (
              <th key={c.key} className="text-[10px] text-text-sec font-medium uppercase tracking-wider pb-3 px-2 text-center">
                {c.label.split('\n').map((l, i) => <div key={i}>{l}</div>)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BANKS.map(bank => (
            <tr key={bank.id} className="group">
              <td className="py-2 pr-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    bank.status === 'Online' ? 'bg-emerald' :
                    bank.status === 'Latency Warning' ? 'bg-amber' : 'bg-coral'
                  }`} />
                  <span className="text-xs font-medium text-text-pri truncate">{bank.name}</span>
                </div>
              </td>
              {FAILURE_COLS.map(col => {
                const val = bank.failureBreakdown[col.key]
                const key = `${bank.id}-${col.key}`
                return (
                  <td key={key} className="py-2 px-2 text-center">
                    <div
                      className={`relative inline-flex items-center justify-center w-12 h-8 rounded-md text-[11px] font-bold cursor-default transition-all duration-150 hover:scale-110 ${cellColor(val)}`}
                      onMouseEnter={() => setHovered({ bank: bank.name, col: col.key.replace(/([A-Z])/g, ' $1').trim(), val })}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {val}%
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tooltip */}
      {hovered && (
        <div className="mt-3 px-3 py-2 bg-white/8 rounded-lg border border-white/10 text-xs text-text-sec">
          <span className="text-text-pri font-medium">{hovered.bank}</span> — {hovered.col}:{' '}
          <span className="text-amber font-semibold">{hovered.val}%</span> of failures
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/8">
        <span className="text-[10px] text-text-sec/60 uppercase tracking-wider">Severity</span>
        {[
          { label: 'Low (<12%)', cls: 'bg-white/5' },
          { label: 'Medium (12–35%)', cls: 'bg-amber/20' },
          { label: 'High (35–65%)', cls: 'bg-amber/60' },
          { label: 'Critical (>65%)', cls: 'bg-coral/80' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${l.cls}`} />
            <span className="text-[10px] text-text-sec">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Recovery Ring ─────────────────────────────────────────────────────────────
function RecoveryRing({ pct, size = 100 }) {
  const radius = 40
  const circ   = 2 * Math.PI * radius
  const offset = circ * (1 - pct / 100)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={radius} fill="none" stroke="hsl(222,24%,20%)" strokeWidth={10} />
      <circle
        cx={50} cy={50} r={radius} fill="none"
        stroke="hsl(160,84%,39%)" strokeWidth={10} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
      />
      <text x={50} y={47} textAnchor="middle" fontSize={16} fontWeight="bold" fill="hsl(160,84%,39%)">{pct}%</text>
      <text x={50} y={59} textAnchor="middle" fontSize={8} fill="hsl(215,20%,65%)">Recovery</text>
    </svg>
  )
}

// ── Smart Retry Recovery Panel ────────────────────────────────────────────────
function RetryRecoveryPanel() {
  const ref = useDemoTarget('retry-recovery')
  return (
    <div ref={ref} className="flex flex-col gap-4">
      {/* Ring + headline stats */}
      <div className="flex items-center gap-6">
        <RecoveryRing pct={recoveryPct} size={110} />
        <div className="flex flex-col gap-3 flex-1">
          {[
            { label: 'Failures Intercepted',  value: intercepted.toLocaleString('en-IN'), color: 'text-amber' },
            { label: 'Successfully Recovered', value: recovered.toLocaleString('en-IN'),   color: 'text-emerald' },
            { label: 'Net Remaining',          value: (intercepted - recovered).toLocaleString('en-IN'), color: 'text-coral' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-text-sec">{label}</span>
              <span className={`text-sm font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-bank retry insights */}
      <div className="flex flex-col gap-2 border-t border-white/8 pt-4">
        <p className="text-[10px] font-semibold text-text-sec uppercase tracking-wider mb-1">
          Recommended Actions
        </p>
        {BANKS.filter(b => b.status !== 'Online' || b.primaryIssue !== 'None').slice(0, 3).map(bank => (
          <div key={bank.id} className="flex items-start gap-2.5 py-2 border-b border-white/5 last:border-0">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
              bank.status === 'Downtime' ? 'bg-coral' :
              bank.status === 'Latency Warning' ? 'bg-amber' : 'bg-text-sec/40'
            }`} />
            <div>
              <p className="text-xs font-medium text-text-pri">{bank.name}</p>
              <p className="text-[11px] text-text-sec leading-relaxed mt-0.5">{bank.recommendedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Sortable Bank Table ───────────────────────────────────────────────────────
const TABLE_COLS = [
  { key: 'name',                label: 'Bank / FIP',        sortable: true,  align: 'left' },
  { key: 'status',              label: 'Status',            sortable: true,  align: 'left' },
  { key: 'consentSuccessRate',  label: 'Consent Rate',      sortable: true,  align: 'right' },
  { key: 'fetchLatencySeconds', label: 'Avg Latency',       sortable: true,  align: 'right' },
  { key: 'monthlyFailures',     label: 'Monthly Failures',  sortable: true,  align: 'right' },
  { key: 'primaryIssue',        label: 'Primary Issue',     sortable: false, align: 'left' },
]

function BankTable() {
  const ref = useDemoTarget('bank-table')
  const [sortCol, setSortCol]  = useState('monthlyFailures')
  const [sortDir, setSortDir]  = useState('desc')

  const handleSort = (key) => {
    if (sortCol === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(key)
      setSortDir('desc')
    }
  }

  const sorted = [...BANKS].sort((a, b) => {
    const va = a[sortCol], vb = b[sortCol]
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb
    return sortDir === 'asc' ? cmp : -cmp
  })

  const rateColor = (rate) =>
    rate >= 85 ? 'text-emerald' : rate >= 70 ? 'text-amber' : 'text-coral'

  const latColor = (lat) =>
    lat <= 3 ? 'text-emerald' : lat <= 6 ? 'text-amber' : 'text-coral'

  return (
    <div ref={ref} className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/8">
            {TABLE_COLS.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`py-3 px-4 text-[10px] font-semibold text-text-sec uppercase tracking-wider select-none ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                } ${col.sortable ? 'cursor-pointer hover:text-text-pri transition-colors' : ''}`}
              >
                {col.label}
                {col.sortable && sortCol === col.key && (
                  <span className="ml-1 text-emerald">{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(bank => (
            <tr key={bank.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
              <td className="py-3.5 px-4">
                <span className="text-sm font-semibold text-text-pri">{bank.name}</span>
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={bank.status} />
              </td>
              <td className={`py-3.5 px-4 text-right text-sm font-bold ${rateColor(bank.consentSuccessRate)}`}>
                {bank.consentSuccessRate}%
              </td>
              <td className={`py-3.5 px-4 text-right text-sm font-bold ${latColor(bank.fetchLatencySeconds)}`}>
                {bank.fetchLatencySeconds}s
              </td>
              <td className="py-3.5 px-4 text-right">
                <span className={`text-sm font-bold ${bank.monthlyFailures > 10000 ? 'text-coral' : bank.monthlyFailures > 6000 ? 'text-amber' : 'text-text-pri'}`}>
                  {bank.monthlyFailures.toLocaleString('en-IN')}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <span className="text-xs text-text-sec">{bank.primaryIssue}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Consent Funnel Telemetry ──────────────────────────────────────────────────
function ConsentFunnelTelemetry() {
  const ref = useDemoTarget('consent-funnel-telemetry')
  const stages = [
    { label: 'Initiated',       value: 100000, pct: 100 },
    { label: 'OTP Sent',        value: 82000,  pct: 82  },
    { label: 'OTP Verified',    value: 64000,  pct: 64  },
    { label: 'Consent Granted', value: 55000,  pct: 55  },
    { label: 'Statement Fetched', value: 46750, pct: 46.75 },
  ]

  return (
    <div ref={ref} className="flex flex-col gap-2">
      {stages.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-[11px] text-text-sec w-36 shrink-0 text-right">{s.label}</span>
          <div className="flex-1 relative h-6 bg-white/5 rounded-md overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-md bg-emerald/30 transition-all duration-700"
              style={{ width: `${s.pct}%` }}
            />
            <div className="absolute inset-0 flex items-center px-2.5">
              <span className="text-[11px] font-semibold text-text-pri">
                {s.value.toLocaleString('en-IN')}
              </span>
              <span className="ml-auto text-[11px] font-medium text-emerald">{s.pct}%</span>
            </div>
          </div>
          {i < stages.length - 1 && (
            <span className="text-[10px] text-text-sec/50 w-16 shrink-0 text-left">
              {Math.round(100 - (stages[i + 1].pct / s.pct * 100))}% drop ↓
            </span>
          )}
          {i === stages.length - 1 && <span className="w-16 shrink-0" />}
        </div>
      ))}
    </div>
  )
}

// ── L2 Root ───────────────────────────────────────────────────────────────────
export default function L2_Observability() {
  const loading = useSimulatedLoad(950)

  return (
    <div className="h-full overflow-y-auto bg-navy text-text-pri">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-pri">FIP & Consent Observability Console</h1>
            <p className="text-sm text-text-sec mt-0.5">Real-time AA telemetry · 6 FIPs monitored</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-sec">Last refreshed: just now</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber/15 border border-amber/30 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span className="text-xs font-medium text-amber">2 Alerts Active</span>
            </div>
          </div>
        </div>

        {/* ── Telemetry KPI Strip ───────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPICard key={i} />)
            : TELEMETRY_KPIS.map(k => <TelemetryKPI key={k.label} {...k} />)
          }
        </div>

        {/* ── Bank Table + Retry Recovery ──────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-surface rounded-card border border-white/5 overflow-hidden">
            <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-white/8">
              <p className="text-xs font-semibold text-text-sec uppercase tracking-wider">
                Bank Performance Table
              </p>
              <span className="text-[10px] text-text-sec/60">Click column header to sort</span>
            </div>
            {loading ? (
              <div className="p-4">
                <SkeletonTable rows={6} />
              </div>
            ) : (
              <BankTable />
            )}
          </div>

          <div className="bg-surface rounded-card p-5 border border-white/5">
            <p className="text-xs font-semibold text-text-sec uppercase tracking-wider mb-4">
              Smart Retry Recovery
            </p>
            {loading
              ? <SkeletonChart height={240} />
              : <RetryRecoveryPanel />
            }
          </div>
        </div>

        {/* ── Failure Heatmap + Consent Funnel ─────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-surface rounded-card p-5 border border-white/5">
            <p className="text-xs font-semibold text-text-sec uppercase tracking-wider mb-4">
              Failure Type Heatmap
            </p>
            {loading
              ? <SkeletonChart height={200} />
              : <FailureHeatmap />
            }
          </div>

          <div className="bg-surface rounded-card p-5 border border-white/5">
            <p className="text-xs font-semibold text-text-sec uppercase tracking-wider mb-4">
              Consent Funnel Telemetry
            </p>
            {loading
              ? <SkeletonChart height={200} />
              : <ConsentFunnelTelemetry />
            }
          </div>
        </div>

        {/* ── Footer spacer ─────────────────────────────────────────────── */}
        <div className="h-2" />
      </div>
    </div>
  )
}
