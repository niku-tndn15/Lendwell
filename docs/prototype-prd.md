# Prototype Product Requirements Document (PRD) v2.1
## Lending Intelligence Platform — Clickable Frontend-Only Prototype

> **Document Status**: Revised & Tightened | Version 2.1
> **Prototype Type**: Single-page application (SPA) — Frontend only, no backend, no database, no API calls
> **Recommended Build Stack**: Vanilla HTML5 + CSS3 + JavaScript (ES6 modules) OR React (Vite). All data hardcoded as JS constants.
> **Primary Audience**: Prototype builder (developer), LendWell stakeholders (demo recipients)
> **Changelog v2.1**: Added explicit Global Navigation Structure (§9), Guided Demo Mode (§9B), active EWS alert borrower in Dataset 4, updated EWS tab spec in L3, updated Section 15 scope.

---

## 1. Product Vision

Build a high-fidelity, fully clickable B2B2C frontend prototype that demonstrates how our **Lending Intelligence Platform** — powered by the Bank Statement Analyser (BSA) and Early Warning System (EWS) — can simultaneously:

1. **Reduce the borrower consent drop-off** from 45% to under 30% via trust-building UX and smart retry handling.
2. **Unlock thin-file/NTC approvals** by equipping underwriters with explainable, audit-ready risk signals instead of black-box rejections.

This prototype is a **demo tool**, not a production system. Its sole purpose is to communicate the product's business value, user journey, and interaction model to LendWell's leadership team to secure contract renewal.

---

## 2. Problem Statement

LendWell (NBFC client) faces a dual funnel crisis in its unsecured personal loan product:

| # | Problem | Impact |
|---|---------|--------|
| 1 | **Consent Drop-off**: 45,000 of 100,000 monthly applicants abandon at the AA consent screen (55% consent rate) | ₹1.125 Cr/month wasted acquisition spend (@ ₹250 CAC) |
| 2 | **Underwriting Rejections**: Of 46,750 fetched statements, only 14,025 are approved (30% approval rate); thin-file/NTC users are rejected wholesale due to lack of explainable BSA signals | Healthy, creditworthy gig-workers are declined; disbursal volume is suppressed |

Our TSP contract renewal depends on proving we can resolve both problems in Q1.

---

## 3. Business Goals

| Priority | Goal | Metric |
|----------|------|--------|
| P0 | Secure TSP contract renewal | Demo approval from LendWell CRO |
| P1 | Lift thin-file approval rate | 30% → 33–35% (Q1), 38% (Q2) |
| P2 | Improve consent conversion | 55% → 65–70% (Q2) |
| P3 | Improve FIP fetch success | 85% → 90% (Q2) |
| P4 | Recover wasted CAC spend | ₹1.125 Cr leak → ₹0.50 Cr (Q2) |

---

## 4. Success Metrics (Displayed in B2B Dashboard)

The prototype dashboard will visually display all of the following metrics as mock data:

| Metric | Type | Baseline | Q1 Target | Q2 Target | Where Shown |
|--------|------|----------|-----------|-----------|-------------|
| Risk-Adjusted Approval Rate | North Star | 30% | 33–35% | 38% | Screen L1, L3 |
| Consent Approval Rate | FIP Funnel | 55% | — | 65–70% | Screen L1, L2 |
| Data-Fetch Success Rate | FIP Funnel | 85% | — | 90% | Screen L2 |
| 30-day Delinquency Rate (FPD) | Risk Guardrail | 1.8% | ≤ 2% (hold) | ≤ 2% | Screen L1 |
| Time-to-Decision (TTD) | Ops Guardrail | 28s | ≤ 30s | ≤ 30s | Screen L3 |
| Manual Review Rate | Trust Metric | 45% | 30–35% | 25–30% | Screen L3 |
| Recovered Fetch Rate (Smart Retry) | Ops Metric | — | — | 92% | Screen L2, B4 |

---

## 5. User Personas

### Persona A — Ananya Sen (End Borrower)
- **Age / Role**: 26, Freelance Content Writer / Gig-Worker
- **Loan Ask**: ₹80,000 unsecured personal loan (12-month tenure)
- **Context**: Wants to upgrade her workstation; applies via LendWell mobile app
- **Pain Points**:
  - No credit card, no bureau history (CIBIL: -1 / NTC)
  - Abandoned a previous application because the bank-linking redirect felt like a phishing page
  - Experienced OTP timeout during a past AA flow and quit the app
  - Intimidated by jargon (e.g., "FIP", "Account Aggregator", "Consent Artefact")
- **Goal in Prototype**: Successfully complete the consent flow and be approved based on her 6-month freelance cash-flow pattern

### Persona B — Vikram Mehta (Chief Risk Officer, LendWell)
- **Age / Role**: 42, CRO responsible for portfolio default rate < 2.5%
- **Pain Points**:
  - Skeptical of black-box ML models; needs explainable reason codes to justify audit trail
  - Current BSA outputs don't explain *why* a thin-file user is low-risk
  - Under internal board pressure to increase disbursal volume without increasing NPAs
- **Goal in Prototype**: Review dashboard revenue impact, understand explainable BSA signals, approve thin-file applicants with confidence

### Persona C — Rohan Dev (Product Manager, LendWell)
- **Age / Role**: 31, PM responsible for funnel metrics and API performance
- **Pain Points**:
  - Cannot distinguish user-driven abandonment from FIP bank-side downtime in current analytics
  - No bank-wise latency visibility; cannot prioritize which FIP integration to fix
  - Wants smart retry success rates to justify the investment
- **Goal in Prototype**: Use the Observability Console to attribute drop-offs and verify retry ROI

---

## 6. User Journey Mapping

### End-to-End Flow Diagram
```
[B1] Loan Home
     │ Click "Apply Now"
     ▼
[B2] Pre-Consent Trust Screen
     │ Click "Agree & Link Bank"
     ▼
[B3] AA Consent & Bank Discovery
     │
     ├─ Select HDFC Bank (Online) ──────────────────────────────────────────────┐
     │     └─ OTP Entry → Consent Approved → [B4] Fetch Processing              │
     │                                             │                             │
     │                                     ┌───────┴──────────┐                 │
     │                                     │ Success           │ Downtime         │
     │                                     ▼                   ▼                 │
     │                              [B5] Success        Smart Retry Screen        │
     │                                   Screen         (15s countdown)           │
     │                                     │              │ Retry Success          │
     │                                     └──────────────┘                      │
     │                                     [BSA Analysis runs in background]      │
     │                                     Underwriter reviews in L3 ◄───────────┘
     │
     └─ Select Yes Bank (Downtime) → [B4] Error / Smart Retry immediately shown

[L1] Executive Dashboard  ←  Landing page of B2B Portal
     │ Sidebar Navigation
     ├── [L2] FIP & Consent Observability Console
     └── [L3] Underwriting Queue
               │ Click any applicant row
               └── [L3-Modal] BSA Case Detail Deep-Dive
                         └── [L3-EWS] EWS Guardrail Panel (tab within modal)
```

### Journey Phase Summary

| Phase | Screen | Persona | Key Interaction |
|-------|--------|---------|----------------|
| Entry | B1 | Ananya | Set loan amount & tenure, click CTA |
| Trust Building | B2 | Ananya | Read data minimization cards, accept |
| Consent | B3 | Ananya | Discover bank, enter OTP, approve |
| Fetch & Retry | B4 | Ananya | Witness downtime → smart retry → success |
| Success | B5 | Ananya | Confirmation, EWS notice, next steps |
| Exec View | L1 | Vikram | Review funnel, manipulate ROI sliders |
| Observability | L2 | Rohan | Analyze bank-wise failures, retry stats |
| Underwriting | L3 | Vikram | Review queue, click case, read BSA signals |
| Case Detail | L3-Modal | Vikram | See score, reason codes, take action |

---

## 7. Core Product Modules

### Module 1 — Borrower Consent & Handoff Simulator
Simulates the borrower-side mobile app experience (rendered in a phone frame on the left half of the demo screen).

**Features demonstrated:**
- Pre-consent education card with RBI-compliant trust language
- Seamless handoff animation from LendWell → AA environment
- Bank health status indicators before user selects
- Simulated OTP flow (no real SMS; 4-digit entry with mock validation)
- Smart Retry UX (countdown, recovery nudge, telemetry notification)
- Success confirmation with EWS activation notice

### Module 2 — BSA Explainability & Underwriter Portal
Simulates the B2B credit team's workspace for reviewing individual loan applications.

**Features demonstrated:**
- Application queue with live filter tabs
- BSA Cash-Flow Stability Score gauge (0–100)
- Income pattern, surplus, and bounce classification
- Positive & negative reason codes in plain English
- EWS monitoring setup status per applicant
- One-click actions: Approve / Decline / Flag for Manual Review

