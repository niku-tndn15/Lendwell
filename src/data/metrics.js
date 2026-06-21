// Dataset 3 — Funnel KPIs + 6-month trend data (PRD §11)
export const METRICS = {
  baseline: {
    monthlyApplicants: 100000,
    consentRate: 0.55,
    fetchSuccessRate: 0.85,
    approvalRate: 0.30,
    disbursalConversionRate: 0.90,
    avgLoanValue: 80000,
    platformFeePct: 0.005,
    cacPerApplicant: 250,
    fpd30DayRate: 0.018,
    manualReviewRate: 0.45,
    ttdSeconds: 28,
  },
  trendData: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    consentRateBaseline:    [55, 54, 55, 56, 55, 55],
    consentRateOptimized:   [55, 55, 60, 63, 66, 68],
    approvalRateBaseline:   [30, 29, 30, 31, 30, 30],
    approvalRateOptimized:  [30, 30, 31, 33, 34, 35],
    delinquencyBaseline:    [1.8, 1.9, 1.8, 2.0, 1.9, 1.8],
    delinquencyOptimized:   [1.8, 1.9, 1.8, 1.9, 1.8, 1.7],
  },
}

// Derived funnel stages (used by L1 FunnelChart)
export const FUNNEL_STAGES = [
  { label: 'Applicants Arrived',    volume: 100000, conversion: null,   leak: false },
  { label: 'Consent Approved',       volume: 55000,  conversion: 55,    leak: true  },
  { label: 'Statement Fetched',      volume: 46750,  conversion: 85,    leak: false },
  { label: 'Underwriting Assessed',  volume: 14025,  conversion: 30,    leak: false },
  { label: 'Disbursed',              volume: 12600,  conversion: 90,    leak: false },
]

// Revenue formula (pure JS — no backend)
export const calcRevenue = (consentRate, approvalRate) => {
  const MONTHLY_APPLICANTS = 100000
  const FETCH_RATE = 0.85
  const AVG_LOAN_VALUE = 80000
  const PLATFORM_FEE_PCT = 0.005

  const approvedLoans = MONTHLY_APPLICANTS * consentRate * FETCH_RATE * approvalRate
  const monthlyRevenue = approvedLoans * AVG_LOAN_VALUE * PLATFORM_FEE_PCT
  const annualRevenue = monthlyRevenue * 12
  return { approvedLoans: Math.round(approvedLoans), monthlyRevenue, annualRevenue }
}

// Format a raw rupee value as "₹X.XX Cr"
export const formatCr = (value) => {
  return '₹' + (value / 10000000).toFixed(2) + ' Cr'
}
