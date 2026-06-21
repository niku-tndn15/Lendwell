import { useState } from 'react'
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad'
import { useDemoTarget } from '../../demo/useDemoTarget'
import KPICard from '../../components/shared/KPICard'
import SkeletonKPICard from '../../components/shared/skeletons/SkeletonKPICard'
import SkeletonChart from '../../components/shared/skeletons/SkeletonChart'
import { METRICS, FUNNEL_STAGES, calcRevenue, formatCr } from '../../data/metrics'

// ── KPI data derived from METRICS ────────────────────────────────────────────
const KPI_CARDS = [
  {
    label: 'Monthly Applicants',
    value: '1,00,000',
    trend: '▲ +8% MoM',
    trendDirection: 'up',
    accent: 'green',
  },
  {
    label: 'Consent Rate',
    value: '55%',
    trend: '▲ +13pp (optimised flow)',
    trendDirection: 'up',
    accent: 'green',
  },
  {
    label: 'Monthly Disbursals',
    value: '12,600',
    trend: '▲ +17% MoM',
    trendDirection: 'up',
    accent: 'green',
  },
  {
    label: 'Annual Revenue',
    value: formatCr(calcRevenue(0.55, 0.30).annualRevenue),
    trend: '▲ +22% YoY projected',
    trendDirection: 'up',
    accent: 'green',
  },
  {
    label: 'FPD 30-Day Rate',
    value: `${(METRICS.baseline.fpd30DayRate * 100).toFixed(1)}%`,
    trend: '▼ -0.2pp MoM',
    trendDirection: 'up',
    accent: 'green',
  },
  {
    label: 'Manual Review Rate',
    value: `${METRICS.baseline.manualReviewRate * 100}%`,
    trend: '▼ High — target <20%',
    trendDirection: 'down',
    accent: 'red',
  },
]