### Module 3 — Executive Analytics & Observability Dashboard
Simulates the C-suite and operations control panel.

**Features demonstrated:**
- Interactive conversion funnel (with drop-off leak highlighting)
- ROI Revenue Lift Calculator (slider-driven, formula-backed)
- Bank-wise FIP health table (sortable, filterable)
- Failure taxonomy heatmap
- Smart Retry recovery tracker

---

## 8. Screen Inventory

**Total Screens: 8** (4 borrower + 4 lender, including modals)

### A. Borrower Mobile Simulator (Phone Frame)

| ID | Screen Name | Purpose |
|----|-------------|---------|
| B1 | Loan Application Home | Entry; set amount & tenure |
| B2 | Pre-Consent Trust Screen | Build trust before AA redirect |
| B3 | AA Consent & Bank Discovery | Select bank, enter OTP, approve |
| B4 | Fetch Status & Smart Retry | Handle success and downtime/retry states |
| B5 | Application Success Screen | Confirm completion, EWS activation |

### B. B2B Lender Portal (Desktop Full-Width)

| ID | Screen Name | Purpose |
|----|-------------|---------|
| L1 | Executive Performance & Funnel Dashboard | Funnel health, KPIs, ROI calculator |
| L2 | FIP & Consent Observability Console | Bank-wise telemetry, failure attribution |
| L3 | Underwriting Queue + BSA Case Detail Modal | Application review, explainability, action |

> **Note**: L3 includes two internal tabs within the case detail modal: (1) BSA Signals tab and (2) EWS Guardrails tab. These are not separate screens but interactive tabs within the same panel.

---

## 9. Navigation Structure

### 9.1 Global Header Bar (Always Visible)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🏦 LendWell Intelligence Platform                    [▶ Start Guided Demo]  │
│  ─────────────────────────────────────────────────────────────────────────   │
│  [ 📱 Borrower App View ]        [ 🖥 Lender Portal View ]                   │
│  (active tab underlined with primary accent colour)                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Header Behaviour Rules:**
- The header is **always visible** regardless of mode or active screen.
- **Mode Toggle** (Borrower App View / Lender Portal View) is a segmented pill control; clicking switches the entire main viewport instantly.
- **[▶ Start Guided Demo]** is a CTA button anchored to the top-right of the header (see Section 9B for full spec).
- The LendWell logo is non-interactive in the prototype.

---

### 9.2 Borrower Mode — Screen Navigation

**Rendered as**: A centred smartphone frame (375 × 812px) on a neutral dark background.

**Screen List (Sequential — forward-only flow):**

| Step | Screen ID | Screen Name | Nav Label | Trigger to Advance |
|------|-----------|-------------|-----------|---------------------|
| 1 | B1 | Loan Application Home | Loan Application | Click "Link Bank via Account Aggregator" |
| 2 | B2 | Pre-Consent Trust Screen | Trust & Consent | Click "Agree & Link Bank" |
| 3 | B3 | AA Consent & Bank Discovery | Bank Linking | OTP entered + "Approve Data Share" clicked |
| 4 | B4 | Fetch Status & Smart Retry | Fetch Progress | Auto-advance (Success) or "Try Again Now" (Retry) |
| 5 | B5 | Application Success Screen | Success | Terminal screen — no further advance |

**Navigation UI within the phone frame:**
- A **5-dot step progress indicator** sits at the top of the phone content area (not the status bar). Active dot = filled, future dots = hollow.
- Step labels (e.g., "Trust & Consent") appear as small text below each dot on hover only — not always visible, to avoid clutter.
- **No back navigation** is exposed to the user within the Borrower flow (prevents demo confusion).
- A **"Reset Demo"** button sits *below* the phone frame (outside the frame border), always visible in Borrower Mode. Clicking it resets to B1 instantly.

**B4 State Branching (state-driven, not a separate screen):**
```
B3 → OTP Approved
       ├── HDFC / ICICI / Axis / BOB selected  →  B4 State A (Success flow)
       ├── SBI selected                         →  B4 State C (Slow Fetch)  →  B5
       └── Yes Bank selected                    →  B4 State B (Smart Retry) →  B5
```

---

### 9.3 Lender Mode — Screen Navigation

**Rendered as**: Full-width desktop layout. Left sidebar (240px fixed) + fluid main content area.

**Sidebar Navigation Items:**

| Icon | Label | Screen ID | Screen Name |
|------|-------|-----------|-------------|
| 📊 | Executive Dashboard | L1 | Executive Performance & Funnel Dashboard |
| 📡 | Observability Console | L2 | FIP & Consent Observability Console |
| 📂 | Underwriting Workbench | L3 | Underwriting Queue & BSA Case Detail |

**Sidebar Behaviour Rules:**
- Active sidebar item has a left-border accent (emerald green) and a highlighted background.
- Sidebar is always visible; it does **not** collapse in the prototype.
- Clicking a sidebar item instantly shows the corresponding screen (CSS `display` toggle — no page reload).
- Default landing screen when switching to Lender Mode: **L1 (Executive Dashboard)**.

**L3 Internal Navigation:**
```
L3 Main Panel (Underwriting Workbench / Queue)
   └── Click any applicant row
         └── Case Detail Side Panel slides in from the right
               ├── Tab 1: [BSA Signals]      ← default active tab
               └── Tab 2: [EWS Guardrails]
```
- Clicking a different applicant row updates the Case Detail panel content without closing it.
- A **close [×] button** in the top-right of the Case Detail panel collapses it back to full-width queue view.

---

### 9.4 Mode Switch Behaviour

| Action | Result |
|--------|--------|
| Switch from Borrower → Lender | Lender sidebar appears; defaults to L1. Borrower phone frame is hidden. |
| Switch from Lender → Borrower | Phone frame is restored at **the last active Borrower screen** (not reset to B1). |
| Click "Reset Demo" | Borrower flow resets to B1. Only available in Borrower Mode (below the phone frame). |
| Guided Demo active | Both modes are accessible; the demo overlay navigates automatically (see Section 9B). |

---

## 9B. Guided Demo Mode

### Overview

A **Guided Demo Mode** is a self-running, step-by-step walkthrough overlay that can be activated from anywhere in the prototype by clicking **"▶ Start Guided Demo"** in the global header. It is designed for live pitch presentations and unguided stakeholder self-exploration.

**Mechanism (Frontend-Only, No Backend):**
- The Guided Demo is implemented as a floating **tooltip/spotlight overlay** rendered above the main prototype UI.
- It does **not** require a separate screen — it overlays the existing screens.
- Advancing through demo steps navigates the prototype to the correct screen automatically (JS-driven `display` switching).
- The overlay consists of:
  - A **dark semi-transparent backdrop** (`rgba(0,0,0,0.6)`) with a spotlight cutout on the highlighted element.
  - A **floating card** (320px wide) anchored near the highlighted element, containing: Step counter, Title, Description, and two buttons: `[← Back]` `[Next →]`.
  - A **step progress bar** at the top of the card (e.g., "Step 2 of 6").
  - An **[✕ Exit Demo]** text link at the bottom of the card.
- Clicking **Next** advances to the next step; clicking **Back** goes to the previous step.
- Clicking **[✕ Exit Demo]** dismisses the overlay and leaves the user on the current screen in normal interactive mode.
- The demo **does not auto-advance** — the presenter or viewer clicks Next manually.

---

### Guided Demo Steps

#### Step 1 — Consent Funnel Problem

| Field | Value |
|-------|-------|
| **Step** | 1 of 6 |
| **Title** | "The ₹1.125 Crore Monthly Problem" |
| **Description** | "Every month, 45,000 applicants abandon LendWell's loan journey at the bank-linking screen. At ₹250 per acquired user, that's ₹1.125 Cr in wasted spend — before a single rupee is lent. This dashboard shows the full funnel breakdown." |
| **Screen Navigated To** | L1 — Executive Dashboard |
| **Element Highlighted** | The interactive conversion funnel chart (specifically the Consent Approved stage with the red outflow arrow) |
| **Expected User Action** | Presenter clicks "Next →" after pointing to the consent drop-off leak |

---

#### Step 2 — Trust & Consent Experience

| Field | Value |
|-------|-------|
| **Step** | 2 of 6 |
| **Title** | "Why Users Drop Off — And How We Fix It" |
| **Description** | "The drop-off isn't about intent — it's about fear. Users abandon because the bank redirect looks unfamiliar and risky. Our pre-consent Trust Screen addresses every specific anxiety: what data is accessed, why, for how long, and how to revoke it." |
| **Screen Navigated To** | B2 — Pre-Consent Trust Screen (Borrower Mode) |
| **Element Highlighted** | The 4 Data Minimization Info Cards |
| **Expected User Action** | Presenter walks through the 4 cards, then clicks "Next →" |

