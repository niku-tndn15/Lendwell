import { useState } from 'react'
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad'
import { useDemoTarget } from '../../demo/useDemoTarget'
import { useAppContext } from '../../context/AppContext'
import CircularGauge from '../../components/shared/CircularGauge'
import TabSwitcher from '../../components/shared/TabSwitcher'
import StatusBadge from '../../components/shared/StatusBadge'
import SkeletonDetailPanel from '../../components/shared/skeletons/SkeletonDetailPanel'
import { APPLICANTS } from '../../data/applicants'
import { EWS_PORTFOLIO, EWS_TRIGGER_RULES } from '../../data/ews'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const QUEUE_FILTERS = [
  { id: 'all',           label: 'All' },
  { id: 'pending',       label: 'Pending' },
  { id: 'approved',      label: 'Approved' },
  { id: 'manual-review', label: 'Manual Review' },
  { id: 'declined',      label: 'Declined' },
]

const CASE_TABS = [
  { id: 'bsa-signals',    label: 'BSA Signals' },
  { id: 'ews-guardrails', label: 'EWS Guardrails' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmt(v) {
  return '₹' + v.toLocaleString('en-IN')
}

function recAccent(rec) {
  if (rec === 'Reject') return 'coral'
  if (rec === 'Manual Review') return 'amber'
  return 'emerald' // Auto-Approve, Approve + EWS
}

// ─────────────────────────────────────────────────────────────────────────────
// Queue components
// ─────────────────────────────────────────────────────────────────────────────

function QueueRow({ app, isSelected, onClick }) {
  const accent   = recAccent(app.recommendation)
  const dotCls   = accent === 'emerald' ? 'bg-emerald' : accent === 'amber' ? 'bg-amber' : 'bg-coral'
  const scoreCls = app.bsaScore >= 75 ? 'text-emerald' : app.bsaScore >= 50 ? 'text-amber' : 'text-coral'
  const pillCls  = accent === 'emerald'
    ? 'bg-emerald/10 text-emerald border-emerald/20'
    : accent === 'amber'
    ? 'bg-amber/10 text-amber border-amber/20'
    : 'bg-coral/10 text-coral border-coral/20'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 rounded-card border transition-all mb-0.5 ${
        isSelected
          ? 'bg-white/10 border-emerald/30'
          : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${dotCls}`} />
            <span className="text-sm font-semibold text-text-pri truncate">{app.name}</span>
          </div>
          <p className="text-xs text-text-sec mt-0.5 pl-3.5 truncate">{app.type}</p>
          <div className="pl-3.5 mt-1.5">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${pillCls}`}>
              {app.recommendation}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-xl font-bold leading-none ${scoreCls}`}>{app.bsaScore}</div>
          <div className="text-[10px] text-text-sec mt-0.5">BSA</div>
        </div>
      </div>
    </button>
  )
}

function SkeletonQueueRow() {
  return (
    <div className="px-3 py-3 mb-0.5 flex items-center justify-between gap-2">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <div className="skeleton w-2 h-2 rounded-full" />
          <div className="skeleton h-3 w-28 rounded" />
        </div>
        <div className="skeleton h-2.5 w-20 rounded ml-3.5" />
        <div className="skeleton h-4 w-24 rounded ml-3.5" />
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="skeleton h-5 w-7 rounded" />
        <div className="skeleton h-2 w-5 rounded" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BSA Signals Tab
// ─────────────────────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, accent }) {
  const cls = accent === 'emerald' ? 'border-emerald/25 bg-emerald/5'
    : accent === 'amber'           ? 'border-amber/25 bg-amber/5'
    : accent === 'coral'           ? 'border-coral/25 bg-coral/5'
    :                                'border-white/8 bg-surface/40'
  return (
    <div className={`rounded-card border p-3 ${cls}`}>
      <div className="text-[10px] text-text-sec uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-bold text-text-pri leading-snug">{value}</div>
      {sub && <div className="text-xs text-text-sec mt-0.5 leading-tight">{sub}</div>}
    </div>
  )
}

function BSASignalsTab({ app }) {
  const gaugeRef   = useDemoTarget('bsa-gauge')
  const accent     = recAccent(app.recommendation)
  const accentCls  = accent === 'emerald' ? 'text-emerald' : accent === 'amber' ? 'text-amber' : 'text-coral'

  const incomeAccent  = ['Very High', 'High'].includes(app.income.consistency) ? 'emerald' : app.income.consistency === 'Medium' ? 'amber' : 'coral'
  const surplusAccent = app.surplus >= 0 ? 'emerald' : 'coral'
  const emiAccent     = app.emiAffordability.safe ? 'emerald' : 'coral'
  const bounceAccent  = app.bounce.count === 0 ? 'emerald' : app.bounce.count <= 2 ? 'amber' : 'coral'

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* BSA Gauge — demo spotlight target */}
      <div
        ref={gaugeRef}
        className="flex flex-col items-center gap-2 py-4 rounded-card bg-surface/30 border border-white/5"
      >
        <CircularGauge score={app.bsaScore} size={130} />
        <div className="text-center mt-1">
          <p className={`text-sm font-semibold ${accentCls}`}>{app.bsaLabel}</p>
          <p className="text-xs text-text-sec mt-0.5">
            Time-to-Decision: {app.ttd}&nbsp;&nbsp;·&nbsp;&nbsp;CIBIL:{' '}
            {app.cibil === -1 ? 'No Bureau Score (NTC)' : app.cibil}
          </p>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          label="Avg Monthly Inflow"
          value={fmt(app.income.avgMonthlyInflow)}
          sub={app.income.consistency + ' consistency'}
          accent={incomeAccent}
        />
        <MetricCard
          label="Monthly Surplus"
          value={app.surplus < 0 ? `–${fmt(Math.abs(app.surplus))}` : fmt(app.surplus)}
          sub={app.surplusTrend}
          accent={surplusAccent}
        />
        <MetricCard
          label="EMI Affordability"
          value={app.emiAffordability.emiToIncome + ' of income'}
          sub={app.emiAffordability.safe ? 'Within safe threshold' : 'Exceeds safe threshold'}
          accent={emiAccent}
        />
        <MetricCard
          label="Bounce History"
          value={app.bounce.count === 0 ? 'None in 6 months' : `${app.bounce.count} bounce${app.bounce.count > 1 ? 's' : ''}`}
          sub={app.bounce.count > 0 ? app.bounce.classification : 'Clean repayment history'}
          accent={bounceAccent}
        />
      </div>

      {/* Income Source */}
      <div className="rounded-card border border-white/8 bg-surface/40 p-3">
        <div className="text-[10px] text-text-sec uppercase tracking-wider mb-1">Income Source</div>
        <p className="text-sm text-text-pri">{app.income.source}</p>
        <p className="text-xs text-text-sec mt-0.5">Expense volatility: {app.expenseVolatility}</p>
      </div>

      {/* Positive Signals */}
      {app.reasonsPositive.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-text-sec uppercase tracking-wider mb-2">Positive Signals</div>
          <div className="flex flex-col gap-1.5">
            {app.reasonsPositive.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald shrink-0 text-xs mt-0.5">✓</span>
                <span className="text-xs text-text-pri leading-relaxed">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Signals */}
      {app.reasonsRisk.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-text-sec uppercase tracking-wider mb-2">Risk Signals</div>
          <div className="flex flex-col gap-1.5">
            {app.reasonsRisk.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber shrink-0 text-xs mt-0.5">⚠</span>
                <span className="text-xs text-text-pri leading-relaxed">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EWS Guardrails Tab
// ─────────────────────────────────────────────────────────────────────────────

function EWSGuardrailsTab({ app }) {
  const ewsEntry = EWS_PORTFOLIO.portfolio.find(p => p.borrowerId === app.id) ?? null
  const hasAlert = ewsEntry?.alertStatus === 'High Alert' && ewsEntry?.alert != null

  if (!ewsEntry) {
    return (
      <div className="p-5 flex flex-col gap-4">
        <div className="py-6 text-center">
          <div className="text-3xl mb-2">🛡️</div>
          <p className="text-sm font-medium text-text-sec">Not yet enrolled</p>
          <p className="text-xs text-text-sec/60 mt-1">EWS monitoring activates on loan disbursement.</p>
        </div>
        <div>
          <div className="text-xs font-semibold text-text-sec uppercase tracking-wider mb-2">
            Monitoring Rules (applied on enrolment)
          </div>
          {EWS_TRIGGER_RULES.map(rule => (
            <div key={rule.id} className="rounded-card border border-white/8 bg-surface/40 p-3 mb-2">
              <div className="text-xs font-medium text-text-pri">{rule.label}</div>
              <div className="text-xs text-text-sec mt-1 leading-relaxed">{rule.description}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-pri">EWS Monitoring Active</p>
          <p className="text-xs text-text-sec mt-0.5">Last refreshed: {EWS_PORTFOLIO.lastRefreshed}</p>
        </div>
        <StatusBadge status={hasAlert ? 'High Alert' : 'Active'} />
      </div>

      {/* Active Alert Card */}
      {hasAlert && (
        <div className="rounded-card border border-coral/30 bg-coral/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-coral">⚠</span>
            <span className="text-sm font-bold text-coral">{ewsEntry.alert.type}</span>
          </div>
          <p className="text-xs text-text-sec leading-relaxed mb-3">{ewsEntry.alert.detail}</p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Current Balance', value: fmt(ewsEntry.alert.currentBalance),    hi: false },
              { label: '3-Month Avg',     value: fmt(ewsEntry.alert.avgBalance3Month),  hi: false },
              { label: 'Last EMI',        value: ewsEntry.alert.lastEmiStatus,           hi: true  },
              { label: 'Next EMI',        value: `${fmt(ewsEntry.alert.nextEmiAmount)} · ${ewsEntry.alert.nextEmiDue}`, hi: false },
            ].map(({ label, value, hi }) => (
              <div key={label} className="bg-white/5 rounded-card p-2">
                <div className="text-[10px] text-text-sec uppercase tracking-wider">{label}</div>
                <div className={`text-xs font-semibold mt-0.5 ${hi ? 'text-emerald' : 'text-text-pri'}`}>{value}</div>
              </div>
            ))}
          </div>

          <div className="bg-amber/10 border border-amber/20 rounded-card p-2.5 text-xs text-amber leading-relaxed">
            <strong>Recommended Action: </strong>{ewsEntry.alert.recommendedAction}
          </div>
          <p className="text-[10px] text-text-sec mt-2">Detected: {ewsEntry.alert.detectedAt}</p>
        </div>
      )}

      {/* Account Snapshot */}
      <div className="rounded-card border border-white/8 bg-surface/40 p-3">
        <div className="text-[10px] text-text-sec uppercase tracking-wider mb-2">Account Snapshot</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-text-sec">EMI Due Date</div>
            <div className="text-xs font-medium text-text-pri mt-0.5">{ewsEntry.emiDueDate}</div>
          </div>
          <div>
            <div className="text-[10px] text-text-sec">Last Balance Check</div>
            <div className="text-xs font-medium text-text-pri mt-0.5">{fmt(Number(ewsEntry.lastBalanceCheck))}</div>
          </div>
        </div>
      </div>

      {/* Trigger Rules */}
      <div>
        <div className="text-xs font-semibold text-text-sec uppercase tracking-wider mb-2">Trigger Rules</div>
        {EWS_TRIGGER_RULES.map(rule => {
          const fired = ewsEntry[`${rule.id}Triggered`]
          return (
            <div
              key={rule.id}
              className={`rounded-card border p-3 mb-2 ${fired ? 'border-coral/30 bg-coral/5' : 'border-white/8 bg-surface/40'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs shrink-0 ${fired ? 'text-coral' : 'text-emerald'}`}>{fired ? '⚠' : '✓'}</span>
                <span className="text-xs font-medium text-text-pri flex-1">{rule.label}</span>
                {fired && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-coral/20 text-coral font-semibold">
                    TRIGGERED
                  </span>
                )}
              </div>
              <p className="text-xs text-text-sec mt-1 pl-4 leading-relaxed">{rule.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Case Detail Panel
// ─────────────────────────────────────────────────────────────────────────────

function CaseDetailPanel({ app, activeTab, onTabChange, onAction }) {
  const accent    = recAccent(app.recommendation)
  const accentCls = accent === 'emerald' ? 'text-emerald' : accent === 'amber' ? 'text-amber' : 'text-coral'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-text-pri">{app.name}</h2>
            <p className="text-xs text-text-sec mt-0.5">
              {app.id} · {app.type} · {fmt(app.loanAmount)} / {app.tenure}m · EMI {fmt(app.emi)}
            </p>
          </div>
          <span className={`text-xs font-semibold shrink-0 ${accentCls}`}>{app.recommendation}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAction('approve', app)}
            className="px-3 py-1.5 text-xs font-semibold rounded-card bg-emerald/15 text-emerald border border-emerald/30 hover:bg-emerald/25 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onAction('review', app)}
            className="px-3 py-1.5 text-xs font-semibold rounded-card bg-amber/10 text-amber border border-amber/30 hover:bg-amber/20 transition-colors"
          >
            Manual Review
          </button>
          <button
            onClick={() => onAction('reject', app)}
            className="px-3 py-1.5 text-xs font-semibold rounded-card bg-coral/10 text-coral border border-coral/30 hover:bg-coral/20 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0">
        <TabSwitcher tabs={CASE_TABS} activeTab={activeTab} onChange={onTabChange} />
      </div>

      {/* Tab content — scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'bsa-signals'
          ? <BSASignalsTab app={app} />
          : <EWSGuardrailsTab app={app} />
        }
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root — L3 Underwriting Workbench
// ─────────────────────────────────────────────────────────────────────────────

export default function L3_Underwriting() {
  const { selectedApplicantId, openCaseDetail, activeCaseTab, switchCaseTab, showToast } = useAppContext()

  const [filter, setFilter]           = useState('all')
  const [statusOverrides, setStatusOverrides] = useState({})
  const loading = useSimulatedLoad(850)

  // Merge any user-driven status changes over the static applicant record
  const applyOverrides = (app) => {
    const o = statusOverrides[app.id]
    return o ? { ...app, ...o } : app
  }

  const allAppsEffective = APPLICANTS.map(applyOverrides)

  const displayId   = selectedApplicantId || 'APP-001'
  const selectedApp = applyOverrides(APPLICANTS.find(a => a.id === displayId) ?? APPLICANTS[0])

  const counts = {
    all:             APPLICANTS.length,
    pending:         allAppsEffective.filter(a => a.status === 'pending').length,
    approved:        allAppsEffective.filter(a => a.status === 'approved').length,
    'manual-review': allAppsEffective.filter(a => a.status === 'manual-review').length,
    declined:        allAppsEffective.filter(a => a.status === 'declined').length,
  }

  const visibleApps = allAppsEffective.filter(a => filter === 'all' || a.status === filter)

  function handleAction(action, app) {
    const override =
      action === 'approve' ? { status: 'approved',      recommendation: 'Approved'      }
      : action === 'review' ? { status: 'manual-review', recommendation: 'Manual Review' }
      :                       { status: 'declined',      recommendation: 'Reject'        }

    setStatusOverrides(prev => ({ ...prev, [app.id]: override }))

    const msg  = action === 'approve' ? `${app.name} approved. Disbursement initiated.`
               : action === 'review'  ? `${app.name} sent to senior underwriter.`
               :                        `${app.name} application declined.`
    const type = action === 'approve' ? 'success' : action === 'review' ? 'warning' : 'error'
    showToast(msg, type)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Page Header ──────────────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-white/8 shrink-0 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-text-pri">Underwriting Workbench</h1>
          <p className="text-xs text-text-sec mt-0.5">
            BSA-powered applicant review · {APPLICANTS.length} applications today
          </p>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: 'Pending',       value: counts.pending,           color: 'text-amber'   },
            { label: 'Auto-Approved', value: counts.approved,          color: 'text-emerald' },
            { label: 'Manual Review', value: counts['manual-review'],  color: 'text-text-pri' },
            { label: 'Declined',      value: counts.declined,          color: 'text-coral'   },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-right">
              <div className={`text-xl font-bold leading-none ${color}`}>{value}</div>
              <div className="text-[11px] text-text-sec mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Queue Panel ───────────────────────────────────────────── */}
        <div className="w-72 shrink-0 border-r border-white/8 flex flex-col overflow-hidden">
          {/* Filter chips */}
          <div className="px-3 py-2.5 border-b border-white/8 shrink-0 flex flex-wrap gap-1.5">
            {QUEUE_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
                  filter === f.id
                    ? 'bg-emerald/20 text-emerald border-emerald/30'
                    : 'text-text-sec border-white/10 hover:text-text-pri hover:border-white/20'
                }`}
              >
                {f.label}{' '}
                <span className="opacity-60">{counts[f.id]}</span>
              </button>
            ))}
          </div>

          {/* Applicant rows */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {loading
              ? Array.from({ length: 6 }, (_, i) => <SkeletonQueueRow key={i} />)
              : visibleApps.length > 0
                ? visibleApps.map(app => (
                    <QueueRow
                      key={app.id}
                      app={app}
                      isSelected={app.id === displayId}
                      onClick={() => openCaseDetail(app.id)}
                    />
                  ))
                : (
                    <p className="text-center text-xs text-text-sec py-8">
                      No applicants in this category.
                    </p>
                  )
            }
          </div>
        </div>

        {/* ── Case Detail ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden">
          {loading
            ? <SkeletonDetailPanel />
            : (
                <CaseDetailPanel
                  app={selectedApp}
                  activeTab={activeCaseTab}
                  onTabChange={switchCaseTab}
                  onAction={handleAction}
                />
              )
          }
        </div>
      </div>
    </div>
  )
}