// ── Funnel Chart ──────────────────────────────────────────────────────────────
function FunnelChart() {
  const ref = useDemoTarget('funnel-chart')
  const maxVol = FUNNEL_STAGES[0].volume

  return (
    <div ref={ref} className="flex flex-col gap-2.5">
      {FUNNEL_STAGES.map((stage, i) => {
        const widthPct = (stage.volume / maxVol) * 100
        const isLeak = stage.conversion !== null && stage.conversion < 80
        return (
          <div key={stage.label}>
            <div className="flex items-center gap-3">
              <div className="w-44 shrink-0 text-right">
                <span className="text-xs text-text-sec truncate block">{stage.label}</span>
              </div>
              <div className="flex-1 relative h-9 bg-white/5 rounded-lg overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ${
                    i === 0
                      ? 'bg-emerald/30'
                      : isLeak
                      ? 'bg-coral/35'
                      : 'bg-emerald/25'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3 gap-2">
                  <span className="text-xs font-bold text-text-pri">
                    {stage.volume.toLocaleString('en-IN')}
                  </span>
                  {stage.conversion && (
                    <span className={`ml-auto text-xs font-semibold ${isLeak ? 'text-coral' : 'text-emerald'}`}>
                      {stage.conversion}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Drop-off indicator between stages */}
            {i < FUNNEL_STAGES.length - 1 && stage.conversion !== null && (
              <div className="flex items-center gap-3 mt-1">
                <div className="w-44 shrink-0" />
                <div className="flex-1 flex items-center gap-1.5 px-3">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className={`text-[10px] font-medium ${isLeak ? 'text-coral/70' : 'text-text-sec/60'}`}>
                    {isLeak
                      ? `↑ ${(100 - stage.conversion)}% dropped`
                      : `${stage.conversion}% through`}
                  </span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Revenue Lift Calculator ───────────────────────────────────────────────────
function RevenueLiftCalculator() {
  const ref = useDemoTarget('revenue-calculator')
  const [consent, setConsent]   = useState(55)
  const [approval, setApproval] = useState(30)

  const baseline  = calcRevenue(0.55, 0.30)
  const projected = calcRevenue(consent / 100, approval / 100)
  const lift      = projected.annualRevenue - baseline.annualRevenue
  const liftPositive = lift >= 0

  return (
    <div ref={ref} className="flex flex-col gap-5">
      {/* Sliders */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-text-sec">Consent Rate</span>
            <span className="text-sm font-bold text-emerald">{consent}%</span>
          </div>
          <input
            type="range"
            min={55} max={85} step={1}
            value={consent}
            onChange={e => setConsent(+e.target.value)}
            className="w-full"
            style={{ accentColor: 'hsl(160, 84%, 39%)' }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-text-sec/50">55% baseline</span>
            <span className="text-[10px] text-text-sec/50">85% target</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-text-sec">Approval Rate</span>
            <span className="text-sm font-bold text-emerald">{approval}%</span>
          </div>
          <input
            type="range"
            min={30} max={50} step={1}
            value={approval}
            onChange={e => setApproval(+e.target.value)}
            className="w-full"
            style={{ accentColor: 'hsl(160, 84%, 39%)' }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-text-sec/50">30% baseline</span>
            <span className="text-[10px] text-text-sec/50">50% target</span>
          </div>
        </div>
      </div>

      {/* Output cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-card p-3 border border-white/8">
          <p className="text-[10px] text-text-sec uppercase tracking-wider mb-1">Baseline Revenue</p>
          <p className="text-base font-bold text-text-pri">{formatCr(baseline.annualRevenue)}</p>
          <p className="text-[10px] text-text-sec mt-0.5">Annual</p>
        </div>
        <div className="bg-white/5 rounded-card p-3 border border-white/8">
          <p className="text-[10px] text-text-sec uppercase tracking-wider mb-1">Projected Revenue</p>
          <p className="text-base font-bold text-emerald">{formatCr(projected.annualRevenue)}</p>
          <p className="text-[10px] text-text-sec mt-0.5">Annual</p>
        </div>
      </div>

      {/* Lift highlight */}
      <div
        className={`rounded-card p-4 border text-center ${
          liftPositive
            ? 'bg-emerald/10 border-emerald/30'
            : 'bg-coral/10 border-coral/30'
        }`}
      >
        <p className="text-xs text-text-sec mb-1">Annual Revenue Lift</p>
        <p className={`text-2xl font-bold ${liftPositive ? 'text-emerald' : 'text-coral'}`}>
          {liftPositive ? '+' : ''}{formatCr(lift)}
        </p>
        <p className="text-[10px] text-text-sec mt-1">
          {projected.approvedLoans.toLocaleString('en-IN')} approved loans / month
        </p>
      </div>
    </div>
  )
}

// ── Trend Line Chart (pure SVG) ───────────────────────────────────────────────
function TrendChart({ title, datasets, suffix = '%', yMin, yMax }) {
  const months  = METRICS.trendData.months
  const N       = months.length
  const W = 420, H = 120
  const PAD_L = 32, PAD_B = 20

  const effectiveMin = yMin ?? Math.min(...datasets.flatMap(d => d.values)) - 2
  const effectiveMax = yMax ?? Math.max(...datasets.flatMap(d => d.values)) + 2

  const xOf = i => PAD_L + (i / (N - 1)) * (W - PAD_L)
  const yOf = v => H - PAD_B - ((v - effectiveMin) / (effectiveMax - effectiveMin)) * (H - PAD_B - 10)
  const pathOf = values => values.map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yOf(v)}`).join(' ')

  const GRID_TICKS = 3
  const gridVals = Array.from({ length: GRID_TICKS }, (_, i) =>
    effectiveMin + (i / (GRID_TICKS - 1)) * (effectiveMax - effectiveMin)
  )

  return (
    <div>
      <p className="text-xs font-semibold text-text-sec uppercase tracking-wider mb-3">{title}</p>
      <svg viewBox={`0 -5 ${W} ${H + 5}`} className="w-full overflow-visible">
        {/* Grid lines */}
        {gridVals.map(v => (
          <g key={v}>
            <line x1={PAD_L} y1={yOf(v)} x2={W} y2={yOf(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PAD_L - 4} y={yOf(v) + 4} textAnchor="end" fontSize={9} fill="hsl(215,20%,55%)">
              {Math.round(v)}{suffix}
            </text>
          </g>
        ))}

        {/* Lines */}
        {datasets.map(ds => (
          <path key={ds.id} d={pathOf(ds.values)} fill="none" stroke={ds.color} strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round" />
        ))}

        {/* Dots on last point */}
        {datasets.map(ds => {
          const last = ds.values[N - 1]
          return (
            <circle key={ds.id + '-dot'} cx={xOf(N - 1)} cy={yOf(last)} r={3}
              fill={ds.color} />
          )
        })}

        {/* X labels */}
        {months.map((m, i) => (
          <text key={m} x={xOf(i)} y={H} textAnchor="middle" fontSize={9} fill="hsl(215,20%,55%)">{m}</text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 mt-2">
        {datasets.map(ds => (
          <div key={ds.id} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: ds.color }} />
            <span className="text-[10px] text-text-sec">{ds.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── L1 Dashboard Root ─────────────────────────────────────────────────────────
export default function L1_Dashboard() {
  const loading      = useSimulatedLoad(900)
  const kpiRef       = useDemoTarget('kpi-strip')
  const trendsRef    = useDemoTarget('trend-chart')

  const { trendData } = METRICS

  const consentDatasets = [
    { id: 'baseline',  label: 'Baseline',  values: trendData.consentRateBaseline,  color: 'hsl(215,20%,55%)' },
    { id: 'optimised', label: 'Optimised', values: trendData.consentRateOptimized, color: 'hsl(160,84%,39%)' },
  ]
  const approvalDatasets = [
    { id: 'baseline',  label: 'Approval (baseline)',  values: trendData.approvalRateBaseline,  color: 'hsl(215,20%,55%)' },
    { id: 'optimised', label: 'Approval (optimised)', values: trendData.approvalRateOptimized, color: 'hsl(245,82%,68%)' },
  ]
  const delinqDatasets = [
    { id: 'baseline',  label: 'FPD Baseline',  values: trendData.delinquencyBaseline,  color: 'hsl(215,20%,55%)' },
    { id: 'optimised', label: 'FPD Optimised', values: trendData.delinquencyOptimized, color: 'hsl(160,84%,39%)' },
  ]

  return (
    <div className="h-full overflow-y-auto bg-navy text-text-pri">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-pri">Executive Performance Dashboard</h1>
            <p className="text-sm text-text-sec mt-0.5">LendWell Intelligence · AA-Powered Lending Analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-sec">Jan–Jun 2024</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald/15 border border-emerald/30 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs font-medium text-emerald">Live Data</span>
            </div>
          </div>
        </div>

        {/* ── KPI Strip ─────────────────────────────────────────────────── */}
        <div ref={kpiRef} className="grid grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonKPICard key={i} />)
            : KPI_CARDS.map(kpi => <KPICard key={kpi.label} {...kpi} />)
          }
        </div>

        {/* ── Funnel + Revenue Lift ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Funnel card */}
          <div className="bg-surface rounded-card p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-text-sec uppercase tracking-wider">
                Consent-to-Disbursal Funnel
              </p>
              <span className="text-[10px] text-text-sec/60 bg-white/5 px-2 py-0.5 rounded-full">
                100K applicants / month
              </span>
            </div>
            {loading
              ? <SkeletonChart height={220} />
              : <FunnelChart />
            }
          </div>

          {/* Revenue Lift Calculator */}
          <div className="bg-surface rounded-card p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-text-sec uppercase tracking-wider">
                Revenue Lift Calculator
              </p>
              <span className="text-[10px] text-emerald bg-emerald/10 px-2 py-0.5 rounded-full border border-emerald/20">
                Interactive
              </span>
            </div>
            {loading
              ? <SkeletonChart height={220} />
              : <RevenueLiftCalculator />
            }
          </div>
        </div>

        {/* ── Trend Charts ──────────────────────────────────────────────── */}
        <div ref={trendsRef} className="grid grid-cols-3 gap-4">
          <div className="bg-surface rounded-card p-5 border border-white/5 col-span-2">
            <div className="grid grid-cols-2 gap-6">
              <div>
                {loading
                  ? <SkeletonChart height={160} />
                  : <TrendChart title="Consent Rate Trend" datasets={consentDatasets} yMin={50} yMax={72} />
                }
              </div>
              <div>
                {loading
                  ? <SkeletonChart height={160} />
                  : <TrendChart title="Approval Rate Trend" datasets={approvalDatasets} yMin={28} yMax={38} />
                }
              </div>
            </div>
          </div>

          {/* Delinquency + TTD metrics */}
          <div className="bg-surface rounded-card p-5 border border-white/5 flex flex-col gap-5">
            <div>
              {loading
                ? <SkeletonChart height={130} />
                : <TrendChart title="FPD 30-Day Rate" datasets={delinqDatasets} yMin={1.5} yMax={2.2} suffix="%" />
              }
            </div>
            {/* TTD + Additional metrics */}
            <div className="border-t border-white/8 pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-sec">Avg Time-to-Decision</span>
                <span className="text-sm font-bold text-text-pri">{METRICS.baseline.ttdSeconds}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-sec">Platform Fee</span>
                <span className="text-sm font-bold text-text-pri">0.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-sec">CAC / Applicant</span>
                <span className="text-sm font-bold text-text-pri">₹{METRICS.baseline.cacPerApplicant}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-sec">Avg Loan Value</span>
                <span className="text-sm font-bold text-text-pri">₹80,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer spacer ─────────────────────────────────────────────── */}
        <div className="h-2" />
      </div>
    </div>
  )
}