---

#### Step 3 — Smart Retry Recovery

| Field | Value |
|-------|-------|
| **Step** | 3 of 6 |
| **Title** | "We Recover 92% of Bank Failures" |
| **Description** | "When a bank FIP is down, legacy systems throw a dead-end error and the user is lost. Our Smart Retry Engine detects the failure, informs the user with clear language, and automatically retries — recovering 92% of temporary failures within 30 seconds." |
| **Screen Navigated To** | B4 — Fetch Progress (State B — Downtime/Smart Retry rendered) |
| **Element Highlighted** | The Smart Retry Widget (countdown timer + recovery nudge card) |
| **Expected User Action** | Presenter clicks "Try Again Now" to demonstrate recovery, then clicks "Next →" |

> **Implementation Note**: When the demo reaches Step 3, set JS flag `window.demoForcedBank = 'YES_BANK'` so B4 renders in Downtime/Retry state (State B) automatically. This flag is cleared when the demo exits.

---

#### Step 4 — Bank Observability

| Field | Value |
|-------|-------|
| **Step** | 4 of 6 |
| **Title** | "Know Exactly Which Bank is Failing — and Why" |
| **Description** | "Our Observability Console gives your product team bank-wise failure attribution in real time. SBI's OTP latency causes 18,600 failures/month. Yes Bank's FIP downtime causes 23,500. Now you can prioritise fixes and configure smart retries per bank." |
| **Screen Navigated To** | L2 — Observability Console |
| **Element Highlighted** | The Bank-wise Performance Table (Yes Bank and SBI rows highlighted in red) |
| **Expected User Action** | Presenter sorts the table by "Monthly Failures" descending, then clicks "Next →" |

---

#### Step 5 — Explainable Underwriting

