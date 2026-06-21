// Full 6-step Guided Demo config (PRD §9B)
//
// CANONICAL NAVIGATION FIELD: `route` (string path, e.g. '/lender/dashboard')
// The M6 navigateDemoStep() handler reads step.route and calls navigate(step.route).
// Do NOT add a `navigate` object field — that was a spec inconsistency in the M6 section.
// `route` is the single source of truth for which URL each demo step navigates to.
export const DEMO_STEPS = [
  {
    index: 0,
    title: 'The ₹1.125 Crore Monthly Problem',
    description:
      "Every month, 45,000 applicants abandon LendWell's loan journey at the bank-linking screen. At ₹250 per acquired user, that's ₹1.125 Cr in wasted spend — before a single rupee is lent. This dashboard shows the full funnel breakdown.",
    route: '/lender/dashboard',
    spotlightTargetId: 'funnel-chart',
    cardPosition: 'bottom-right',
    sideEffects: [],
  },
  {
    index: 1,
    title: 'Why Users Drop Off — And How We Fix It',
    description:
      "The drop-off isn't about intent — it's about fear. Users abandon because the bank redirect looks unfamiliar and risky. Our pre-consent Trust Screen addresses every specific anxiety: what data is accessed, why, for how long, and how to revoke it.",
    route: '/borrower/trust',
    spotlightTargetId: 'trust-cards',
    cardPosition: 'right',
    sideEffects: [],
  },
  {
    index: 2,
    title: 'We Recover 92% of Bank Failures',
    description:
      "When a bank FIP is down, legacy systems throw a dead-end error and the user is lost. Our Smart Retry Engine detects the failure, informs the user with clear language, and automatically retries — recovering 92% of temporary failures within 30 seconds.",
    route: '/borrower/fetch',
    spotlightTargetId: 'retry-widget',
    cardPosition: 'top',
    sideEffects: ['SET_FORCED_BANK_YES_BANK'],
  },
  {
    index: 3,
    title: 'Know Exactly Which Bank is Failing — and Why',
    description:
      "Our Observability Console gives your product team bank-wise failure attribution in real time. SBI's OTP latency causes 18,600 failures/month. Yes Bank's FIP downtime causes 23,500. Now you can prioritise fixes and configure smart retries per bank.",
    route: '/lender/observability',
    spotlightTargetId: 'bank-table',
    cardPosition: 'top-right',
    sideEffects: ['CLEAR_FORCED_BANK'],
  },
  {
    index: 4,
    title: 'Approve Thin-File Borrowers — With Confidence',
    description:
      "Ananya has no bureau score. Under the old system, she's an automatic reject. With our BSA, the underwriter sees a 78/100 cash-flow score, verified freelance income, and an audit-ready reason code: 'Single bounce — technical recovery, not default intent.' One click to approve.",
    route: '/lender/underwriting',
    spotlightTargetId: 'bsa-gauge',
    cardPosition: 'left',
    sideEffects: ['OPEN_CASE_APP001', 'SWITCH_TAB_BSA'],
  },
  {
    index: 5,
    title: 'Quantify the Upside — Live',
    description:
      "This isn't just a UX improvement — it's a measurable revenue opportunity. Drag the consent slider from 55% to 75% and watch the annual revenue lift recalculate in real time. Click 'Q2 Target' to see the full combined impact of consent improvement and thin-file approval uplift.",
    route: '/lender/dashboard',
    spotlightTargetId: 'revenue-calculator',
    cardPosition: 'top-left',
    sideEffects: ['SCROLL_TO_CALCULATOR'],
  },
]

export const DEMO_STEP_COUNT = DEMO_STEPS.length