| Field | Value |
|-------|-------|
| **Step** | 5 of 6 |
| **Title** | "Approve Thin-File Borrowers — With Confidence" |
| **Description** | "Ananya has no bureau score. Under the old system, she's an automatic reject. With our BSA, the underwriter sees a 78/100 cash-flow score, verified freelance income, and an audit-ready reason code: 'Single bounce — technical recovery, not default intent.' One click to approve." |
| **Screen Navigated To** | L3 — Underwriting Workbench (with Ananya Sen's case detail panel open, BSA Signals tab active) |
| **Element Highlighted** | The BSA Score Gauge (78/100) and Positive Reason Codes block |
| **Expected User Action** | Presenter clicks "Approve with EWS" action button, toast confirms approval, then clicks "Next →" |

> **Implementation Note**: When the demo navigates to Step 5, call `openCaseDetail('APP-001')` and `switchCaseTab('bsa-signals')` as part of the step navigation function to auto-open the correct case detail.

---

#### Step 6 — Revenue Impact

| Field | Value |
|-------|-------|
| **Step** | 6 of 6 |
| **Title** | "Quantify the Upside — Live" |
| **Description** | "This isn't just a UX improvement — it's a measurable revenue opportunity. Drag the consent slider from 55% to 75% and watch the annual revenue lift recalculate in real time. Click 'Q2 Target' to see the full combined impact of consent improvement and thin-file approval uplift." |
| **Screen Navigated To** | L1 — Executive Dashboard (Revenue Lift Calculator section scrolled into view) |
| **Element Highlighted** | The Revenue Lift Calculator widget (both sliders + the "Revenue Lift" output display) |
| **Expected User Action** | Presenter drags Consent slider to 75%, optionally clicks "Q2 Target" preset, then clicks "✕ Exit Demo" |

---

### Guided Demo — Implementation Notes (Frontend Only)

| Concern | Approach |
|---------|----------|
| Screen navigation on step advance | JS function `navigateDemoStep(stepIndex)` reads a `DEMO_STEPS` config array and calls the same routing functions used by manual navigation |
| Spotlight highlight | CSS `box-shadow: 0 0 0 9999px rgba(0,0,0,0.6)` applied to the target element; `position: relative; z-index: 1001` ensures it appears above the backdrop |
| Forced bank state for Step 3 | Set `window.demoForcedBank = 'YES_BANK'` before navigating to B4; B4 state logic checks this flag and renders State B |
| Case detail auto-open for Step 5 | Call `openCaseDetail('APP-001')` and `switchCaseTab('bsa-signals')` as part of the Step 5 navigation function |
| Demo state persistence | Demo step index stored in a JS variable only (no localStorage); resets on page reload |
| Exit demo | Clears overlay, removes spotlight CSS, resets `demoForcedBank` — user remains on the current screen in full interactive mode |
| Back navigation in demo | Clicking `[← Back]` calls `navigateDemoStep(currentStep - 1)` and re-applies the previous step's screen and highlight |



---

## 10. Detailed Screen Specifications

---

### B1 — Loan Application Home

**Objective**: Serve as the familiar, friendly entry point of a loan application.

**Layout**: Full mobile viewport (375 × 812px simulation). Light background with LendWell branding at top.

**Elements & Interactions**:

| Element | Type | Default | Behavior |
|---------|------|---------|----------|
| LendWell Logo + Tagline | Static Image + Text | "Quick Loans, Smart Decisions" | Non-interactive |
| Loan Amount Slider | Range Input | ₹80,000 | Slides from ₹10,000 to ₹5,00,000 in ₹5,000 steps; updates EMI card instantly |
| Tenure Selector | Pill toggle (6 / 12 / 18 / 24 mo) | 12 months | Click to select; updates EMI card |
| EMI Estimate Card | Computed display | ₹7,400/mo | Formula: `EMI = (P × r × (1+r)^n) / ((1+r)^n - 1)` where r = 1.5%/month (18% p.a.) |
| Interest Rate Badge | Static label | 18% p.a. (Flat) | Non-interactive |
| "Link Bank via Account Aggregator" CTA | Button (Primary, pulsing gradient) | — | Navigate to B2 |

**Empty / Error States**: None required (all inputs have safe defaults).

---

### B2 — Pre-Consent Trust Screen

**Objective**: Eliminate fear of the AA redirect by transparently communicating data scope, purpose, and revocation rights before the handoff.

**Layout**: Modal-style card slides up from bottom of phone frame. Partially obscures B1. Has a visible close "×" that returns to B1.

**Elements & Interactions**:

| Element | Type | Content |
|---------|------|---------|
| Header | Text | "Your Data is Safe & Under Your Control" |
| Trust Badge | Icon + Label | 🛡️ RBI Regulated Account Aggregator Framework |
| Info Card 1 | Icon + 2-line label | 📋 **What we access**: Last 6 months bank transactions only |
| Info Card 2 | Icon + 2-line label | 🔒 **Why**: To verify income for your ₹80,000 loan — nothing else |
| Info Card 3 | Icon + 2-line label | ⏳ **How long**: One-time read. No recurring access. |
| Info Card 4 | Icon + 2-line label | ❌ **Revoke anytime**: Cancel from your AA app at any time |
| "Agree & Link Bank" CTA | Button (Primary) | → Navigate to B3 |
| "Cancel" link | Text link | → Navigate back to B1 |

**Micro-interactions**:
- Cards animate in sequentially (150ms stagger) as the modal slides up.
- Trust badge has a subtle green glow pulse.

---

### B3 — AA Consent & Bank Discovery

**Objective**: Simulate the Account Aggregator environment. Show bank health status and OTP flow. This screen demonstrates why downtime transparency reduces abandonment.

**Layout**: Full phone viewport styled to look like a neutral AA portal (not LendWell branded — indicates redirect). Header shows "Secured by Sahamati AA Framework".

**Elements & Interactions**:

| Element | Type | Behavior |
|---------|------|----------|
| Pre-filled Mobile Number | Read-only text | "+91 98XXX XXXXX" — masked for privacy |
| Bank Search Bar | Text input | Filters the bank grid below (client-side filter on mock array) |
| Bank Grid (6 banks) | Clickable card grid | See bank list below; click selects bank |
| Selected Bank Status Badge | Dynamic label | Changes based on bank mock status (Online / Latency / Downtime) |
| OTP Entry Modal | 4-digit mock input | Appears after bank selection; "1234" is always the correct mock OTP |
| OTP Timer | Countdown display | Shows "OTP valid for 60 seconds" — counts down visually; "Resend OTP" appears at 0 |
| "Approve Data Share" CTA | Button (Primary) | Enabled only after OTP entry → Navigate to B4 (Success state) |
| "Cancel Handoff" | Text link | → Navigate to B1 (resets flow) |

**Bank Mock Data (rendered in the grid)**:

| Bank Name | Logo Placeholder | Status | Status Color |
|-----------|-----------------|--------|-------------|
| HDFC Bank | HDFC | 🟢 Online | Green badge |
| ICICI Bank | ICICI | 🟢 Online | Green badge |
| SBI | SBI | 🟡 Slow | Yellow badge |
| Axis Bank | AXIS | 🟢 Online | Green badge |
| Yes Bank | YES | 🔴 Down | Red badge |
| Bank of Baroda | BOB | 🟢 Online | Green badge |

**Selection Logic (Frontend State)**:
- Selecting **HDFC, ICICI, Axis, BOB** → B4 shows **Success flow** after OTP
- Selecting **SBI** → B4 shows **Slow fetch warning** (12s animated progress bar) then Success
- Selecting **Yes Bank** → B4 shows **Downtime / Smart Retry** state immediately

---

### B4 — Fetch Status & Smart Retry

**Objective**: Demonstrate that the platform gracefully handles bank failures without losing the user. This is the core "smart retry" pitch moment.

**Layout**: Full phone viewport. Centered progress panel with animated steps.

**State A — Processing (Default after HDFC/ICICI/Axis/BOB selection)**:

| Element | Content |
|---------|---------|
| Step 1 | ✅ Consent Approved |
| Step 2 | ⏳ Connecting to HDFC Bank… (animated spinner) |
| Step 3 | 🔒 Securely Fetching Last 6 Months |
| Step 4 | 🧠 Analysing Your Cash-Flow Profile |

- Steps unlock progressively every 1.5 seconds (mock animation).
- After all 4 steps: auto-navigate to **B5** after 0.5s pause.

**State B — Downtime / Smart Retry (after Yes Bank selection)**:

| Element | Content |
|---------|---------|
| Error Icon | 🔴 Connection Failed |
| Error Message | "Yes Bank servers are temporarily unavailable." |
| Explanation Card | "This is a temporary bank-side issue. Your data and application are safe." |
| Retry Countdown | "Retrying automatically in **15s**…" (live countdown) |
| Success Stat Nudge | "We recover **92%** of temporary failures within 30 seconds. Please stay on this page." |
| Manual Retry Button | "Try Again Now" — resets the 15s timer and replays Step A animation → B5 |
| Cancel Button (small) | "Cancel Application" → B1 |

**State C — Slow Fetch (after SBI selection)**:
- Same as State A but Step 2 takes 6 seconds instead of 1.5s, with a warning banner: "SBI is experiencing high traffic. Fetch may take up to 30 seconds."
- After Step 2 completes, proceeds normally to B5.

---

### B5 — Application Success Screen

**Objective**: Confirm successful bank linking, reassure the borrower, and communicate next steps (credit decision timeline).

**Layout**: Full phone viewport. Celebration micro-animation (confetti or checkmark pulse). Light background.

**Elements**:

| Element | Content |
|---------|---------|
| Success Icon | Large animated ✅ (green, pulsing ring) |
| Headline | "Bank Linked Successfully!" |
| Sub-copy | "Your 6-month statement has been securely shared. Our team is analysing your application." |
| Timeline Card | "Decision expected in: **Typically within 2 minutes**" |
| EWS Notice Card | 🛡️ "Once approved, your account will be enrolled in our borrower protection programme. You'll receive alerts if we detect any repayment risk." |
| Loan Summary Card | Loan: ₹80,000 | Tenure: 12 months | EMI: ₹7,400/mo |
| "Go to Dashboard" CTA | Non-functional in prototype — shows a toast: "This would navigate to your loan dashboard in the live app." |

---

### L1 — Executive Performance & Funnel Dashboard

**Objective**: Give Vikram Mehta a single-screen view of funnel health, revenue impact of our intervention, and portfolio safety metrics.

**Layout**: Full desktop. Left sidebar (240px) + main content (fluid). Dark theme.

**Top KPI Strip (4 cards across)**:

| KPI Card | Value | Trend | Color |
|----------|-------|-------|-------|
| Monthly Applicants | 1,00,000 | — | Neutral |
| Consent Rate | 55% | ▼ -5% MoM (Baseline) | Red |
| Approval Rate | 30% | ▼ Thin-File Segment | Red |
| Monthly Disbursals | ₹12.6 Cr | — | Neutral |

**Section 1 — Interactive Conversion Funnel (Centre)**:

- Horizontal funnel chart with 5 stages:

| Stage | Volume | Conversion |
|-------|--------|-----------|
| Applicants Arrived | 1,00,000 | — |
| Consent Approved | 55,000 | 55% ← **🔴 Leak Alert** |
| Statement Fetched | 46,750 | 85% |
| Underwriting Assessed | 14,025 | 30% |
| Disbursed | 12,600 | 90% |

- A **red dashed outflow arrow** on the Consent stage labelled: "₹1.125 Cr wasted CAC — 45,000 lost users/month"
- Hovering each funnel stage shows a tooltip with full numbers.

**Section 2 — Revenue Lift Calculator (Right Panel)**:

*Formula (hardcoded logic, no backend):*
```
monthly_applicants = 1,00,000
avg_loan_value = ₹80,000
avg_yield_per_loan = 18% p.a. → ₹14,400 per loan
platform_fee_pct = 0.5% of disbursed loan value

approved_loans = monthly_applicants × consent_rate × fetch_rate × approval_rate
monthly_revenue = approved_loans × avg_loan_value × platform_fee_pct
annual_revenue = monthly_revenue × 12

lift = annual_revenue(new_settings) - annual_revenue(baseline)
```

*Sliders:*
| Slider | Label | Default | Range |
|--------|-------|---------|-------|
| Slider 1 | Consent Rate | 55% | 50% – 90% |
| Slider 2 | Approval Rate | 30% | 25% – 50% |

*Output Display:*
- "Baseline Annual Revenue: **₹X Cr**"
- "Projected Annual Revenue: **₹Y Cr**" (updates live)
- "**Revenue Lift: +₹Z Cr/year**" (highlighted in emerald green)

*Preset Scenario Buttons:*
- "Q1 Target" → sets Consent: 65%, Approval: 33%
- "Q2 Target" → sets Consent: 70%, Approval: 38%
- "Reset Baseline" → sets back to defaults

**Section 3 — Performance Trend Chart (Bottom)**:
- Line chart (mock static SVG or Chart.js): 6-month trend lines for Consent Rate, Approval Rate, Delinquency Rate
- Toggle buttons: "Baseline" / "With LendWell Intelligence"
- "With LendWell Intelligence" line shows uplift from Month 3 onward (simulated with mock data arrays)

---

### L2 — FIP & Consent Observability Console

**Objective**: Give Rohan Dev the bank-wise telemetry he needs to attribute failures and justify smart retry investment.

**Layout**: Full desktop, dark theme. Two-column grid layout.

**Section 1 — Failure Taxonomy Heatmap (Top, full width)**:
A 5-column colour-coded grid showing failure distribution. Darker cell = higher volume.

| Failure Type | HDFC | ICICI | SBI | Axis | Yes Bank |
|---|---|---|---|---|---|
| User Abandoned | 12% | 14% | 22% | 11% | 18% |
| Consent Denied | 3% | 4% | 5% | 3% | 7% |
| FIP Unavailable | 2% | 3% | 8% | 4% | **38%** |
| Account Discovery Failed | 1% | 2% | 3% | **6%** | 5% |
| OTP Timeout | 1% | 2% | **18%** | 1% | 9% |

- Cells with values > 15% are coloured red-orange.
- Clicking a cell shows a tooltip: "This failure type caused X drop-offs this month."

**Section 2 — Bank-wise Performance Table (Left column, sortable)**:

| Bank | Consent Success | Fetch Latency | Monthly Failures | Status | Primary Issue |
|------|----------------|---------------|-----------------|--------|---------------|
| HDFC Bank | 91% | 2.1s | 4,200 | 🟢 Online | None |
| ICICI Bank | 88% | 3.4s | 5,800 | 🟢 Online | Technical Timeout |
| SBI | 62% | 8.9s | **18,600** | 🟡 Latency | OTP Delay |
| Axis Bank | 84% | 4.1s | 6,300 | 🟢 Online | Discovery Fail |
| Yes Bank | 41% | 15.2s | **23,500** | 🔴 Down | FIP Auth Failure |
| Bank of Baroda | 79% | 5.0s | 8,200 | 🟢 Online | Minor Timeout |

- **Sortable** by any column (client-side JS sort on mock array).
- Rows with success rate < 75% have a red left border.
- Clicking a bank row expands a details sub-row showing: hourly failure trend (sparkline), last incident time, recommended action.

**Section 3 — Smart Retry Recovery Widget (Right column)**:

| Stat | Value |
|------|-------|
| Total Failed Fetches This Month | 66,600 |
| Retried by Smart Retry Engine | 28,450 |
| Successfully Recovered | **26,170** |
| Net Recovery Rate | **92%** |
| Estimated Revenue Saved (recovered × ₹400 CAC avoided) | **₹1.05 Cr** |

- Displayed as a bold stat card with a large circular progress ring showing 92%.
- Below: Mini table of "Top 3 Recovery Events" (mock): "SBI OTP retry — 4,200 recovered", "Yes Bank re-auth — 3,100 recovered", "ICICI timeout retry — 2,800 recovered"

---

### L3 — Underwriting Queue & BSA Case Detail

**Objective**: Show credit officers the full BSA explainability panel for each applicant, enabling confident thin-file approvals.

**Layout**: Full desktop, dark theme. LEFT panel (50%): Application queue with filter tabs. RIGHT panel (50%): Selected applicant's BSA case detail (slides in).

**Queue Panel (Left)**:

Filter Tabs: `All (8)` | `Auto-Approve (2)` | `Approved (1)` | `Manual Review (3)` | `Declined (1)` | `Thin-File (4)`

Columns: `Applicant` | `Type` | `CIBIL` | `BSA Score` | `Recommendation` | `TTD` | `Action`

**Full Mock Applicant Dataset (8 records)**:

| ID | Name | Type | CIBIL | BSA Score | Recommendation | TTD |
|----|------|------|-------|-----------|----------------|-----|
| APP-001 | Ananya Sen | Gig-Worker / Thin-File | -1 | 78/100 | Approve + EWS | 22s |
| APP-002 | Rajesh Kumar | NTC / Unverified | -1 | 45/100 | Reject | 19s |
| APP-003 | Priya Sharma | Salaried | 720 | 92/100 | Auto-Approve | 8s |
| APP-004 | Mohammed Siddiqui | Salaried | 680 | 88/100 | Auto-Approve | 11s |
| APP-005 | Kavitha Nair | Gig-Worker / Thin-File | -1 | 63/100 | Manual Review | 25s |
| APP-006 | Arjun Reddy | NTC / Seasonal Worker | -1 | 51/100 | Manual Review | 28s |
| APP-007 | Sunita Patel | Salaried | 590 | 72/100 | Manual Review | 17s |
| APP-008 | Deepak Joshi | Gig-Worker / Thin-File | -1 | 34/100 | Reject | 21s |

- Clicking a row slides in the right-side BSA Case Detail panel.
- The panel shows different data depending on which applicant is selected (all data hardcoded per applicant ID).

**BSA Case Detail Panel (Right — slides in on row click)**:

*Panel renders per selected applicant. Example for APP-001 (Ananya Sen):*

**Tab 1 — BSA Signals**:

| Block | Content |
|-------|---------|
| Applicant Header | "Ananya Sen · Gig-Worker · CIBIL: NTC (-1) · Applied: ₹80,000 · 12 months" |
| BSA Score Gauge | Circular gauge: **78 / 100** — labeled "High Confidence — Recommended Approval Band" |
| Income Block | Avg Monthly Inflow: ₹48,500 · Consistency: High · Source: Verified freelance platform credits (Upwork, Fiverr) |
| Surplus Block | Avg Monthly Surplus: ₹18,000 · Surplus Trend: Stable (last 6 months) |
| EMI Affordability | Requested EMI: ₹7,400 · EMI-to-Income: 15% · **SAFE** (threshold: < 40%) |
| Expense Volatility | Classification: Low · Predictable rent and utility outflows |
| Bounce Classifier | 1 bounce detected · Severity: **Minimal** · Reason: "Funds transferred 24h later — classified as Technical Recovery, not Default Intent" |
| Positive Reason Codes | ✅ Stable recurring inflows for 6/6 months · ✅ Debt-to-Income < 5% (no active EMIs) · ✅ End-of-month balance consistently above ₹2,000 · ✅ Consistent utility and rent payments |
| Risk Reason Codes | ⚠️ No active credit lines (NTC) · ⚠️ Variable payment receipt dates (+/- 4 days) · ⚠️ Single month (April) balance briefly dipped below ₹1,000 |
| Decision Buttons | [✅ Approve with EWS] [❌ Decline] [📋 Flag for Manual Review] |


**Tab 2 - EWS Guardrails**:

*This tab contains two sub-sections: (A) the selected applicant individual monitoring rules, and (B) a full EWS portfolio summary always visible at the bottom.*

**Sub-section A - Individual Applicant Monitoring (example: Ananya Sen - APP-001):**

| Block | Content |
|-------|---------|
| EWS Status | Active - Monitoring enrolled post-approval |
| Trigger Rule 1 | Salary/Income drop > 30% vs 3-month average - Auto-Flag to credit team |
| Trigger Rule 2 | EMI bounce detected - Immediate alert + outbound nudge to borrower |
| Trigger Rule 3 | Balance falls below Rs.1,000 for 5+ consecutive days - Early warning raised |
| Monitoring Frequency | Daily statement refresh (mocked) |
| Last Check | Today, 09:15 AM |
| Alert Status | Clear - No active alerts |

**Sub-section B - EWS Portfolio Summary (always visible at bottom, regardless of selected applicant):**

Portfolio Header: **"EWS Active Portfolio - 4 Enrolled Borrowers"**
Active Alerts Badge: ðŸ”´ **1 Active Alert** - requires immediate attention

| Borrower | Loan | EMI Due | Last Balance | Alert Status | Action |
|----------|------|---------|--------------|--------------|--------|
| Ananya Sen (APP-001) | Rs.80,000 | 5th | Rs.21,400 | Clear | - |
| Priya Sharma (APP-003) | Rs.15,00,000 | 1st | Rs.52,000 | Clear | - |
| Mohammed Siddiqui (APP-004) | Rs.1,20,000 | 3rd | Rs.18,200 | ðŸ”´ **High Alert** | [Review Account] |
| Kavitha Nair (APP-005) | Rs.60,000 | 10th | Rs.9,800 | Clear | - |

**Active Alert Detail Card (expanded inline below Mohammed Siddiqui row - visible by default):**

| Field | Value |
|-------|-------|
| Borrower | Mohammed Siddiqui (APP-004) |
| Alert Severity | ðŸ”´ **High** |
| Alert Type | Income Drop Detected |
| Triggered Rule | Rule 1 - Salary/Income drop > 30% vs 3-month average |
| Detail | Income this month: Rs.32,000 vs 3-month avg: Rs.68,000 - **drop of 53%**. Significantly exceeds the 30% threshold. |
| Last EMI Status | Paid on time (3rd of this month) |
| Next EMI Due | 3rd of next month - Rs.7,800 |
| Current Balance | Rs.18,200 (vs 3-month avg balance of Rs.32,000) |
| Recommended Action | **Review Account** - Contact borrower to verify income status. Consider proactive restructuring offer. |
| Detected At | Today, 07:42 AM |
| Action Buttons | [Flag for Outreach] [Escalate to Credit Team] |

Action button clicks show a **toast notification** - no actual state change required in prototype.

> **Demo Narration Note**: This alert demonstrates EWS value post-disbursal. Mohammed was a safely-approved borrower (BSA 88/100, salaried, CIBIL 680). EWS caught a sudden 53% income drop before an EMI default could occur.

---

## 11. Mock Data Requirements

All data must be hardcoded as JavaScript constants (arrays/objects) in the frontend. No API calls, no fetch(), no localStorage dependency for core functionality.

### Dataset 1 — Applicant Profiles (Full)

Complete JSON object for all 8 applicants covering all fields needed by the Queue and Case Detail panel:

```json
[
  {
    "id": "APP-001",
    "name": "Ananya Sen",
    "type": "Gig-Worker / Thin-File",
    "loanAmount": 80000,
    "tenure": 12,
    "emi": 7400,
    "cibil": -1,
    "bsaScore": 78,
    "bsaLabel": "High Confidence — Approval Recommended",
    "ttd": "22s",
    "recommendation": "Approve + EWS",
    "status": "pending",
    "income": {
      "avgMonthlyInflow": 48500,
      "consistency": "High",
      "source": "Freelance platforms (Upwork, Fiverr)"
    },
    "surplus": 18000,
    "surplusTrend": "Stable",
    "emiAffordability": { "emiToIncome": "15%", "safe": true },
    "expenseVolatility": "Low",
    "bounce": {
      "count": 1,
      "severity": "Minimal",
      "classification": "Technical Recovery — Not Default Intent"
    },
    "reasonsPositive": [
      "Stable recurring inflows for 6/6 months",
      "Debt-to-Income < 5% — no active EMIs",
      "End-of-month balance consistently above ₹2,000",
      "Consistent utility and rent payments"
    ],
    "reasonsRisk": [
      "No active credit lines (NTC)",
      "Variable payment receipt dates (+/- 4 days)",
      "April: balance briefly dipped below ₹1,000"
    ],
    "ewsStatus": "Active",
    "ewsAlerts": 0
  },
  {
    "id": "APP-002",
    "name": "Rajesh Kumar",
    "type": "NTC / Unverified",
    "loanAmount": 50000,
    "tenure": 12,
    "emi": 4625,
    "cibil": -1,
    "bsaScore": 45,
    "bsaLabel": "High Risk — Decline Recommended",
    "ttd": "19s",
    "recommendation": "Reject",
    "status": "declined",
    "income": {
      "avgMonthlyInflow": 22000,
      "consistency": "Low",
      "source": "Unverified — irregular cash deposits"
    },
    "surplus": 5000,
    "surplusTrend": "Declining",
    "emiAffordability": { "emiToIncome": "21%", "safe": true },
    "expenseVolatility": "High",
    "bounce": {
      "count": 4,
      "severity": "High",
      "classification": "Repeated EMI Default Intent"
    },
    "reasonsPositive": [
      "No active formal credit obligations"
    ],
    "reasonsRisk": [
      "Highly volatile cash inflows — no identifiable income source",
      "4 bounces in 6 months near EMI dates",
      "Frequent zero-balance days (avg 8 days/month)",
      "Declining monthly surplus trend"
    ],
    "ewsStatus": "None",
    "ewsAlerts": 0
  },
  {
    "id": "APP-003",
    "name": "Priya Sharma",
    "type": "Salaried",
    "loanAmount": 1500000,
    "tenure": 24,
    "emi": 7500,
    "cibil": 720,
    "bsaScore": 92,
    "bsaLabel": "Excellent — Auto-Approve",
    "ttd": "8s",
    "recommendation": "Auto-Approve",
    "status": "approved",
    "income": {
      "avgMonthlyInflow": 85000,
      "consistency": "Very High",
      "source": "Salaried — credited on 1st of every month"
    },
    "surplus": 35000,
    "surplusTrend": "Growing",
    "emiAffordability": { "emiToIncome": "9%", "safe": true },
    "expenseVolatility": "Very Low",
    "bounce": { "count": 0, "severity": "None", "classification": "None" },
    "reasonsPositive": [
      "Regular salaried income on 1st of every month",
      "Strong CIBIL score (720)",
      "Monthly balance resilience — never dips below ₹15,000",
      "Zero bounces in 6 months"
    ],
    "reasonsRisk": [],
    "ewsStatus": "Active",
    "ewsAlerts": 0
  },
  {
    "id": "APP-004",
    "name": "Mohammed Siddiqui",
    "type": "Salaried",
    "loanAmount": 120000,
    "tenure": 18,
    "emi": 7800,
    "cibil": 680,
    "bsaScore": 88,
    "bsaLabel": "Strong — Auto-Approve",
    "ttd": "11s",
    "recommendation": "Auto-Approve",
    "status": "approved",
    "income": {
      "avgMonthlyInflow": 68000,
      "consistency": "Very High",
      "source": "Salaried"
    },
    "surplus": 28000,
    "surplusTrend": "Stable",
    "emiAffordability": { "emiToIncome": "11%", "safe": true },
    "expenseVolatility": "Low",
    "bounce": { "count": 0, "severity": "None", "classification": "None" },
    "reasonsPositive": [
      "Consistent salary credits",
      "Good CIBIL score",
      "Low expense-to-income ratio"
    ],
    "reasonsRisk": [
      "Moderate credit card utilization (48%)"
    ],
    "ewsStatus": "Active",
    "ewsAlerts": 0
  },
  {
    "id": "APP-005",
    "name": "Kavitha Nair",
    "type": "Gig-Worker / Thin-File",
    "loanAmount": 60000,
    "tenure": 12,
    "emi": 5550,
    "cibil": -1,
    "bsaScore": 63,
    "bsaLabel": "Moderate — Manual Review Needed",
    "ttd": "25s",
    "recommendation": "Manual Review",
    "status": "manual-review",
    "income": {
      "avgMonthlyInflow": 35000,
      "consistency": "Medium",
      "source": "Mixed — part-time freelance + cash deposits"
    },
    "surplus": 10000,
    "surplusTrend": "Volatile",
    "emiAffordability": { "emiToIncome": "16%", "safe": true },
    "expenseVolatility": "Medium",
    "bounce": {
      "count": 2,
      "severity": "Low",
      "classification": "OTP/Technical Recovery"
    },
    "reasonsPositive": [
      "5 of 6 months show positive surplus",
      "Recognizable freelance income credits"
    ],
    "reasonsRisk": [
      "One month with negative cash-flow",
      "Cash deposits of unknown source in 2 months",
      "No verifiable income certificate"
    ],
    "ewsStatus": "Pending",
    "ewsAlerts": 0
  },
  {
    "id": "APP-006",
    "name": "Arjun Reddy",
    "type": "NTC / Seasonal Worker",
    "loanAmount": 40000,
    "tenure": 6,
    "emi": 7200,
    "cibil": -1,
    "bsaScore": 51,
    "bsaLabel": "Borderline — Manual Review",
    "ttd": "28s",
    "recommendation": "Manual Review",
    "status": "manual-review",
    "income": {
      "avgMonthlyInflow": 28000,
      "consistency": "Low",
      "source": "Seasonal income — large credits in Q4 only"
    },
    "surplus": 8000,
    "surplusTrend": "Seasonal Peaks",
    "emiAffordability": { "emiToIncome": "26%", "safe": true },
    "expenseVolatility": "Medium",
    "bounce": { "count": 1, "severity": "Low", "classification": "Technical" },
    "reasonsPositive": [
      "High income in peak season (Oct–Dec)",
      "No historical defaults"
    ],
    "reasonsRisk": [
      "Off-season months show near-zero inflows",
      "Affordability is borderline if season is bad",
      "NTC — no credit track record"
    ],
    "ewsStatus": "Pending",
    "ewsAlerts": 0
  },
  {
    "id": "APP-007",
    "name": "Sunita Patel",
    "type": "Salaried",
    "loanAmount": 200000,
    "tenure": 24,
    "emi": 10000,
    "cibil": 590,
    "bsaScore": 72,
    "bsaLabel": "Acceptable — Manual Review (High Loan Value)",
    "ttd": "17s",
    "recommendation": "Manual Review",
    "status": "manual-review",
    "income": {
      "avgMonthlyInflow": 52000,
      "consistency": "High",
      "source": "Salaried"
    },
    "surplus": 14000,
    "surplusTrend": "Stable",
    "emiAffordability": { "emiToIncome": "19%", "safe": true },
    "expenseVolatility": "Low",
    "bounce": { "count": 0, "severity": "None", "classification": "None" },
    "reasonsPositive": [
      "Stable salaried income",
      "Zero bounces in 6 months"
    ],
    "reasonsRisk": [
      "CIBIL below 600 — sub-prime",
      "High loan-to-income ratio for 24-month tenure",
      "3 existing EMIs reducing effective surplus"
    ],
    "ewsStatus": "Pending",
    "ewsAlerts": 0
  },
  {
    "id": "APP-008",
    "name": "Deepak Joshi",
    "type": "Gig-Worker / Thin-File",
    "loanAmount": 100000,
    "tenure": 18,
    "emi": 6500,
    "cibil": -1,
    "bsaScore": 34,
    "bsaLabel": "Very High Risk — Decline",
    "ttd": "21s",
    "recommendation": "Reject",
    "status": "declined",
    "income": {
      "avgMonthlyInflow": 15000,
      "consistency": "Very Low",
      "source": "Unidentified — sporadic UPI credits"
    },
    "surplus": -2000,
    "surplusTrend": "Negative",
    "emiAffordability": { "emiToIncome": "43%", "safe": false },
    "expenseVolatility": "Very High",
    "bounce": {
      "count": 7,
      "severity": "Critical",
      "classification": "Repeated Default Pattern"
    },
    "reasonsPositive": [],
    "reasonsRisk": [
      "Negative average monthly surplus",
      "EMI-to-income ratio exceeds 40% threshold",
      "7 bounces in 6 months — systematic default pattern",
      "Unverifiable income source"
    ],
    "ewsStatus": "None",
    "ewsAlerts": 0
  }
]
```

### Dataset 2 — Bank Telemetry

```json
[
  {
    "id": "BANK_01",
    "name": "HDFC Bank",
    "consentSuccessRate": 91,
    "fetchLatencySeconds": 2.1,
    "monthlyFailures": 4200,
    "status": "Online",
    "primaryIssue": "None",
    "failureBreakdown": {
      "userAbandoned": 12,
      "consentDenied": 3,
      "fipUnavailable": 2,
      "accountDiscoveryFailed": 1,
      "otpTimeout": 1
    }
  },
  {
    "id": "BANK_02",
    "name": "ICICI Bank",
    "consentSuccessRate": 88,
    "fetchLatencySeconds": 3.4,
    "monthlyFailures": 5800,
    "status": "Online",
    "primaryIssue": "Technical Timeout",
    "failureBreakdown": {
      "userAbandoned": 14,
      "consentDenied": 4,
      "fipUnavailable": 3,
      "accountDiscoveryFailed": 2,
      "otpTimeout": 2
    }
  },
  {
    "id": "BANK_03",
    "name": "SBI",
    "consentSuccessRate": 62,
    "fetchLatencySeconds": 8.9,
    "monthlyFailures": 18600,
    "status": "Latency Warning",
    "primaryIssue": "OTP Delivery Failures",
    "failureBreakdown": {
      "userAbandoned": 22,
      "consentDenied": 5,
      "fipUnavailable": 8,
      "accountDiscoveryFailed": 3,
      "otpTimeout": 18
    }
  },
  {
    "id": "BANK_04",
    "name": "Axis Bank",
    "consentSuccessRate": 84,
    "fetchLatencySeconds": 4.1,
    "monthlyFailures": 6300,
    "status": "Online",
    "primaryIssue": "Account Discovery Failures",
    "failureBreakdown": {
      "userAbandoned": 11,
      "consentDenied": 3,
      "fipUnavailable": 4,
      "accountDiscoveryFailed": 6,
      "otpTimeout": 1
    }
  },
  {
    "id": "BANK_05",
    "name": "Yes Bank",
    "consentSuccessRate": 41,
    "fetchLatencySeconds": 15.2,
    "monthlyFailures": 23500,
    "status": "Downtime",
    "primaryIssue": "FIP Authentication Failure",
    "failureBreakdown": {
      "userAbandoned": 18,
      "consentDenied": 7,
      "fipUnavailable": 38,
      "accountDiscoveryFailed": 5,
      "otpTimeout": 9
    }
  },
  {
    "id": "BANK_06",
    "name": "Bank of Baroda",
    "consentSuccessRate": 79,
    "fetchLatencySeconds": 5.0,
    "monthlyFailures": 8200,
    "status": "Online",
    "primaryIssue": "Minor Timeout",
    "failureBreakdown": {
      "userAbandoned": 15,
      "consentDenied": 4,
      "fipUnavailable": 5,
      "accountDiscoveryFailed": 3,
      "otpTimeout": 4
    }
  }
]
```

### Dataset 3 — Funnel & KPI Metrics

```json
{
  "baseline": {
    "monthlyApplicants": 100000,
    "consentRate": 0.55,
    "fetchSuccessRate": 0.85,
    "approvalRate": 0.30,
    "disbursalConversionRate": 0.90,
    "avgLoanValue": 80000,
    "platformFeePct": 0.005,
    "cacPerApplicant": 250,
    "fpd30DayRate": 0.018,
    "manualReviewRate": 0.45,
    "ttdSeconds": 28
  },
  "trendData": {
    "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "consentRateBaseline": [55, 54, 55, 56, 55, 55],
    "consentRateOptimized": [55, 55, 60, 63, 66, 68],
    "approvalRateBaseline": [30, 29, 30, 31, 30, 30],
    "approvalRateOptimized": [30, 30, 31, 33, 34, 35],
    "delinquencyBaseline": [1.8, 1.9, 1.8, 2.0, 1.9, 1.8],
    "delinquencyOptimized": [1.8, 1.9, 1.8, 1.9, 1.8, 1.7]
  }
}
```

### Dataset 4 - EWS Active Portfolio

```json
{
  "enrolledBorrowers": 4,
  "activeAlerts": 1,
  "lastRefreshed": "Today, 09:15 AM",
  "portfolio": [
    {
      "borrowerId": "APP-001",
      "name": "Ananya Sen",
      "loanAmount": 80000,
      "emiDueDate": "5th of every month",
      "lastBalanceCheck": "21400",
      "alertStatus": "Clear",
      "rule1Triggered": false,
      "rule2Triggered": false,
      "rule3Triggered": false,
      "alert": null
    },
    {
      "borrowerId": "APP-003",
      "name": "Priya Sharma",
      "loanAmount": 1500000,
      "emiDueDate": "1st of every month",
      "lastBalanceCheck": "52000",
      "alertStatus": "Clear",
      "rule1Triggered": false,
      "rule2Triggered": false,
      "rule3Triggered": false,
      "alert": null
    },
    {
      "borrowerId": "APP-004",
      "name": "Mohammed Siddiqui",
      "loanAmount": 120000,
      "emiDueDate": "3rd of every month",
      "lastBalanceCheck": "18200",
      "alertStatus": "High Alert",
      "rule1Triggered": true,
      "rule2Triggered": false,
      "rule3Triggered": false,
      "alert": {
        "severity": "High",
        "type": "Income Drop Detected",
        "triggeredRule": "Rule 1 - Salary/Income drop > 30% vs 3-month average",
        "detail": "Income this month: 32000 vs 3-month avg: 68000 - drop of 53%. Significantly exceeds the 30% threshold.",
        "lastEmiStatus": "Paid on time - 3rd of this month",
        "nextEmiDue": "3rd of next month",
        "nextEmiAmount": 7800,
        "currentBalance": 18200,
        "avgBalance3Month": 32000,
        "recommendedAction": "Review Account - Contact borrower to verify income status. Consider proactive restructuring offer.",
        "detectedAt": "Today, 07:42 AM"
      }
    },
    {
      "borrowerId": "APP-005",
      "name": "Kavitha Nair",
      "loanAmount": 60000,
      "emiDueDate": "10th of every month",
      "lastBalanceCheck": "9800",
      "alertStatus": "Clear",
      "rule1Triggered": false,
      "rule2Triggered": false,
      "rule3Triggered": false,
      "alert": null
    }
  ]
}
```

---

## 12. User Flows

### Flow A — Happy Path (Thin-File NTC Borrower — Approved)

| Step | Screen | Action | Result |
|------|--------|--------|--------|
| 1 | B1 | Set ₹80,000 / 12 months → click "Link Bank" | Navigate to B2 |
| 2 | B2 | Read trust cards → click "Agree & Link Bank" | Navigate to B3 |
| 3 | B3 | Search "HDFC" → click HDFC Bank (Online) | OTP modal appears |
| 4 | B3 | Enter mock OTP "1234" → click "Approve Data Share" | Navigate to B4 |
| 5 | B4 | Watch 4-step animated fetch progress | Auto-navigate to B5 after ~6s |
| 6 | B5 | Read confirmation + EWS notice | [Demo context switch] |
| 7 | L3 | Lender portal — find Ananya Sen in queue | Click row to open Case Detail |
| 8 | L3 Modal | Review BSA score (78), reason codes, EWS | Click "Approve with EWS" |
| 9 | Toast | "Ananya Sen approved. EWS monitoring activated." | End of demo flow |

### Flow B — Smart Retry Recovery (Bank Downtime)

| Step | Screen | Action | Result |
|------|--------|--------|--------|
| 1 | B1–B3 | Same as Flow A steps 1–3 but select "Yes Bank" | OTP modal appears |
| 2 | B3 | Enter mock OTP "1234" → click "Approve" | Navigate to B4 |
| 3 | B4 | Downtime state shown immediately | Smart retry countdown starts (15s) |
| 4 | B4 | User clicks "Try Again Now" (or waits 15s) | Steps replay → B5 |
| 5 | L2 | Switch to Lender Portal → Observability | Yes Bank shown as 🔴 Down; retry stat updates |

### Flow C — Executive ROI Analysis

| Step | Screen | Action | Result |
|------|--------|--------|--------|
| 1 | L1 | Land on Executive Dashboard | View baseline funnel (55% consent, 30% approval) |
| 2 | L1 | Drag Consent slider to 75% | Revenue Lift updates live: +₹X Cr/year displayed |
| 3 | L1 | Click "Q2 Target" preset | Both sliders snap to 70% / 38% |
| 4 | L1 | Click "With LendWell Intelligence" toggle on trend chart | Trend lines show uplift from Month 3 |
| 5 | L2 | Navigate to Observability | Identify SBI + Yes Bank as largest failure sources |
| 6 | L1 | Return to calculator | Quantify cost of Yes Bank downtime |

### Flow D — Underwriter Queue Review (All Profiles)

| Step | Screen | Action | Result |
|------|--------|--------|--------|
| 1 | L3 | Click filter "Thin-File (4)" | Queue shows only NTC/Gig-Worker applicants |
| 2 | L3 | Click "Ananya Sen" | Case detail slides in with 78/100 score |
| 3 | L3 | Click "EWS Guardrails" tab | Shows monitoring rules and active portfolio |
| 4 | L3 | Click "Reject" case (Deepak Joshi) | Detail shows 34/100, 7 bounces, negative surplus |
| 5 | L3 | Compare Ananya (78) vs Deepak (34) | Demonstrates explainability for differential decisions |

---

## 13. Key Demo Scenarios

### Scenario 1 — The Explainability Pitch (For Vikram Mehta, CRO)
- **Entry Point**: L3 Underwriting Queue, filter to "Thin-File"
- **Action**: Click Ananya Sen → Show BSA score 78/100, reason codes
- **Key Message**: "Without bureau data, our BSA tells you *exactly* why she's a safe bet — 6 months of verified gig income, EMI affordability at 15%, and a bounce classified as non-default. You can sign off with confidence."
- **Follow-up**: Click Deepak Joshi → Show 34/100, 7 bounces, negative surplus → "And this is exactly who we help you keep out."

### Scenario 2 — The Revenue Impact Pitch (For LendWell Board)
- **Entry Point**: L1 Executive Dashboard
- **Action**: Pull Consent slider from 55% → 75% → show live revenue lift
- **Key Message**: "A 20-point consent improvement — achievable through our pre-consent education card and smart retry UX — translates to **+₹X Cr annually** without any change to your underwriting policy."
- **Follow-up**: Click "Q2 Target" preset → show combined consent + approval lift scenario

### Scenario 3 — The Downtime Recovery Pitch (For Rohan Dev, PM)
- **Entry Point**: B3 Mobile Simulator → Select Yes Bank
- **Action**: Demonstrate Smart Retry screen → click "Try Again Now" → B5 success
- **Key Message**: "Instead of a dead-end error page that drives 38% abandonment at Yes Bank, we keep the user engaged, informed, and in-funnel. Our smart retry currently recovers 92% of temporary FIP failures."
- **Follow-up**: Switch to L2 → Show Yes Bank row at 🔴 Down with failure attribution

### Scenario 4 — The Trust-Building Pitch (For Borrower Experience Review)
- **Entry Point**: B1 → B2
- **Action**: Walk through the 4 trust cards slowly (what, why, how long, revoke)
- **Key Message**: "The consent drop-off isn't about users not wanting a loan. It's about trust. We address every specific fear — data scope, purpose, duration, and revocation — before they see the bank redirect."

---

## 14. Design Principles

### Visual Identity System

| Token | B2B Portal (Lender) | B2C Mobile (Borrower) |
|-------|--------------------|-----------------------|
| Background | `hsl(222, 28%, 9%)` — Deep navy | `hsl(0, 0%, 98%)` — Near-white |
| Surface | `hsl(222, 24%, 14%)` — Dark card | `hsl(210, 40%, 97%)` — Light card |
| Primary Accent | `hsl(160, 84%, 39%)` — Emerald green | `hsl(245, 82%, 58%)` — Indigo |
| Danger / Alert | `hsl(0, 72%, 51%)` — Coral red | `hsl(0, 72%, 51%)` — Same |
| Warning | `hsl(38, 92%, 50%)` — Amber | `hsl(38, 92%, 50%)` — Same |
| Text Primary | `hsl(210, 40%, 96%)` | `hsl(222, 28%, 12%)` |
| Text Secondary | `hsl(215, 20%, 65%)` | `hsl(215, 15%, 45%)` |
| Font Family | Inter, system-ui (from Google Fonts) | Inter, system-ui |
| Border Radius | 12px cards, 8px inputs | 16px cards, 24px CTAs |
| Spacing Scale | 4px base, multiples: 8, 12, 16, 24, 32, 48 | Same |

### Interaction & Animation Standards
- **Transitions**: All screen/panel transitions: `ease-out 250ms`
- **Hover**: Button scale to `1.02`, shadow lift — `250ms ease`
- **Loading spinners**: CSS-only animated ring (no GIF assets)
- **Countdown timer**: CSS animated fill or JS `setInterval` on a visible countdown number
- **Toast notifications**: Slide in from top-right, auto-dismiss after 3s
- **Tab switches**: Instant — no animation needed
- **Funnel chart**: SVG or Canvas — static render with hover tooltips
- **Score gauge**: SVG arc — rendered at page load, no animation required in MVP

### Accessibility Minimums (Borrower Mobile View)
- Minimum tap target: **48 × 48px**
- Minimum body font size: **16px**
- Contrast ratio: **minimum 4.5:1** for all text/background combinations
- All interactive elements must have a visible `:focus` ring

### Mobile Phone Simulator Frame
- Width: **375px** (iPhone SE viewport)
- Height: **812px** visible area
- Rendered in centre of screen on a neutral dark background
- Has a mock status bar (time, battery, signal) — purely decorative
- Frame itself is a CSS-drawn rounded rectangle (no image dependency)

---

## 15. Scope for MVP Prototype

### Included
- All **8 screens** (B1-B5, L1-L3) fully rendered with correct layout and mock data
- **Named sidebar navigation** for Lender Mode: Executive Dashboard (L1), Observability Console (L2), Underwriting Workbench (L3)
- **Named step navigation** for Borrower Mode: Loan Application (B1), Trust & Consent (B2), Bank Linking (B3), Fetch Progress (B4), Success (B5)
- **5-dot step progress indicator** inside the Borrower phone frame (fills per screen, labels on hover)
- **5 interactive data-driven states** across B4 (Success, Slow Fetch, Smart Retry, Manual Trigger, Auto-Recovery)
- **Revenue Lift Calculator** with live-updating output on slider drag (consent rate + approval rate sliders)
- **Funnel chart** with hover tooltips on each funnel stage
- **Filter tabs** on L3 queue - all 6 filter states show correct subset of the 8 applicants
- **Sortable bank table** on L2 (client-side sort by any column header click)
- **BSA Case Detail panel** populates correctly for all 8 applicants on row click
- **BSA Signals tab / EWS Guardrails tab** switcher within the case detail panel
- **EWS Portfolio Summary** (Sub-section B) in EWS tab showing all 4 enrolled borrowers
- **Active EWS Alert** for Mohammed Siddiqui (APP-004): income drop of 53%, severity High, with action buttons
- **Toast notifications** for all action buttons (Approve / Decline / Manual Review / Flag for Outreach / Escalate)
- **"Reset Demo"** button below the phone simulator frame to restart Borrower flow from B1
- **Preset scenario buttons** on ROI Calculator: Q1 Target, Q2 Target, Reset Baseline
- **Mode toggle** (Borrower App View / Lender Portal View) in global header - switches entire viewport
- **"[triangle] Start Guided Demo"** button in global header - launches 6-step spotlight overlay walkthrough
- **Guided Demo overlay** with: spotlight cutout on target element, step counter (N of 6), title, description, Back/Next buttons, Exit link, and auto-navigation between screens
- **Guided Demo steps**: (1) Consent Funnel Problem, (2) Trust & Consent, (3) Smart Retry Recovery, (4) Bank Observability, (5) Explainable Underwriting, (6) Revenue Impact
- **9.4 Mode Switch Behaviour** rules: Lender defaults to L1, Borrower restores last screen, Reset always goes to B1
- All mock data hardcoded as JS constants (4 Datasets) - zero API calls, no fetch()

### Prototype Constraints (Reminders)
- No user login or session management
- No real OTP validation (any input proceeds after 4 digits entered)
- No persistent state across page reload
- No file upload, PDF generation, or document parsing
- No backend, no server, no database

---

## 16. Out of Scope

| Category | Excluded |
|----------|---------|
| Infrastructure | Any backend server, API, or database |
| Authentication | Real login, JWT, session, roles |
| AA Integration | Real Sahamati/AA API calls or sandbox |
| Bank Integration | Real FIP connections or bank APIs |
| OTP | Real SMS gateway or phone verification |
| Credit Bureaus | Real CIBIL/Experian/Equifax API |
| BSA Engine | Actual ML model or statement parsing |
| EWS Engine | Real monitoring jobs or alert dispatch |
| Data Persistence | localStorage, IndexedDB, or cookies for core data |
| Reporting | PDF export, email reports |
| Notifications | Real push notifications or webhooks |
| Multi-Language | Only English in MVP prototype |
| Multi-Device | Desktop-first (Lender portal); 375px fixed (Borrower sim) |
