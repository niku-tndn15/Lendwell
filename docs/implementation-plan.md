# Implementation Plan
## Lending Intelligence Platform — Clickable Frontend Prototype
**Based on**: PRD v2.1 | **Stack**: React + Vite + Tailwind CSS | **Type**: Frontend-Only, No Backend

---

> [!IMPORTANT]
> **Constraints that apply to ALL milestones:**
> - No backend, no server, no database
> - No authentication or session management
> - No API calls (`fetch()`, `axios`, or any network request)
> - All data from hardcoded JS constants in `/src/data/`
> - No `localStorage` for core functionality
> - State lives in React component state, context, and React Router URL
> - All screen transitions via React Router v6 `navigate()` — URL is the source of truth for active screen

## Project Setup (Pre-Milestone)

### Scaffold

```bash
npm create vite@latest lending-prototype -- --template react
cd lending-prototype
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom        # R1: URL-based routing
npm install recharts                # funnel chart + line charts
npm install lucide-react            # icons throughout
```

### Route Structure (R1)

All routes defined in `App.jsx` using React Router v6. The router is the single source of truth for which screen is active. Context no longer stores `borrowerScreen` or `lenderScreen`.

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

<BrowserRouter>
  <GlobalHeader />           {/* always rendered outside Routes */}
  <GuidedDemoOverlay />      {/* always rendered; visible only when demoActive */}
  <Toast />                  {/* always rendered; visible only when toastMessage set */}

  <Routes>
    <Route path="/" element={<Navigate to="/borrower/home" replace />} />

    {/* Borrower flow — wrapped in PhoneFrame layout */}
    <Route path="/borrower" element={<BorrowerLayout />}>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home"      element={<B1_LoanHome />} />
      <Route path="trust"     element={<B2_TrustScreen />} />
      <Route path="discovery" element={<B3_BankDiscovery />} />
      <Route path="fetch"     element={<B4_FetchStatus />} />
      <Route path="success"   element={<B5_Success />} />
    </Route>

    {/* Lender portal — wrapped in LenderLayout (sidebar + content) */}
    <Route path="/lender" element={<LenderLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"     element={<L1_Dashboard />} />
      <Route path="observability" element={<L2_Observability />} />
      <Route path="underwriting"  element={<L3_Underwriting />} />
    </Route>

    <Route path="*" element={<Navigate to="/borrower/home" replace />} />
  </Routes>
</BrowserRouter>
```

**Screen-to-route reference:**

| Screen ID | Route | PRD Label |
|-----------|-------|-----------|
| B1 | `/borrower/home` | Loan Application |
| B2 | `/borrower/trust` | Trust & Consent |
| B3 | `/borrower/discovery` | Bank Linking |
| B4 | `/borrower/fetch` | Fetch Progress |
| B5 | `/borrower/success` | Success |
| L1 | `/lender/dashboard` | Executive Dashboard |
| L2 | `/lender/observability` | Observability Console |
| L3 | `/lender/underwriting` | Underwriting Workbench |

### Directory Structure (R1–R4)

```
src/
├── data/
│   ├── applicants.js           # Dataset 1 — 8 applicant profiles
│   ├── banks.js                # Dataset 2 — 6 bank telemetry records
│   ├── metrics.js              # Dataset 3 — funnel KPIs + trend data
│   └── ews.js                  # Dataset 4 — EWS active portfolio
│
├── context/
│   ├── AppContext.jsx          # selectedBank, toast, L3 panel, presentationMode
│   └── DemoContext.jsx         # R2: Demo state + action stubs
│
├── demo/                       # R2: Demo foundation (built in M0, consumed by M6)
│   ├── demoSteps.js            # DEMO_STEPS config array — full 6-step spec
│   ├── spotlightUtils.js       # apply/clear spotlight CSS utilities
│   ├── useDemoTarget.js        # Custom hook — self-registers spotlight targets
│   └── demoNavHandlers.js      # navigateDemoStep() stub (fully wired in M6)
│
├── hooks/
│   ├── useMode.js              # R1: Derives 'borrower'|'lender' from current URL
│   └── useSimulatedLoad.js     # R4: Returns loading:true for configurable delay then false
│
├── components/
│   ├── layout/
│   │   ├── GlobalHeader.jsx    # Mode toggle (navigate), Demo btn, Presentation toggle (R3)
│   │   ├── BorrowerLayout.jsx  # PhoneFrame + StepProgressDots + ResetDemoButton + Outlet
│   │   ├── LenderLayout.jsx    # LenderSidebar + main Outlet
│   │   └── PhoneFrame.jsx      # 375×812 CSS frame — pure wrapper, no logic
│   │
│   ├── shared/
│   │   ├── Toast.jsx
│   │   ├── TabSwitcher.jsx
│   │   ├── KPICard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── CircularGauge.jsx
│   │   └── skeletons/          # R4: Loading skeleton components
│   │       ├── SkeletonKPICard.jsx
│   │       ├── SkeletonTable.jsx
│   │       ├── SkeletonDetailPanel.jsx
│   │       ├── SkeletonChart.jsx
│   │       └── SkeletonProgressStep.jsx
│   │
│   ├── borrower/
│   └── lender/
│
├── screens/
│   ├── borrower/
│   │   ├── B1_LoanHome.jsx
│   │   ├── B2_TrustScreen.jsx
│   │   ├── B3_BankDiscovery.jsx
│   │   ├── B4_FetchStatus.jsx
│   │   └── B5_Success.jsx
│   └── lender/
│       ├── L1_Dashboard.jsx
│       ├── L2_Observability.jsx
│       └── L3_Underwriting.jsx
│
└── App.jsx                     # Route tree root
```

### Tailwind Design Tokens (tailwind.config.js)

```js
// These must be configured before any milestone begins
colors: {
  // B2B Lender Portal
  'navy':      'hsl(222, 28%, 9%)',
  'surface':   'hsl(222, 24%, 14%)',
  'emerald':   'hsl(160, 84%, 39%)',
  'coral':     'hsl(0, 72%, 51%)',
  'amber':     'hsl(38, 92%, 50%)',
  'text-pri':  'hsl(210, 40%, 96%)',
  'text-sec':  'hsl(215, 20%, 65%)',
  // B2C Borrower Simulator
  'b-bg':      'hsl(0, 0%, 98%)',
  'b-surface': 'hsl(210, 40%, 97%)',
  'b-accent':  'hsl(245, 82%, 58%)',
}
fontFamily: { sans: ['Inter', 'system-ui'] }
```

> [!NOTE]
> Google Fonts Inter must be imported in `index.html`. The Tailwind config tokens serve as the single source of truth for all colours across milestones.

---

## Milestone 0 — Foundation, Data Layer & Global Shell

**Estimated Effort**: 2–2.5 days *(increased from 1–1.5d due to R1–R4 additions)*

### 1. Objective
Establish the project scaffold, React Router v6 route tree, design token system, global navigation shell, all four hardcoded mock datasets, two React contexts (AppContext + DemoContext), Demo foundation framework (R2), Presentation Mode (R3), and Loading Skeleton library (R4). This is the dependency-zero foundation all milestones build on.

### 2. Screens Included
No screen content. Only the outer shell:
- Global header bar (mode toggle, guided demo stub button, presentation mode toggle)
- `BorrowerLayout` with empty phone frame and `<Outlet />`
- `LenderLayout` with sidebar and empty `<Outlet />`
- Route tree: `/borrower/home` and `/lender/dashboard` render without errors

### 3. Components Required

#### Layout & Navigation (R1)

| Component | File | Purpose |
|-----------|------|---------|
| `GlobalHeader` | `layout/GlobalHeader.jsx` | Logo; mode toggle via `useNavigate`; Guided Demo stub button; Presentation Mode toggle (R3) |
| `BorrowerLayout` | `layout/BorrowerLayout.jsx` | `PhoneFrame` wrapping `<Outlet />`; `StepProgressDots`; `ResetDemoButton` below frame |
| `LenderLayout` | `layout/LenderLayout.jsx` | `LenderSidebar` (240px fixed) + `<main><Outlet /></main>` |
| `PhoneFrame` | `layout/PhoneFrame.jsx` | 375×812 CSS frame; pure wrapper; no screen logic |

**Mode toggle in GlobalHeader (R1) — uses `useNavigate`, not context setter:**
```jsx
const navigate = useNavigate();
const mode = useMode();  // derived from URL via useLocation()
const { lastBorrowerPath, lastLenderPath } = useAppContext();

const toggleMode = () => {
  if (mode === 'borrower') navigate(lastLenderPath || '/lender/dashboard');
  else navigate(lastBorrowerPath || '/borrower/home');
};
```

**LenderSidebar active state via NavLink (R1) — no custom active state logic:**
```jsx
<NavLink
  to="/lender/dashboard"
  className={({ isActive }) =>
    isActive
      ? 'border-l-4 border-emerald bg-white/10 text-text-pri'
      : 'border-l-4 border-transparent text-text-sec hover:bg-white/5'
  }
>
  📊 Executive Dashboard
</NavLink>
```

**StepProgressDots — active step derived from URL (R1):**
```js
const STEP_ROUTES = [
  '/borrower/home', '/borrower/trust', '/borrower/discovery',
  '/borrower/fetch', '/borrower/success'
];
const { pathname } = useLocation();
const activeStep = STEP_ROUTES.findIndex(r => r === pathname); // 0–4
```

**ResetDemoButton (R1):**
```jsx
const navigate = useNavigate();
const { setSelectedBank } = useAppContext();
const handleReset = () => {
  setSelectedBank(null);
  navigate('/borrower/home', { replace: true });
};
```

**Last-path memory — via layout `useEffect` (R1):**
```jsx
// BorrowerLayout.jsx and LenderLayout.jsx
const { pathname } = useLocation();
const { updateLastPath } = useAppContext();
useEffect(() => { updateLastPath(mode, pathname); }, [pathname]);
```

#### AppContext (R1 + R3) — revised state shape

```js
{
  // R1: Route memory for mode-switching
  lastBorrowerPath: '/borrower/home',
  lastLenderPath:   '/lender/dashboard',

  // Unchanged
  selectedBank:        null,           // set in B3; read in B4 for state branching
  selectedApplicantId: null,           // set in L3 on row click
  activeCaseTab:      'bsa-signals',   // L3 case detail tab
  toastMessage:        null,           // { text, type } | null

  // R3: Presentation Mode
  presentationMode: false,
}
```

**Removed from AppContext (route-derived or moved to DemoContext):**
- ~~`mode`~~ → use `useMode()` hook (derived from URL)
- ~~`borrowerScreen`, `lenderScreen`~~ → current route is source of truth
- ~~`demoActive`, `demoStep`, `demoForcedBank`~~ → moved to DemoContext

**AppContext actions:**
- `setSelectedBank(bank)` — stores bank selection from B3
- `showToast(text, type)` — triggers toast, auto-clears after 3s
- `openCaseDetail(applicantId)` — sets `selectedApplicantId`
- `switchCaseTab(tab)` — sets `activeCaseTab`
- `updateLastPath(mode, path)` — updates route memory for mode switching
- `setPresentationMode(bool)` — R3: toggles presentation mode

#### DemoContext (R2) — new separate context

```js
// context/DemoContext.jsx
{
  demoActive:     false,
  demoStep:       0,      // 0–5; index into DEMO_STEPS
  demoForcedBank: null,   // 'YES_BANK' | null; read by B4_FetchStatus
}
// Actions (stubs in M0, wired in M6):
// startDemo()               → demoActive: true, demoStep: 0, navigateDemoStep(0)
// navigateDemoStep(index)   → stub in M0; fully implemented in M6
// exitDemo()                → reset all demo state, clearSpotlight()
// setDemoForcedBank(value)  → sets demoForcedBank
```

#### Demo Foundation Files (R2) — all created in M0

**`demo/demoSteps.js` — full 6-step config (route-based, R1):**
```js
export const DEMO_STEPS = [
  { index: 0, title: "The Rs.1.125 Crore Monthly Problem",
    description: "Every month, 45,000 applicants abandon LendWell's loan journey...",
    route: '/lender/dashboard', spotlightTargetId: 'funnel-chart',
    cardPosition: 'bottom-right', sideEffects: [] },
  { index: 1, title: "Why Users Drop Off - And How We Fix It",
    description: "The drop-off isn't about intent - it's about fear...",
    route: '/borrower/trust', spotlightTargetId: 'trust-cards',
    cardPosition: 'right', sideEffects: [] },
  { index: 2, title: "We Recover 92% of Bank Failures",
    description: "When a bank FIP is down, legacy systems throw a dead-end error...",
    route: '/borrower/fetch', spotlightTargetId: 'retry-widget',
    cardPosition: 'top', sideEffects: ['SET_FORCED_BANK_YES_BANK'] },
  { index: 3, title: "Know Exactly Which Bank is Failing - and Why",
    description: "Our Observability Console gives your product team bank-wise failure attribution...",
    route: '/lender/observability', spotlightTargetId: 'bank-table',
    cardPosition: 'top-right', sideEffects: ['CLEAR_FORCED_BANK'] },
  { index: 4, title: "Approve Thin-File Borrowers - With Confidence",
    description: "Ananya has no bureau score. Under the old system, she's an automatic reject...",
    route: '/lender/underwriting', spotlightTargetId: 'bsa-gauge',
    cardPosition: 'left', sideEffects: ['OPEN_CASE_APP001', 'SWITCH_TAB_BSA'] },
  { index: 5, title: "Quantify the Upside - Live",
    description: "This isn't just a UX improvement - it's a measurable revenue opportunity...",
    route: '/lender/dashboard', spotlightTargetId: 'revenue-calculator',
    cardPosition: 'top-left', sideEffects: ['SCROLL_TO_CALCULATOR'] },
];
```

**`demo/spotlightUtils.js`:**
```js
export const applySpotlight = (targetId) => {
  clearSpotlight();
  const el = document.querySelector(`[data-demo-id="${targetId}"]`);
  if (!el) { console.warn(`[Demo] Target not found: ${targetId}`); return; }
  el.classList.add('demo-spotlight-active');
  // index.css: .demo-spotlight-active {
  //   position: relative; z-index: 1001;
  //   box-shadow: 0 0 0 9999px rgba(0,0,0,0.65); border-radius: 8px; }
};
export const clearSpotlight = () => {
  document.querySelectorAll('.demo-spotlight-active')
    .forEach(el => el.classList.remove('demo-spotlight-active'));
};
```

**`demo/useDemoTarget.js` — self-registration hook (screens use this, not manual `data-demo-id`):**
```js
export const useDemoTarget = (demoId) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.setAttribute('data-demo-id', demoId);
    return () => { if (ref.current) ref.current.removeAttribute('data-demo-id'); };
  }, [demoId]);
  return ref;
};
// Usage: const funnelRef = useDemoTarget('funnel-chart');
//        <div ref={funnelRef}>...</div>
```

**`demo/demoNavHandlers.js` — stub in M0 (fully implemented in M6):**
```js
// Importable now so DemoContext and screens compile without errors.
export const buildNavigateDemoStep = ({ navigate, appContext, demoContext }) => {
  return (index) => {
    console.log(`[Demo] navigateDemoStep(${index}) — stub, wired in M6`);
  };
};
```

#### Presentation Mode (R3)

**GlobalHeader addition:**
```jsx
import { Maximize2, Minimize2 } from 'lucide-react';
const { presentationMode, setPresentationMode } = useAppContext();

<button id="presentation-mode-toggle"
  onClick={() => setPresentationMode(!presentationMode)}
  title={presentationMode ? 'Exit Presentation Mode' : 'Enter Presentation Mode'}
  className="ml-2 p-2 rounded-lg text-text-sec hover:text-text-pri transition">
  {presentationMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
</button>
```

**App.jsx — applies CSS class to root div:**
```jsx
const { presentationMode } = useAppContext();
<div className={`h-screen ${presentationMode ? 'presentation-mode' : ''}`}>
  {/* route tree */}
</div>
```

**index.css — Presentation Mode overrides:**
```css
.presentation-mode .reset-demo-btn    { display: none; }
.presentation-mode .header-debug      { display: none; }
.presentation-mode .global-header     { padding: 8px 24px; }
.presentation-mode .lender-sidebar    { width: 64px; }
.presentation-mode .sidebar-label     { display: none; }
.presentation-mode .phone-frame-wrapper {
  transform: scale(1.05);
  transform-origin: center top;
}
```

Elements hidden: `ResetDemoButton` (`.reset-demo-btn`), dev indicators (`.header-debug`), sidebar text labels (`.sidebar-label`). Sidebar collapses to 64px icon-only — no JS logic in sidebar required.

#### Loading Skeleton Components (R4)

**Shared pulse animation in `index.css`:**
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
.skeleton { animation: skeleton-pulse 1.4s ease-in-out infinite; }
```

| Component | File | Mimics | Props |
|-----------|------|--------|-------|
| `SkeletonKPICard` | `shared/skeletons/SkeletonKPICard.jsx` | KPI card dimensions | — |
| `SkeletonTable` | `shared/skeletons/SkeletonTable.jsx` | Table rows | `rows` (default 6) |
| `SkeletonDetailPanel` | `shared/skeletons/SkeletonDetailPanel.jsx` | BSA case detail | — |
| `SkeletonChart` | `shared/skeletons/SkeletonChart.jsx` | Chart rectangle | `height` (px) |
| `SkeletonProgressStep` | `shared/skeletons/SkeletonProgressStep.jsx` | 4 fetch steps | — |

**`useSimulatedLoad` hook:**
```js
// src/hooks/useSimulatedLoad.js
export const useSimulatedLoad = (delayMs = 750) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(t);
  }, []);
  return loading;
};
```

**Delay targets per screen:**

| Screen | Element | Delay |
|--------|---------|-------|
| L1 | KPI cards | 600ms |
| L1 | Funnel chart | 800ms |
| L1 | Trend chart | 900ms |
| L1 | Revenue calculator | 500ms |
| L2 | Heatmap + bank table | 700ms |
| L2 | Retry recovery widget | 600ms |
| L3 | Applicant queue table | 750ms |
| L3 | Case detail panel (per row click) | 500ms |

#### Shared Components (unchanged)

| Component | File | Purpose |
|-----------|------|---------|
| `Toast` | `shared/Toast.jsx` | Slide-in toast; 3s auto-dismiss via `useEffect` |
| `TabSwitcher` | `shared/TabSwitcher.jsx` | Reusable 2-tab component |
| `KPICard` | `shared/KPICard.jsx` | Metric card for L1 |
| `StatusBadge` | `shared/StatusBadge.jsx` | Online/Latency/Down pill |
| `CircularGauge` | `shared/CircularGauge.jsx` | BSA score SVG gauge |

### 4. Mock Data Dependencies
All four data files must be fully created in `/src/data/`:

| File | Contents | Records |
|------|----------|---------|
| `applicants.js` | `export const APPLICANTS = [...]` | 8 full applicant objects (Dataset 1) |
| `banks.js` | `export const BANKS = [...]` | 6 bank telemetry objects (Dataset 2) |
| `metrics.js` | `export const METRICS = {...}` | Funnel baselines + 6-month trend arrays (Dataset 3) |
| `ews.js` | `export const EWS_PORTFOLIO = {...}` | 4 enrolled borrowers + 1 active alert (Dataset 4) |

All JSON from PRD §11 must be transcribed exactly. The `alert` object on Mohammed Siddiqui (APP-004) in `ews.js` must be fully populated.

### 5. Navigation Dependencies (R1)

| Interaction | Mechanism |
|-------------|-----------|
| Mode toggle Borrower → Lender | `navigate(lastLenderPath \|\| '/lender/dashboard')` |
| Mode toggle Lender → Borrower | `navigate(lastBorrowerPath \|\| '/borrower/home')` |
| Sidebar L1/L2/L3 | `<NavLink to="/lender/...">` — router handles active state |
| Borrower screen advance | `navigate('/borrower/...')` inside each CTA handler |
| Reset Demo button | `navigate('/borrower/home', { replace: true })` + `setSelectedBank(null)` |
| Browser Back/Forward | Natively handled by React Router — no extra code |
| Direct URL access | All routes render safely with context defaults |

### 6. Acceptance Criteria

**React Router (R1):**
- [ ] Navigating directly to `/borrower/home` renders B1 (Loan Home)
- [ ] Navigating directly to `/lender/dashboard` renders L1 with sidebar
- [ ] Browser Back after B1→B2→B3 returns to B2 then B1
- [ ] Mode toggle from L2 to Borrower and back returns to `/lender/observability`
- [ ] `LenderSidebar` active state (green border) matches current URL automatically via NavLink
- [ ] `StepProgressDots` active dot matches current `/borrower/*` route
- [ ] Unknown URL (`/foo/bar`) redirects to `/borrower/home`

**Demo Foundation (R2):**
- [ ] `DemoContext` available app-wide; `demoActive` defaults to `false`; `demoStep` defaults to 0
- [ ] `DEMO_STEPS` exports 6 entries each with `route`, `spotlightTargetId`, `sideEffects`
- [ ] `useDemoTarget('funnel-chart')` ref sets `data-demo-id="funnel-chart"` on its DOM node
- [ ] `applySpotlight('funnel-chart')` with real DOM element adds `.demo-spotlight-active` class
- [ ] `clearSpotlight()` removes `.demo-spotlight-active` from all elements
- [ ] `buildNavigateDemoStep()` importable and logs stub without errors
- [ ] `[▶ Start Guided Demo]` button renders; click calls `startDemo()` stub (logs, no navigation)

**Presentation Mode (R3):**
- [ ] Presentation Mode toggle (Maximize2/Minimize2 icon) renders in GlobalHeader
- [ ] Clicking toggle sets `presentationMode: true`; root div gains `presentation-mode` class
- [ ] In Presentation Mode: `ResetDemoButton` is `display: none` (not just invisible)
- [ ] In Presentation Mode: sidebar collapses to 64px icon-only (labels hidden)
- [ ] In Presentation Mode: phone frame has `scale(1.05)` zoom without horizontal overflow
- [ ] Toggling off restores all elements and removes zoom

**Loading Skeletons (R4):**
- [ ] `SkeletonKPICard` renders pulsing grey blocks matching KPI card height
- [ ] `SkeletonTable` with `rows={6}` renders 6 pulsing row placeholders
- [ ] `SkeletonDetailPanel` renders gauge placeholder + content block placeholders
- [ ] `SkeletonChart` renders pulsing rectangle at specified height
- [ ] `useSimulatedLoad(800)` returns `true` for ~800ms then switches to `false`
- [ ] All skeletons use the `.skeleton` CSS class (pulse animation)

**Combined:**
- [ ] `npm run dev` starts without errors; all 8 routes render without crashing
- [ ] Both contexts (`AppContext`, `DemoContext`) importable from any screen
- [ ] Tailwind tokens and Inter font load correctly

### 7. Risks & Implementation Notes

**R1 — React Router:**
- **Risk**: Direct URL to `/borrower/fetch` means `selectedBank` is null. B4 must default to State A — not crash. Guard: `const b4State = demoForcedBank === 'YES_BANK' ? 'retry' : selectedBank === 'YES_BANK' ? 'retry' : selectedBank === 'SBI' ? 'slow' : 'success';`
- **Risk**: `useNavigate()` cannot be called outside `<BrowserRouter>`. Provider order must be: `<AppContext> → <DemoContext> → <BrowserRouter>`.
- **Note**: Use `<Navigate replace>` for all default redirects to prevent them appearing in browser history.
- **Note**: Vite serves SPAs correctly by default — no extra config for `npm run dev` or `npm run preview`.

**R2 — Demo Foundation:**
- **Note**: `useDemoTarget` is the correct pattern for all M1–M5 screens — do not add `data-demo-id` manually.
- **Note**: Keep `demoNavHandlers.js` as a stub in M0 — it only needs to be importable without errors.

**R3 — Presentation Mode:**
- **Note**: Use CSS classes exclusively — not React state in child components — for all presentation mode overrides.
- **Note**: Test `scale(1.05)` at actual demo resolution (1920×1080 projector) to verify no horizontal overflow.

**R4 — Loading Skeletons:**
- **Risk**: Skeleton and real component height mismatch causes layout shift. Measure real component height and match it in the skeleton's root div.
- **Note**: `useSimulatedLoad` replays on every component remount — intentional for demo realism.

---

## Milestone 1 — Borrower Flow: Happy Path (B1 → B2 → B3 → B4 State A → B5)

**Estimated Effort**: 2–2.5 days
**Depends on**: Milestone 0

### 1. Objective
Build all 5 borrower screens for the standard happy-path flow: Ananya selects HDFC Bank, completes the OTP flow, the fetch succeeds, and she reaches the success screen. This covers States A and C of B4 (Success and Slow Fetch). The downtime/retry path (B4 State B) is added in Milestone 2.

### 2. Screens Included

| Screen | Flow Trigger |
|--------|-------------|
| B1 — Loan Application Home | Default borrower screen |
| B2 — Pre-Consent Trust Screen | Click "Link Bank via Account Aggregator" on B1 |
| B3 — AA Consent & Bank Discovery | Click "Agree & Link Bank" on B2 |
| B4 — Fetch Status (State A: Success, State C: Slow) | OTP approved on B3 for non-Yes-Bank selection |
| B5 — Application Success | Auto-advance from B4 after fetch completes |

### 3. Components Required

#### Screen-Level Components

| Component | Key Responsibilities |
|-----------|---------------------|
| `B1_LoanHome.jsx` | Loan slider (₹10k–₹5L, step ₹5k), tenure pill toggle (6/12/18/24 mo), live EMI calculation display, primary CTA button |
| `B2_TrustScreen.jsx` | Slide-up modal overlay on B1, 4 animated info cards (staggered 150ms), trust badge with glow, two CTAs |
| `B3_BankDiscovery.jsx` | AA portal header ("Secured by Sahamati"), masked phone number, bank search input, 6-bank grid, OTP modal, OTP countdown timer, "Approve Data Share" CTA |
| `B4_FetchStatus.jsx` | State-driven component: reads `selectedBank` from context; renders State A, B, or C accordingly |
| `B5_Success.jsx` | Animated checkmark, loan summary card, EWS notice card, "Go to Dashboard" non-functional CTA with toast |

#### Shared Sub-components (built in this milestone)

| Component | Used In | Purpose |
|-----------|---------|---------|
| `StepProgressDots` | PhoneFrame wrapper | 5 hollow/filled dots showing current borrower step |
| `BankCard` | B3 | Single bank card (logo placeholder, name, StatusBadge) |
| `StatusBadge` | B3 | Coloured pill: Online (green), Slow (yellow), Down (red) |
| `OTPModal` | B3 | 4-digit input overlay; any 4 digits accepted (no real validation) |
| `FetchStepItem` | B4 | Single animated step row (icon, label, status) |
| `ResetDemoButton` | Below PhoneFrame | Calls `setBorrowerScreen('B1')` and clears `selectedBank` |

### 4. Mock Data Dependencies

| Data | Source | Used In |
|------|--------|---------|
| Bank list (name, status) | `banks.js` — `BANKS` array | B3 bank grid |
| Bank selection → B4 state | `selectedBank` in context | B4 state branching logic |
| EMI formula | Hardcoded constants in B1 | `P × r × (1+r)^n / ((1+r)^n - 1)`, r = 0.015 |
| Loan summary for B5 | Read from B1 slider state via context or pass-through | B5 loan summary card |

**B4 State Branching Logic (frontend only):**
```js
const getB4State = (selectedBank) => {
  if (selectedBank === 'YES_BANK') return 'retry';        // State B — M2
  if (selectedBank === 'SBI')      return 'slow';         // State C
  return 'success';                                        // State A (default)
};
```

**Fetch animation timing:**
- State A: Each step unlocks every 1,500ms; auto-navigate to B5 after step 4 + 500ms pause
- State C: Step 2 takes 6,000ms; Steps 1,3,4 = 1,500ms each; SBI warning banner shown during step 2

### 5. Navigation Dependencies (R1)

| Transition | Trigger | Router Action |
|------------|---------|---------------|
| B1 → B2 | Click "Link Bank via Account Aggregator" | `navigate('/borrower/trust')` |
| B2 → B3 | Click "Agree & Link Bank" | `navigate('/borrower/discovery')` |
| B2 → B1 | Click "Cancel" | `navigate('/borrower/home')` |
| B3 → B4 | OTP entered + "Approve Data Share" clicked | `setSelectedBank(bank.id)` then `navigate('/borrower/fetch')` |
| B3 → B1 | Click "Cancel Handoff" | `setSelectedBank(null)` then `navigate('/borrower/home')` |
| B4 → B5 | Auto-advance after fetch animation completes | `navigate('/borrower/success')` inside `setTimeout` |
| "Reset Demo" (any screen) | Click button below phone frame | `setSelectedBank(null)` then `navigate('/borrower/home', { replace: true })` |

**Direct URL guard in B4 (R1 edge case):**
```js
// selectedBank null = user navigated directly to /borrower/fetch; default to State A
const b4State = demoForcedBank === 'YES_BANK' ? 'retry'
              : selectedBank === 'YES_BANK'   ? 'retry'
              : selectedBank === 'SBI'        ? 'slow'
              : 'success'; // null or any other value → safe default
```

**Demo target registration in B2 (R2):**
```jsx
const trustCardsRef = useDemoTarget('trust-cards');
<div ref={trustCardsRef} className="..."> {/* 4 info cards */} </div>
```

**StepProgressDots derivation (no context needed, R1):**
```js
const STEP_ROUTES = [
  '/borrower/home', '/borrower/trust', '/borrower/discovery',
  '/borrower/fetch', '/borrower/success'
];
const { pathname } = useLocation();
const activeStep = STEP_ROUTES.findIndex(r => r === pathname); // 0–4
```

### 6. Acceptance Criteria
- [ ] B1 renders with loan slider defaulting to ₹80,000; EMI card shows ₹7,400/month
- [ ] Dragging B1 slider recalculates EMI in real time using the specified formula
- [ ] Clicking tenure pill (6/12/18/24) updates EMI correctly for all 4 values
- [ ] Clicking "Link Bank" navigates to B2 with slide-up animation
- [ ] B2 shows all 4 info cards animating in with 150ms stagger; trust badge glows green
- [ ] Clicking "Cancel" on B2 returns to B1
- [ ] B3 renders as a distinct AA-styled screen (not LendWell branded)
- [ ] Bank search filters the grid client-side; typing "HDF" shows only HDFC Bank
- [ ] HDFC/ICICI/Axis/BOB show green badge; SBI shows yellow; Yes Bank shows red
- [ ] Clicking a bank shows OTP modal; entering any 4 digits enables "Approve Data Share"
- [ ] OTP timer counts down from 60; "Resend OTP" text appears at 0 (no real action)
- [ ] Selecting HDFC + approving: B4 State A renders with 4 steps animating every 1.5s
- [ ] Selecting SBI + approving: B4 State C renders; step 2 takes 6s with SBI warning banner
- [ ] After all B4 steps complete: auto-navigates to B5
- [ ] B5 shows success checkmark animation, loan summary (₹80k/12mo/₹7,400), EWS notice card
- [ ] "Go to Dashboard" on B5 shows a toast: "This would navigate to your loan dashboard in the live app."
- [ ] 5-dot progress indicator updates correctly at each screen transition
- [ ] "Reset Demo" button below phone frame resets to B1 at any screen

### 7. Risks & Implementation Notes
- **Risk**: EMI formula can produce floating point noise. Use `Math.round()` on the output and format with `toLocaleString('en-IN')` for Indian number formatting (₹7,400 not ₹7400).
- **Risk**: B4 step animation uses `setTimeout` chains. Store all timeout IDs in a `useRef` and clear them in `useEffect` cleanup to prevent state updates on unmounted components.
- **Note**: B3's OTP modal must be built as a state flag (`showOTP: bool`) local to B3, not in global context. It only matters within B3's lifecycle.
- **Note**: The OTP input should accept exactly 4 digits then auto-focus each box left-to-right. Use 4 separate `<input maxLength={1}>` elements with `onKeyUp` forwarding focus.
- **Note**: B2's slide-up animation should use `transition: transform 250ms ease-out` from `translateY(100%)` to `translateY(0)`. Implement with Tailwind's `translate-y-full` → `translate-y-0` class toggle.
- **Note**: B4's `selectedBank` from context determines which state to show. This must be set in B3 before navigating to B4 (i.e., `setSelectedBank(bank.id)` is called simultaneously with `setBorrowerScreen('B4')`).

---

## Milestone 2 — Borrower Flow: Smart Retry Path (B4 State B)

**Estimated Effort**: 1 day
**Depends on**: Milestone 1

### 1. Objective
Build B4 State B — the downtime and smart retry experience for Yes Bank selection. This is the most important demo moment for the "Smart Retry Recovery" pitch (Demo Scenario 3 and Guided Demo Step 3).

### 2. Screens Included
- **B4 — Fetch Status, State B only** (Yes Bank Downtime / Smart Retry)
- No new full screens — this is an additional state of B4

### 3. Components Required

| Component | File | Purpose |
|-----------|------|---------|
| `RetryCountdown` | `borrower/RetryCountdown.jsx` | Animated countdown from 15 to 0, then triggers auto-retry |
| `RetryNudgeCard` | `borrower/RetryNudgeCard.jsx` | "We recover 92% of failures..." reassurance card |
| `ErrorBanner` | `borrower/ErrorBanner.jsx` | Red icon + "Yes Bank servers are temporarily unavailable" message |

These are rendered conditionally inside `B4_FetchStatus.jsx` when `b4State === 'retry'`.

**State B UI structure (inside B4):**
```
ErrorBanner          → "Yes Bank servers are temporarily unavailable"
ExplanationCard      → "This is a temporary bank-side issue. Your data and application are safe."
RetryCountdown       → "Retrying automatically in 15s..." (live JS countdown)
RetryNudgeCard       → "We recover 92% of temporary failures within 30 seconds."
[Try Again Now]      → Primary button: resets countdown, triggers State A animation → B5
[Cancel Application] → Small text link: setBorrowerScreen('B1'), setSelectedBank(null)
```

**Countdown mechanics:**
```js
// useEffect in RetryCountdown
const timer = setInterval(() => {
  setCount(prev => {
    if (prev <= 1) {
      clearInterval(timer);
      handleAutoRetry(); // triggers State A animation → B5
    }
    return prev - 1;
  });
}, 1000);
```
- "Try Again Now" button: `clearInterval(timer)`, call `handleAutoRetry()`
- `handleAutoRetry()`: transitions B4 to an intermediate "retrying" state (shows State A steps briefly at 750ms intervals), then auto-navigates to B5

**Demo Mode Hook (required for Milestone 6):**
- B4 must check `demoForcedBank` from context: if `demoForcedBank === 'YES_BANK'`, always render State B regardless of `selectedBank`
- This allows Guided Demo Step 3 to force the retry UX without requiring the user to navigate B3 first

### 4. Mock Data Dependencies
- `selectedBank` from context — only `YES_BANK` triggers State B
- `demoForcedBank` from context — override for Guided Demo Mode (M6)
- Static string constants (no dataset needed): error message, recovery rate (92%), retry delay (15s)

### 5. Navigation Dependencies (R1)

| Transition | Trigger | Router Action |
|------------|---------|---------------|
| B3 (Yes Bank) → B4 State B | "Approve Data Share" with Yes Bank selected | `setSelectedBank('YES_BANK')` then `navigate('/borrower/fetch')` |
| B4 State B → B5 | Auto-retry or "Try Again Now" | State A animation plays → `navigate('/borrower/success')` |
| B4 State B → B1 | "Cancel Application" | `setSelectedBank(null)` then `navigate('/borrower/home')` |

**Demo target registration in B4 (R2):**
```jsx
// Apply to retry countdown widget container when in State B
const retryWidgetRef = useDemoTarget('retry-widget');
{b4State === 'retry' && (
  <div ref={retryWidgetRef} className="..."> {/* countdown + nudge */} </div>
)}
```

### 6. Acceptance Criteria
- [ ] Selecting Yes Bank on B3 and approving renders B4 in State B (error + countdown)
- [ ] Red error icon and "Yes Bank servers are temporarily unavailable" message renders
- [ ] Countdown timer counts from 15 to 0 visually (1 second intervals)
- [ ] "We recover 92%..." nudge card is visible throughout the countdown
- [ ] At countdown = 0: auto-retry triggers; State A step animation plays; navigates to B5
- [ ] "Try Again Now" button: cancels countdown immediately and triggers same retry → B5 flow
- [ ] "Cancel Application" navigates to B1 and clears bank selection
- [ ] B4 cleanup: all `setInterval`/`setTimeout` IDs are cleared on component unmount
- [ ] When `demoForcedBank === 'YES_BANK'` in context: B4 renders State B regardless of `selectedBank` (required for M6 Guided Demo)

### 7. Risks & Implementation Notes
- **Risk**: Multiple timers (countdown interval + retry animation timeouts) can leak if the component unmounts mid-countdown (e.g., user switches to Lender Mode). Store all IDs in `useRef` arrays and clear all in `useEffect` cleanup.
- **Note**: The "retrying" intermediate state (between "Try Again Now" click and B5) should play the State A steps at a faster 750ms interval rather than 1,500ms, to maintain momentum and feel immediate.
- **Note**: Build the `demoForcedBank` check now — it's a one-line conditional in the state-determination logic. Not doing so means M6 will require reopening this component.

---

## Milestone 3 — Lender Portal: Executive Dashboard (L1)

**Estimated Effort**: 2.5–3 days
**Depends on**: Milestone 0

### 1. Objective
Build the L1 Executive Performance & Funnel Dashboard — the landing screen for the Lender Portal. This is the primary B2B demo screen for the "Revenue Impact Pitch" (Scenario 2 and Guided Demo Steps 1 & 6).

### 2. Screens Included
- **L1 — Executive Performance & Funnel Dashboard** (full screen)

### 3. Components Required

#### Layout
| Component | Purpose |
|-----------|---------|
| `L1_Dashboard.jsx` | Root screen component; lays out KPI strip, funnel, calculator, trend chart sections |

#### Section 1 — KPI Strip
| Component | Purpose |
|-----------|---------|
| `KPICard.jsx` | Reusable: accepts `{ label, value, trend, trendDirection, color }` props |

4 instances rendered from `METRICS.baseline`:
```
Monthly Applicants: 1,00,000 | neutral
Consent Rate: 55% | ▼ -5% MoM | red
Approval Rate: 30% | ▼ Thin-File Segment | red
Monthly Disbursals: ₹12.6 Cr | neutral
```

#### Section 2 — Interactive Conversion Funnel
| Component | Purpose |
|-----------|---------|
| `FunnelChart.jsx` | SVG or Recharts `FunnelChart`; 5 stages with hover tooltips |
| `FunnelStage.jsx` | Single stage bar; renders volume, label, conversion % |
| `LeakAnnotation.jsx` | Red dashed arrow + "₹1.125 Cr wasted CAC — 45,000 lost users/month" label on the Consent stage |

**Funnel data (hardcoded from METRICS):**
```js
const FUNNEL_STAGES = [
  { label: 'Applicants Arrived',   volume: 100000, conversion: null },
  { label: 'Consent Approved',     volume: 55000,  conversion: 55,  leak: true },
  { label: 'Statement Fetched',    volume: 46750,  conversion: 85  },
  { label: 'Underwriting Assessed',volume: 14025,  conversion: 30  },
  { label: 'Disbursed',            volume: 12600,  conversion: 90  },
];
```
- Hovering a stage shows a tooltip with volume and conversion %
- The Consent Approved stage renders with a red left border and a flashing alert badge
- `LeakAnnotation` sits below the Consent bar with a dashed red line

#### Section 3 — Revenue Lift Calculator
| Component | Purpose |
|-----------|---------|
| `RevenueCalculator.jsx` | Container for sliders + output |
| `RangeSlider.jsx` | Tailwind-styled `<input type="range">` with label and % value display |
| `RevenueOutput.jsx` | Shows baseline, projected, and lift values — updates on slider change |
| `ScenarioButton.jsx` | Reusable preset button ("Q1 Target", "Q2 Target", "Reset Baseline") |

**Revenue Formula (pure JS function — no backend):**
```js
export const calcRevenue = (consentRate, approvalRate) => {
  const MONTHLY_APPLICANTS = 100000;
  const FETCH_RATE = 0.85;
  const AVG_LOAN_VALUE = 80000;
  const PLATFORM_FEE_PCT = 0.005;

  const approvedLoans = MONTHLY_APPLICANTS * consentRate * FETCH_RATE * approvalRate;
  const monthlyRevenue = approvedLoans * AVG_LOAN_VALUE * PLATFORM_FEE_PCT;
  const annualRevenue = monthlyRevenue * 12;
  return { approvedLoans, monthlyRevenue, annualRevenue };
};

export const calcLift = (newConsent, newApproval) => {
  const baseline = calcRevenue(0.55, 0.30);
  const projected = calcRevenue(newConsent, newApproval);
  return projected.annualRevenue - baseline.annualRevenue;
};
```

**Slider state (local to `RevenueCalculator.jsx`):**
```js
const [consentRate, setConsentRate] = useState(0.55); // 50%–90%
const [approvalRate, setApprovalRate] = useState(0.30); // 25%–50%
```

**Preset Button Actions:**
```
"Q1 Target"     → setConsentRate(0.65), setApprovalRate(0.33)
"Q2 Target"     → setConsentRate(0.70), setApprovalRate(0.38)
"Reset Baseline"→ setConsentRate(0.55), setApprovalRate(0.30)
```

**Output Display:**
- Baseline Annual Revenue: `calcRevenue(0.55, 0.30).annualRevenue` formatted as `₹X.XX Cr`
- Projected Annual Revenue: `calcRevenue(consentRate, approvalRate).annualRevenue` — updates live
- Revenue Lift: `calcLift(consentRate, approvalRate)` — shown in emerald green, bold
- All currency values formatted: `(value / 10000000).toFixed(2) + ' Cr'`

#### Section 4 — Performance Trend Chart
| Component | Purpose |
|-----------|---------|
| `TrendChart.jsx` | Recharts `LineChart` with 3 lines; toggle between Baseline and Optimized datasets |
| `TrendToggle.jsx` | Two-button toggle: "Baseline" / "With LendWell Intelligence" |

**Trend data from `METRICS.trendData`:**
- X-axis: `['Jan','Feb','Mar','Apr','May','Jun']`
- Lines: Consent Rate, Approval Rate, Delinquency Rate
- "Baseline" mode: shows `consentRateBaseline`, `approvalRateBaseline`, `delinquencyBaseline`
- "With LendWell Intelligence" mode: shows `consentRateOptimized`, `approvalRateOptimized`, `delinquencyOptimized`
- Toggle switches which dataset is passed to `LineChart` — no animation required, instant swap

**Demo Mode Hook (for M6):**
- `RevenueCalculator` must expose a ref method `setSliderValues(consent, approval)` OR read from context if demo is controlling sliders
- Simplest approach: if `demoActive && demoStep === 5` (Step 6, Revenue Impact), scroll the calculator into view using `ref.current.scrollIntoView()`

### 4. Mock Data Dependencies

| Data | Source | Used In |
|------|--------|---------|
| `monthlyApplicants`, `consentRate`, `fetchSuccessRate`, `approvalRate`, `disbursalConversionRate` | `METRICS.baseline` | KPI cards, funnel stages |
| `months`, `consentRateBaseline`, `consentRateOptimized`, etc. | `METRICS.trendData` | Trend chart |
| Revenue formula constants | Hardcoded in `calcRevenue()` | Revenue calculator |

### 5. Navigation Dependencies (R1)
- L1 renders when browser is at `/lender/dashboard`
- `<NavLink to="/lender/dashboard">` in `LenderSidebar` handles navigation; no custom handler needed
- Default route: `<Route index element={<Navigate to="dashboard" />}>` inside `/lender` parent
- Guided Demo Steps 1 and 6: `navigate('/lender/dashboard')` called in M6

**Loading Skeleton integration (R4) — add to L1_Dashboard.jsx:**
```jsx
const loadingKPIs   = useSimulatedLoad(600);
const loadingFunnel = useSimulatedLoad(800);
const loadingTrend  = useSimulatedLoad(900);
const loadingCalc   = useSimulatedLoad(500);

// KPI strip:
{loadingKPIs
  ? Array(4).fill(0).map((_, i) => <SkeletonKPICard key={i} />)
  : KPI_DATA.map(kpi => <KPICard key={kpi.label} {...kpi} />)}
// Charts:
{loadingFunnel ? <SkeletonChart height={280} /> : <FunnelChart />}
{loadingTrend  ? <SkeletonChart height={220} /> : <TrendChart />}
{loadingCalc   ? <SkeletonChart height={180} /> : <RevenueCalculator />}
```

**Demo target registration (R2) — add to L1_Dashboard.jsx:**
```jsx
const funnelRef = useDemoTarget('funnel-chart');
const calcRef   = useDemoTarget('revenue-calculator');
<div ref={funnelRef}><FunnelChart /></div>
<div ref={calcRef}><RevenueCalculator /></div>
```

### 6. Acceptance Criteria
- [ ] L1 renders with dark navy background and 4 KPI cards at the top
- [ ] KPI cards show correct values: 1,00,000 applicants, 55% consent (red), 30% approval (red), ₹12.6 Cr disbursals
- [ ] Funnel renders 5 stages with correct volumes; Consent Approved stage has red leak indicator
- [ ] Hovering any funnel stage shows a tooltip with volume number and conversion %
- [ ] Red annotation below Consent stage reads "₹1.125 Cr wasted CAC — 45,000 lost users/month"
- [ ] Revenue calculator defaults to 55% consent / 30% approval
- [ ] Dragging Consent slider to 75% updates Projected Revenue and Revenue Lift in real time (no lag)
- [ ] "Q1 Target" preset snaps sliders to 65%/33% and updates outputs
- [ ] "Q2 Target" preset snaps sliders to 70%/38% and updates outputs
- [ ] "Reset Baseline" restores 55%/30%
- [ ] Revenue Lift is displayed in emerald green; negative lift (if slider goes below baseline) shows in red
- [ ] Trend chart renders with 6 months on X-axis; 3 lines (Consent, Approval, Delinquency)
- [ ] Toggle between "Baseline" and "With LendWell Intelligence" swaps datasets instantly
- [ ] "With LendWell Intelligence" lines show uplift from March onward (matching `METRICS.trendData`)
- [ ] **R4**: KPI cards show skeleton pulse for ~600ms on first L1 load, then real data — no layout shift
- [ ] **R4**: Funnel chart shows skeleton rect for ~800ms then SVG funnel renders
- [ ] **R4**: Trend chart shows skeleton for ~900ms then Recharts LineChart renders
- [ ] **R4**: Revenue calculator shows skeleton for ~500ms then sliders and output appear

### 7. Risks & Implementation Notes
- **Risk**: Recharts `FunnelChart` component may not support custom tooltip and annotation easily. Consider building the funnel as a custom SVG using `<svg>` with trapezoid `<polygon>` shapes — gives full control over the leak annotation placement.
- **Risk**: Revenue formula with floating point: always use `parseFloat((value).toFixed(2))` before display to avoid `₹4.534200000002 Cr`.
- **Note**: The Revenue Calculator sliders use `<input type="range" step="0.01">` for 1% granularity. Display the label as `Math.round(value * 100) + '%'`.
- **Note**: The "Revenue Lift" output should display `+₹X.XX Cr` (with explicit `+` sign). If lift is 0 or negative, display `₹X.XX Cr` without the `+`.
- **Note**: Trend chart tooltip should show the month name and all 3 metric values on hover — use Recharts `<Tooltip>` with a custom `content` render prop.

---

## Milestone 4 — Lender Portal: Observability Console (L2)

**Estimated Effort**: 2 days
**Depends on**: Milestone 0

### 1. Objective
Build the L2 FIP & Consent Observability Console — the screen for PM Rohan Dev to attribute failure causes by bank and view smart retry ROI. This is the demo screen for Guided Demo Step 4 and Demo Scenario 3's follow-up.

### 2. Screens Included
- **L2 — FIP & Consent Observability Console** (full screen)

### 3. Components Required

#### Layout
| Component | Purpose |
|-----------|---------|
| `L2_Observability.jsx` | Root screen; two-column grid layout |

#### Section 1 — Failure Taxonomy Heatmap
| Component | Purpose |
|-----------|---------|
| `FailureHeatmap.jsx` | 5×5 grid (5 failure types × 5 banks); cell colour based on value |
| `HeatmapCell.jsx` | Individual cell: renders %, applies Tailwind bg colour based on intensity thresholds |
| `HeatmapTooltip.jsx` | Hover tooltip: "This failure type caused X drop-offs this month." |

**Cell colour thresholds:**
```
< 5%  → bg-surface (neutral)
5–15% → bg-amber/20 (mild warning)
> 15% → bg-coral/30 (red-orange alert)
```
Values are hardcoded from PRD §10 L2 failure breakdown table.

#### Section 2 — Bank-wise Performance Table
| Component | Purpose |
|-----------|---------|
| `BankTable.jsx` | Sortable table; renders all 6 banks from `BANKS` dataset |
| `BankTableRow.jsx` | Single row with expandable sub-row |
| `BankSubRow.jsx` | Expanded detail: sparkline placeholder, last incident text, recommended action |
| `SortableHeader.jsx` | Column header with sort arrow; toggles asc/desc on click |

**Sorting (client-side only):**
```js
const [sortKey, setSortKey] = useState('monthlyFailures');
const [sortDir, setSortDir] = useState('desc');

const sorted = [...BANKS].sort((a, b) => 
  sortDir === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
);
```

**Row styling rules:**
- `consentSuccessRate < 75`: red left border (`border-l-4 border-coral`)
- Status badge uses `StatusBadge` shared component from M1 (Online/Latency/Down)
- Clicking a row toggles `expandedBankId` local state to show/hide `BankSubRow`

**Expanded sub-row content (static per bank from BANKS data):**
```
- Sparkline: simplified div-based bar chart (3 bars representing last 3 hours) — use static mock values, not a charting lib
- Last incident: e.g., "Last incident: 3 hours ago"
- Recommended action: e.g., "Enable smart retry with 15s backoff for this FIP"
```

#### Section 3 — Smart Retry Recovery Widget
| Component | Purpose |
|-----------|---------|
| `RetryRecoveryWidget.jsx` | Bold stat card; circular progress ring at 92%; top 3 recovery events |
| `CircularProgress.jsx` | SVG circle with stroke-dashoffset animation; reusable |
| `RecoveryEventRow.jsx` | Single row: "SBI OTP retry — 4,200 recovered" |

**Circular progress ring:**
```
SVG: r=54, circumference=2πr≈339
stroke-dasharray: 339
stroke-dashoffset: 339 × (1 - 0.92) = 27.12
```
Values from hardcoded stats: Total 66,600 failed; 26,170 recovered; rate = 92%.

### 4. Mock Data Dependencies

| Data | Source | Used In |
|------|--------|---------|
| `BANKS` array (all 6 records) | `banks.js` | Bank table, sortable columns |
| `failureBreakdown` per bank | `BANKS[n].failureBreakdown` | Heatmap cell values |
| `consentSuccessRate`, `fetchLatencySeconds`, `monthlyFailures`, `status`, `primaryIssue` | `BANKS[n]` | Table columns |
| Recovery stats (66,600 / 26,170 / 92%) | Hardcoded constants in `RetryRecoveryWidget` | Widget stats |
| Top 3 recovery events | Hardcoded strings in component | Recovery event rows |

### 5. Navigation Dependencies (R1)
- L2 renders when browser is at `/lender/observability`
- `<NavLink to="/lender/observability">` in `LenderSidebar` handles navigation
- Guided Demo Step 4: `navigate('/lender/observability')` called in M6
- No internal navigation within L2

**Loading Skeleton integration (R4) — add to L2_Observability.jsx:**
```jsx
const loadingMain  = useSimulatedLoad(700);
const loadingRetry = useSimulatedLoad(600);
{loadingMain  ? <SkeletonTable rows={5} /> : <FailureHeatmap />}
{loadingMain  ? <SkeletonTable rows={6} /> : <BankTable />}
{loadingRetry ? <SkeletonChart height={200} /> : <RetryRecoveryWidget />}
```

**Demo target registration (R2) — add to L2_Observability.jsx:**
```jsx
const bankTableRef = useDemoTarget('bank-table');
<div ref={bankTableRef}><BankTable /></div>
```

### 6. Acceptance Criteria
- [ ] Heatmap renders 5 rows × 5 bank columns with correct percentage values
- [ ] Cells with >15% values have red-orange background; cells <5% are neutral
- [ ] Hovering a heatmap cell shows a tooltip (e.g., "FIP Unavailable caused 38% drop-offs at Yes Bank this month")
- [ ] Bank table renders all 6 banks with correct data from `BANKS`
- [ ] Clicking column header sorts table ascending/descending by that column (client-side)
- [ ] Rows with `consentSuccessRate < 75` have red left border (SBI and Yes Bank)
- [ ] Clicking a bank row expands a sub-row with simplified sparkline, incident time, recommended action
- [ ] Clicking the same row again collapses the sub-row
- [ ] Only one row can be expanded at a time
- [ ] Recovery widget shows 92% rate with circular progress ring (visually ~92% filled)
- [ ] Top 3 recovery events listed below the ring with correct bank names and volumes
- [ ] "₹1.05 Cr" revenue saved stat is displayed in the widget
- [ ] **R4**: Heatmap and bank table show skeleton for ~700ms on first L2 load
- [ ] **R4**: Retry recovery widget shows skeleton for ~600ms then circular ring renders
- [ ] **R4**: Navigating away from L2 and back replays the skeleton delays

### 7. Risks & Implementation Notes
- **Risk**: The sparkline in the expanded bank sub-row is complex to implement with Recharts for such a small space. Use 3 plain `<div>` bars with variable heights (based on static hardcoded hourly values) — avoids a library dependency for a decorative element.
- **Note**: The heatmap percentage values must be sourced from `BANKS[n].failureBreakdown` object. Map `userAbandoned`, `consentDenied`, `fipUnavailable`, `accountDiscoveryFailed`, `otpTimeout` to the 5 row labels.
- **Note**: `sortKey` for latency column should be `'fetchLatencySeconds'` (numeric), not the display string "2.1s". Never sort by display strings.
- **Note**: The circular progress SVG must use `stroke-linecap: round` for a polished look. The ring should be animated on mount using a CSS `transition` on `stroke-dashoffset`.

---

## Milestone 5 — Lender Portal: Underwriting Workbench (L3)

**Estimated Effort**: 3 days
**Depends on**: Milestone 0

### 1. Objective
Build the L3 Underwriting Queue and BSA Case Detail panel — the most complex screen in the prototype. This is the primary demo surface for the "Explainability Pitch" (Scenario 1 and Guided Demo Step 5), and also surfaces the active EWS alert (Guided Demo Step 5 follow-up).

### 2. Screens Included
- **L3 — Underwriting Workbench** (full screen, split-panel layout)
  - Left: Application Queue with filter tabs
  - Right: BSA Case Detail Panel (slide-in on row click)
    - Tab 1: BSA Signals
    - Tab 2: EWS Guardrails (with active alert for Mohammed Siddiqui)

### 3. Components Required

#### Layout
| Component | Purpose |
|-----------|---------|
| `L3_Underwriting.jsx` | Root screen; manages `selectedApplicantId` + panel open/close state (also in context) |

#### Queue Panel (Left 50%)
| Component | Purpose |
|-----------|---------|
| `ApplicantQueue.jsx` | Queue container; renders filter tabs + table |
| `FilterTabs.jsx` | 6 tabs with counts; applies filter to `APPLICANTS` array |
| `ApplicantTable.jsx` | Table with correct columns; rows are clickable |
| `ApplicantRow.jsx` | Single applicant row; highlights on hover; shows BSA score colour (green/amber/red by range) |
| `RecommendationBadge.jsx` | Coloured pill: "Auto-Approve" (green), "Approve + EWS" (emerald), "Manual Review" (amber), "Reject" (red) |

**Filter Tab Logic (client-side):**
```js
const FILTERS = {
  'All':            () => true,
  'Auto-Approve':   a => a.recommendation === 'Auto-Approve',
  'Approved':       a => a.status === 'approved',
  'Manual Review':  a => a.recommendation === 'Manual Review',
  'Declined':       a => a.status === 'declined',
  'Thin-File':      a => a.cibil === -1,
};
// Counts:
// All(8), Auto-Approve(2), Approved(1), Manual Review(3), Declined(1), Thin-File(4)
```

**BSA Score colour coding:**
```
score ≥ 75 → text-emerald (green)
score 50–74 → text-amber (yellow)
score < 50  → text-coral (red)
```

#### Case Detail Panel (Right 50% — slide-in)
| Component | Purpose |
|-----------|---------|
| `CaseDetailPanel.jsx` | Slide-in container; close [×] button; renders tab switcher + active tab content |
| `TabSwitcher.jsx` | Reusable tab component (2 tabs: BSA Signals / EWS Guardrails) |
| `BSASignalsTab.jsx` | Full BSA explainability view for selected applicant |
| `EWSGuadrailsTab.jsx` | Individual rules (Sub-section A) + Portfolio summary (Sub-section B) with active alert |

**Inside `BSASignalsTab.jsx`:**
| Sub-component | Purpose |
|---------------|---------|
| `ApplicantHeader` | Name, type, CIBIL, loan amount, tenure |
| `CircularGauge` | SVG gauge 0–100; score from `applicant.bsaScore`; label from `applicant.bsaLabel` |
| `IncomeBlock` | Avg inflow, consistency, source |
| `SurplusBlock` | Avg surplus, trend |
| `AffordabilityBlock` | EMI amount, EMI-to-income %, safe/unsafe indicator |
| `BounceClassifier` | Count, severity badge, classification string |
| `ReasonCodeList` | Renders `reasonsPositive[]` (green ✅) and `reasonsRisk[]` (amber ⚠️) as card list |
| `ActionPanel` | 3 buttons: Approve with EWS, Decline, Flag for Manual Review — each calls `showToast()` |

**Inside `EWSGuadrailsTab.jsx`:**
| Sub-component | Purpose |
|---------------|---------|
| `IndividualRules` | Shows 3 trigger rules, monitoring frequency, last check, alert status for selected applicant |
| `PortfolioSummary` | Always-visible summary of all 4 EWS enrolled borrowers |
| `PortfolioTable` | 4 rows; Mohammed Siddiqui row has `🔴 High Alert` badge and "[Review Account]" |
| `ActiveAlertCard` | Expanded inline below Mohammed's row by default; shows all alert detail fields |
| `AlertActionButtons` | "Flag for Outreach" + "Escalate to Credit Team" — each calls `showToast()` |

**`ActiveAlertCard` data (from `EWS_PORTFOLIO`):**
```
Borrower: Mohammed Siddiqui (APP-004)
Severity: High
Type: Income Drop Detected
Triggered Rule: Rule 1
Detail: Income ₹32,000 vs avg ₹68,000 — drop of 53%
Last EMI: Paid on time
Next EMI: 3rd of next month — ₹7,800
Balance: ₹18,200 vs avg ₹32,000
Action: Review Account
```

**Demo Mode Hook (for M6):**
- `CaseDetailPanel` must expose an imperative `open(applicantId)` and `setTab(tab)` that the demo engine can call
- Simplest approach: `openCaseDetail('APP-001')` and `switchCaseTab('bsa-signals')` from context; L3 reads these context values and keeps the panel in sync

### 4. Mock Data Dependencies

| Data | Source | Used In |
|------|--------|---------|
| All 8 applicants | `APPLICANTS` from `applicants.js` | Queue, filter tabs, case detail |
| `reasonsPositive`, `reasonsRisk` per applicant | `APPLICANTS[n]` | `ReasonCodeList` |
| `bsaScore`, `bsaLabel`, `income`, `surplus`, `bounce`, `emiAffordability` | `APPLICANTS[n]` | BSA Signals tab |
| `ewsStatus`, `ewsAlerts` per applicant | `APPLICANTS[n]` | EWS sub-section A |
| EWS portfolio (4 borrowers + active alert) | `EWS_PORTFOLIO` from `ews.js` | EWS sub-section B |

### 5. Navigation Dependencies (R1)

| Transition | Trigger | Mechanism |
|------------|---------|----------|
| Navigate to L3 | Sidebar or Demo Step 5 | `navigate('/lender/underwriting')` |
| Open Case Detail | Click any applicant row | `openCaseDetail(applicant.id)` in AppContext |
| Close Case Detail | Click [×] button | `openCaseDetail(null)` |
| Switch tabs | Click tab | `switchCaseTab('bsa-signals' or 'ews')` |
| Queue stays visible | Clicking different row while panel open | Updates `selectedApplicantId`; panel does not close |
| Direct URL to L3 | `/lender/underwriting` typed in browser | Renders queue; no case open (`selectedApplicantId: null`) |
| Guided Demo Step 5 | `navigateDemoStep(4)` in M6 | `navigate('/lender/underwriting')` + `openCaseDetail('APP-001')` + `switchCaseTab('bsa-signals')` |

**Loading Skeleton integration (R4) — add to L3_Underwriting.jsx:**
```jsx
const loadingQueue = useSimulatedLoad(750);
{loadingQueue ? <SkeletonTable rows={8} /> : <ApplicantQueue />}

// Panel skeleton — triggers on each new row click:
const [panelLoading, setPanelLoading] = useState(false);
const prevId = useRef(null);
useEffect(() => {
  if (selectedApplicantId && selectedApplicantId !== prevId.current) {
    setPanelLoading(true);
    const t = setTimeout(() => setPanelLoading(false), 500);
    prevId.current = selectedApplicantId;
    return () => clearTimeout(t);
  }
}, [selectedApplicantId]);
{panelLoading ? <SkeletonDetailPanel /> : <ActiveTabContent applicant={selectedApplicant} />}
```

**Demo target registration (R2) — add to CaseDetailPanel.jsx:**
```jsx
const gaugeRef = useDemoTarget('bsa-gauge');
<div ref={gaugeRef}><CircularGauge score={applicant.bsaScore} /></div>
```

### 6. Acceptance Criteria
- [ ] L3 renders as a split-screen: left queue, right empty (no applicant selected)
- [ ] All 6 filter tabs render with correct counts: All(8), Auto-Approve(2), Approved(1), Manual Review(3), Declined(1), Thin-File(4)
- [ ] Clicking "Thin-File" tab shows only APP-001, APP-002, APP-005, APP-008
- [ ] Clicking "Auto-Approve" tab shows APP-003 and APP-004
- [ ] Clicking "Declined" tab shows APP-002 and APP-008
- [ ] BSA score colour coding: green ≥75, amber 50–74, red <50 — verified on multiple rows
- [ ] Clicking any applicant row slides in the Case Detail panel from the right (250ms ease-out)
- [ ] Case detail defaults to BSA Signals tab
- [ ] Selecting Ananya Sen (APP-001): gauge shows 78/100, correct income/surplus/bounce/reason codes rendered
- [ ] Selecting Deepak Joshi (APP-008): gauge shows 34/100, red; 7 bounces; negative surplus shown
- [ ] Clicking a different row while panel is open updates content without closing the panel
- [ ] Clicking [×] closes the panel; queue returns to full width
- [ ] "Approve with EWS" button shows toast: "✅ [Name] approved. EWS monitoring activated."
- [ ] "Decline" button shows toast: "❌ [Name] declined."
- [ ] "Flag for Manual Review" shows toast: "📋 [Name] flagged for manual review."
- [ ] EWS Guardrails tab: Sub-section A shows correct rules for selected applicant
- [ ] EWS Guardrails tab: Sub-section B always shows portfolio table with 4 enrollees
- [ ] Mohammed Siddiqui row shows 🔴 High Alert badge and "[Review Account]" link
- [ ] Active Alert Card is visible by default, expanded below Mohammed's row
- [ ] Alert detail fields are correct: 53% drop, ₹32k vs ₹68k, ₹18,200 balance
- [ ] "Flag for Outreach" and "Escalate to Credit Team" buttons each trigger toast notifications
- [ ] AppContext `openCaseDetail('APP-001')` and `switchCaseTab('bsa-signals')` work (required for M6)
- [ ] **R4**: Queue shows skeleton (8 rows) for ~750ms on first L3 load
- [ ] **R4**: Clicking a row shows `SkeletonDetailPanel` for ~500ms before BSA content renders
- [ ] **R4**: Clicking a different row replays 500ms skeleton → content cycle

### 7. Risks & Implementation Notes
- **Risk**: The `CircularGauge` SVG must scale the score 0–100 to `stroke-dashoffset`. The formula is: `offset = circumference × (1 - score/100)`. Verify with score=78 → offset should be ~74 (for circumference 339).
- **Risk**: `EWSGuadrailsTab` Sub-section B (portfolio summary) must render for ALL applicants, not just the selected one. The data comes from `EWS_PORTFOLIO` (the EWS dataset), not `APPLICANTS`. Do not filter this table by `selectedApplicantId`.
- **Note**: The `ActiveAlertCard` is always visible expanded by default. Do not make it collapsible — it is the centerpiece of the EWS demo narrative.
- **Note**: `ReasonCodeList` must handle an empty `reasonsRisk` array gracefully (for APP-003 Priya Sharma who has no risk signals). Show a subtle "No risk signals identified." placeholder.
- **Note**: The queue table must scroll independently if the list overflows. Apply `overflow-y-auto max-h-[calc(100vh-200px)]` to the queue container.
- **Note**: Build `CircularGauge` as a standalone reusable component — it will be a visual showpiece and may need adjustment. Keep all SVG values (radius, stroke-width) as constants at the top of the file for easy tuning.

---

## Milestone 6 — Guided Demo Mode

**Estimated Effort**: 1.5–2 days
**Depends on**: Milestones 0–5 (all screens must exist)

### 1. Objective
Build the 6-step Guided Demo overlay that allows a presenter to walk stakeholders through the prototype narrative from a single button click, with spotlight highlighting on key UI elements at each step.

### 2. Screens Included
No new screens. The demo overlay renders on top of existing screens and drives navigation to:
- Step 1 → L1 (funnel chart spotlight)
- Step 2 → B2 (trust cards spotlight)
- Step 3 → B4 State B (smart retry spotlight)
- Step 4 → L2 (bank table spotlight)
- Step 5 → L3 with APP-001 case open, BSA tab (gauge + reason codes spotlight)
- Step 6 → L1 (revenue calculator spotlight)

### 3. Components Required

| Component | File | Purpose |
|-----------|------|---------|
| `GuidedDemoOverlay.jsx` | `demo/GuidedDemoOverlay.jsx` | Root demo component; renders backdrop + floating card |
| `DemoBackdrop.jsx` | `demo/DemoBackdrop.jsx` | Full-screen `rgba(0,0,0,0.6)` overlay |
| `DemoCard.jsx` | `demo/DemoCard.jsx` | 320px floating card with step counter, title, description, Back/Next/Exit |
| `DemoProgressBar.jsx` | `demo/DemoProgressBar.jsx` | "Step N of 6" bar at the top of DemoCard |
| `SpotlightTarget.jsx` | `demo/SpotlightTarget.jsx` | Wraps a target element with the CSS spotlight effect |
| `DEMO_STEPS` config | `demo/demoSteps.js` | Array of 6 step definition objects |

**`demoSteps.js` Structure:**
```js
export const DEMO_STEPS = [
  {
    index: 0,
    title: "The ₹1.125 Crore Monthly Problem",
    description: "Every month, 45,000 applicants abandon...",
    navigate: { mode: 'lender', screen: 'L1' },
    spotlightTargetId: 'funnel-chart',       // data-demo-id on the target element
    cardPosition: 'bottom-right',             // where to anchor the floating card
    sideEffects: [],
  },
  {
    index: 1,
    title: "Why Users Drop Off — And How We Fix It",
    description: "The drop-off isn't about intent...",
    navigate: { mode: 'borrower', screen: 'B2' },
    spotlightTargetId: 'trust-cards',
    cardPosition: 'right',
    sideEffects: [],
  },
  {
    index: 2,
    title: "We Recover 92% of Bank Failures",
    description: "When a bank FIP is down...",
    navigate: { mode: 'borrower', screen: 'B4' },
    spotlightTargetId: 'retry-widget',
    cardPosition: 'top',
    sideEffects: ['SET_FORCED_BANK_YES_BANK'],
  },
  {
    index: 3,
    title: "Know Exactly Which Bank is Failing — and Why",
    description: "Our Observability Console...",
    navigate: { mode: 'lender', screen: 'L2' },
    spotlightTargetId: 'bank-table',
    cardPosition: 'top-right',
    sideEffects: ['CLEAR_FORCED_BANK'],
  },
  {
    index: 4,
    title: "Approve Thin-File Borrowers — With Confidence",
    description: "Ananya has no bureau score...",
    navigate: { mode: 'lender', screen: 'L3' },
    spotlightTargetId: 'bsa-gauge',
    cardPosition: 'left',
    sideEffects: ['OPEN_CASE_APP001', 'SWITCH_TAB_BSA'],
  },
  {
    index: 5,
    title: "Quantify the Upside — Live",
    description: "This isn't just a UX improvement...",
    navigate: { mode: 'lender', screen: 'L1' },
    spotlightTargetId: 'revenue-calculator',
    cardPosition: 'top-left',
    sideEffects: [],
  },
];
```

**Spotlight Implementation:**

Add `data-demo-id="[id]"` attribute to each target element during M1–M5 build. In M6:
```js
// When demo step changes:
const target = document.querySelector(`[data-demo-id="${step.spotlightTargetId}"]`);
target.style.position = 'relative';
target.style.zIndex = '1001';
target.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.6)';

// When step changes or demo exits:
target.style.boxShadow = '';
target.style.zIndex = '';
```

> [!IMPORTANT]
> During M1–M5, every spotlight target element MUST have its `data-demo-id` attribute applied. Required IDs:
> - `data-demo-id="funnel-chart"` — on the funnel chart container in L1
> - `data-demo-id="trust-cards"` — on the 4-card container in B2
> - `data-demo-id="retry-widget"` — on the Smart Retry countdown widget in B4
> - `data-demo-id="bank-table"` — on the bank performance table in L2
> - `data-demo-id="bsa-gauge"` — on the BSA score gauge container in L3 Case Detail
> - `data-demo-id="revenue-calculator"` — on the Revenue Lift Calculator widget in L1

**Side Effect Handlers in `navigateDemoStep()`:**
```js
const handleSideEffects = (effects) => {
  effects.forEach(effect => {
    if (effect === 'SET_FORCED_BANK_YES_BANK') setDemoForcedBank('YES_BANK');
    if (effect === 'CLEAR_FORCED_BANK')        setDemoForcedBank(null);
    if (effect === 'OPEN_CASE_APP001')         openCaseDetail('APP-001');
    if (effect === 'SWITCH_TAB_BSA')           switchCaseTab('bsa-signals');
  });
};
```

**`buildNavigateDemoStep()` — full implementation (R1 + R2):**
```js
// demo/demoNavHandlers.js — fully implemented in M6 (replaces M0 stub)
import { DEMO_STEPS } from './demoSteps';
import { applySpotlight, clearSpotlight } from './spotlightUtils';

export const buildNavigateDemoStep = ({ navigate, appContext, demoContext }) => {
  return (index) => {
    if (index < 0 || index >= DEMO_STEPS.length) return;
    const step = DEMO_STEPS[index];

    // 1. Clear previous spotlight
    clearSpotlight();

    // 2. Navigate to target route (React Router — R1)
    navigate(step.route);

    // 3. Apply side effects
    step.sideEffects.forEach(effect => {
      if (effect === 'SET_FORCED_BANK_YES_BANK') demoContext.setDemoForcedBank('YES_BANK');
      if (effect === 'CLEAR_FORCED_BANK')        demoContext.setDemoForcedBank(null);
      if (effect === 'OPEN_CASE_APP001')         appContext.openCaseDetail('APP-001');
      if (effect === 'SWITCH_TAB_BSA')           appContext.switchCaseTab('bsa-signals');
      if (effect === 'SCROLL_TO_CALCULATOR') {
        const el = document.querySelector('[data-demo-id="revenue-calculator"]');
        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    });

    // 4. Apply spotlight after route renders
    // Double requestAnimationFrame: first fires before paint, second after layout
    // More reliable than setTimeout(50) for waiting on React route render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => applySpotlight(step.spotlightTargetId));
    });

    // 5. Update step index in DemoContext
    demoContext.setDemoStep(index);
  };
};
```

**GuidedDemoOverlay wiring:**
```jsx
// demo/GuidedDemoOverlay.jsx
const navigate = useNavigate();   // R1: real router navigate
const appContext = useAppContext();
const demoContext = useDemoContext();
const navigateDemoStep = buildNavigateDemoStep({ navigate, appContext, demoContext });
// ... use navigateDemoStep in Next/Back button handlers
```

### 4. Mock Data Dependencies
- `DEMO_STEPS` config array (hardcoded in `demoSteps.js`) — no datasets required
- All datasets used in spotlighted screens must already be loaded (they are, from M1–M5)

### 5. Navigation Dependencies (R1)

| Demo Action | Mechanism |
|-------------|----------|
| Click "▶ Start Guided Demo" | `startDemo()` in DemoContext → `navigateDemoStep(0)` → `navigate('/lender/dashboard')` |
| Click "Next →" | `navigateDemoStep(demoStep + 1)` → `navigate(step.route)` |
| Click "← Back" | `navigateDemoStep(demoStep - 1)` → `navigate(step.route)` |
| Click "✕ Exit Demo" | `exitDemo()` → `clearSpotlight()`, reset DemoContext state |
| Step 0 | `navigate('/lender/dashboard')` |
| Step 1 | `navigate('/borrower/trust')` |
| Step 2 | `navigate('/borrower/fetch')` + `setDemoForcedBank('YES_BANK')` |
| Step 3 | `navigate('/lender/observability')` + `setDemoForcedBank(null)` |
| Step 4 | `navigate('/lender/underwriting')` + `openCaseDetail('APP-001')` + `switchCaseTab('bsa-signals')` |
| Step 5 | `navigate('/lender/dashboard')` + scroll calculator into view |
| Browser Back during demo | React Router handles natively; demo overlay stays; spotlight may be stale (acceptable for prototype) |

### 6. Acceptance Criteria
- [ ] "▶ Start Guided Demo" button in header opens the demo overlay at Step 1
- [ ] Demo backdrop (`rgba(0,0,0,0.6)`) covers the entire screen
- [ ] Floating card shows: "Step 1 of 6", title, description, [← Back] (disabled at step 1), [Next →], [✕ Exit Demo]
- [ ] Progress bar shows "Step 1 of 6" correctly
- [ ] Step 1: app navigates to L1; funnel chart element is spotlit (box-shadow cutout visible)
- [ ] Step 2: app switches to Borrower Mode, navigates to B2; trust cards spotlit
- [ ] Step 3: app navigates to B4; `demoForcedBank` = YES_BANK causes B4 to render State B (retry); retry widget spotlit
- [ ] Step 4: app switches to Lender Mode, navigates to L2; `demoForcedBank` cleared; bank table spotlit
- [ ] Step 5: app navigates to L3; APP-001 case detail opens automatically; BSA Signals tab is active; gauge spotlit
- [ ] Step 6: app navigates to L1; revenue calculator spotlit; "Step 6 of 6" shows in card
- [ ] [Next →] on Step 6 is disabled (last step)
- [ ] [← Back] on Step 1 is disabled (first step)
- [ ] [✕ Exit Demo] at any step: overlay dismissed, spotlight cleared, `demoForcedBank` cleared, user left on current screen
- [ ] After exiting demo, all screens are fully interactive in non-demo mode
- [ ] Starting demo again from step 1 works correctly after a previous exit

### 7. Risks & Implementation Notes
- **Risk**: Double-rAF (`requestAnimationFrame` × 2) waits for React route render + layout before applying spotlight. If the spotlit element is rendered asynchronously (e.g., inside a skeleton delay), the rAF may still be too early. In that case, add a `useEffect` in the target component that calls `applySpotlight` when `demoStep` matches and the element is mounted.
- **Risk**: The `.demo-spotlight-active` `box-shadow` spotlight requires the target element not to be clipped by an `overflow: hidden` ancestor. Check each target element's ancestor chain in DevTools if spotlight doesn't appear correctly.
- **Note**: `useDemoTarget` hook (built in M0) handles `data-demo-id` registration — do not add the attribute manually anywhere in M1–M5. The hook also removes the attribute on unmount, preventing stale targets.
- **Note**: The `DemoCard` position (`top`, `bottom-right`, etc.) per step may need pixel-level tweaking during M7 polish. Use fixed `top`/`left` pixel coordinates in the card's inline style — simpler than CSS `position: absolute` relative to the target.
- **Note**: Back navigation always re-runs `navigateDemoStep(index)` which re-applies all side effects for that step — including `SET_FORCED_BANK_YES_BANK` on Step 2. This is correct and intentional.

---

## Milestone 7 — Polish, Integration & Cross-Milestone Verification

**Estimated Effort**: 1–1.5 days
**Depends on**: Milestones 1–6 (all complete)

### 1. Objective
Verify cross-milestone integration, fix edge cases, apply animation polish, test all demo scenarios end-to-end, and ensure the prototype is demo-ready.

### 2. Screens Included
All 8 screens (B1–B5, L1–L3) + Guided Demo overlay — review and polish only, no new screens.

### 3. Components Required (Polish Only)

| Item | What to Verify / Polish |
|------|------------------------|
| Mode switch memory | Switching from L3 back to Borrower Mode restores last borrower route (not always /home) |
| `Toast` positioning | Toast appears top-right, does not overlap the global header |
| B4 timer cleanup | Navigating away from `/borrower/fetch` mid-countdown clears all timers |
| B4 Re-entry | Returning to `/borrower/fetch` resets timer state cleanly |
| L3 panel close | [×] closes panel; queue re-expands to full width (no layout shift) |
| L3 Filter tab counts | Verify all 6 counts are correct against 8 APPLICANTS records |
| EMI formula | Test all 4 tenures (6/12/18/24) and a few loan amounts against expected EMI |
| Revenue formula | Verify baseline; verify Q1 and Q2 presets produce expected lift |
| Demo spotlight cleanup | Exiting demo clears `.demo-spotlight-active` from all elements |
| Demo back navigation | Backing Step 3→2 re-applies `SET_FORCED_BANK_YES_BANK`; B4 shows retry state |
| **R1** URL safety | Direct `/borrower/fetch` with null selectedBank defaults to State A — no crash |
| **R1** Browser back/forward | Back after B1→B2→B3 returns correctly; lender sidebar matches URL |
| **R1** No legacy state nav | Zero `setBorrowerScreen`/`setLenderScreen` calls in codebase (grep verification) |
| **R2** Demo target registration | All 6 `data-demo-id` in DOM during demo navigation (DevTools Elements check) |
| **R2** Spotlight cleanup | Exit demo at any step; zero `.demo-spotlight-active` elements remain |
| **R3** Presentation mode | 1920×1080 test: sidebar icon-only, phone zoomed, Reset button hidden, no overflow |
| **R3** Toggle persistence | Presentation mode state retained across Borrower/Lender mode switches |
| **R4** Skeleton dimensions | No layout shift: skeleton and real component heights within 8px of each other |
| **R4** Skeleton replay | Navigate away from L1/L2/L3 and back — loading skeleton replays correctly |
| **R4** Panel skeleton replay | Every new L3 row click triggers 500ms skeleton → content transition |
| Accessibility: focus rings | All interactive elements show `:focus-visible` ring |
| Accessibility: tap targets | All buttons/links in phone simulator have min 48×48px hit area |
| Typography | Inter loaded; no system font fallback visible in demo |

### 4. End-to-End Demo Scenario Tests

Run each full scenario from start to finish:

| Scenario | Test Path |
|----------|-----------|
| **Scenario 1** — Explainability Pitch | L3 → filter "Thin-File" → click Ananya Sen → read BSA tab → click Approve → verify toast → click EWS tab → verify alert card |
| **Scenario 2** — Revenue Impact | L1 → drag consent to 75% → verify lift output → click Q2 Target → verify → click Reset |
| **Scenario 3** — Downtime Recovery | B3 → select Yes Bank → approve → B4 State B → click "Try Again Now" → B5 success |
| **Scenario 4** — Trust Building | B1 → click "Link Bank" → B2 → read cards → cancel → B1 restored |
| **Guided Demo** | Header → Start Guided Demo → Steps 1–6 → Exit at step 4 → verify interactive mode restored |
| **Full Borrower Flow** | B1 → B2 → B3 (HDFC) → B4 State A → B5 → Switch to Lender → L3 → click Ananya |

### 5. Acceptance Criteria
- [ ] All 6 demo scenarios complete without errors or unexpected navigation
- [ ] Guided Demo all 6 steps navigate correctly and spotlight correct elements
- [ ] Mode toggle correctly shows the appropriate viewport
- [ ] Switching Lender → Borrower restores the last Borrower route visited
- [ ] All toasts auto-dismiss after 3 seconds and do not stack
- [ ] No `console.error` messages during any demo scenario
- [ ] No Tailwind class not found warnings in dev console
- [ ] Phone frame renders at exactly 375px width; does not stretch or overflow
- [ ] App is usable at 1280px+ browser width (minimum for Lender Portal demo)
- [ ] `npm run build` completes without errors (production build passes)
- [ ] **R1**: Fresh browser tab at `/lender/underwriting` renders L3 correctly (no crash)
- [ ] **R1**: Browser back/forward works across all borrower and lender route changes
- [ ] **R1**: `grep -r "setBorrowerScreen\|setLenderScreen" src/` returns zero matches
- [ ] **R2**: All 6 `data-demo-id` attributes present in DOM during guided demo walkthrough
- [ ] **R2**: Zero `.demo-spotlight-active` elements after demo exit (DevTools check)
- [ ] **R2**: No "Demo target not found" warnings in console during full guided demo
- [ ] **R3**: Presentation Mode: sidebar is 64px icons-only; Reset button is `display:none`
- [ ] **R3**: Presentation Mode phone frame `scale(1.05)` has no horizontal scrollbar at 1280px+
- [ ] **R3**: Toggling Presentation Mode on/off at all 8 screens produces no visual glitch
- [ ] **R4**: Every lender screen shows skeleton state on initial render
- [ ] **R4**: Skeleton heights within 8px of real component heights (DevTools measurement)
- [ ] **R4**: L3 case detail panel skeleton replays on every new applicant row selection

### 6. Risks & Implementation Notes
- **Note**: Run `npm run build` at the end of each milestone, not just the final one, to catch dead imports and missing exports early.
- **Note**: Test in Chrome and Edge before the demo. Tailwind JIT compilation may behave slightly differently in production build — run `npm run preview` to test the production build locally.
- **Risk**: If any screen has a `useEffect` that fires on mount and depends on context values (e.g., B4 starting the animation immediately on mount), switching modes and back might re-trigger the animation. Gate with an `isMounted` ref or check that the screen is genuinely visible before starting timers.
- **Note**: Final demo checklist — verify before handing off to stakeholders:
  - Default landing is Borrower Mode, B1
  - LendWell branding correct in header
  - No placeholder text ("Lorem ipsum", "TODO") visible anywhere
  - All 8 applicant records show correct data in L3
  - Revenue baseline: `calcRevenue(0.55, 0.30).annualRevenue` should be ≈ ₹1.39 Cr/year (verify before demo)

---

## Milestone Summary

| # | Milestone | Key Deliverable | Effort |
|---|-----------|-----------------|--------|
| 0 | Foundation | Scaffold + React Router + data layer + AppContext + DemoContext + Demo foundation (R2) + Presentation Mode (R3) + Skeleton library (R4) | **2–2.5 days** |
| 1 | Borrower (Happy Path) | B1→B5 with React Router navigation; `useDemoTarget` on B2 trust cards | 2–2.5 days |
| 2 | Borrower (Retry Path) | B4 State B; `demoForcedBank` from DemoContext; `useDemoTarget` on retry widget | 1 day |
| 3 | Lender L1 | Executive Dashboard with loading skeletons; `useDemoTarget` on funnel + calculator | 2.5–3 days |
| 4 | Lender L2 | Observability Console with loading skeletons; `useDemoTarget` on bank table | 2 days |
| 5 | Lender L3 | Underwriting Workbench with panel skeleton; `useDemoTarget` on BSA gauge | 3 days |
| 6 | Guided Demo | Full `buildNavigateDemoStep` with React Router + double-rAF spotlight; DemoOverlay UI | 1.5–2 days |
| 7 | Polish & Integration | R1–R4 verification + E2E scenarios + build verification | 1.5–2 days |
| **Total** | | | **~16–18 days** |

### Dependency Graph

```
M0 (Foundation + Router + Demo Foundation + Presentation Mode + Skeletons)
├── M1 (Borrower Happy Path — router navigate, useDemoTarget on B2)
│   └── M2 (Borrower Retry Path — DemoContext.demoForcedBank, useDemoTarget on B4)
├── M3 (L1 Dashboard — skeletons, useDemoTarget on funnel + calculator)
├── M4 (L2 Observability — skeletons, useDemoTarget on bank table)
└── M5 (L3 Underwriting — panel skeleton, useDemoTarget on BSA gauge)
    │
    └── M6 (Guided Demo — buildNavigateDemoStep, full overlay UI)
        │
        └── M7 (Polish & Integration — R1–R4 verification)
```

> [!TIP]
> M3, M4, M5 remain fully parallelisable after M0. Skeleton components are available from M0. M1 and M2 are also parallelisable with M3–M5.

> [!IMPORTANT]
> Every screen in M1–M5 must call `useDemoTarget(id)` on its spotlight element — NOT manually set `data-demo-id`. The hook is built in M0 and available immediately. Required registrations:
> - **M1 / B2**: `useDemoTarget('trust-cards')` on 4-card container
> - **M2 / B4**: `useDemoTarget('retry-widget')` on retry countdown widget (State B)
> - **M3 / L1**: `useDemoTarget('funnel-chart')` on funnel; `useDemoTarget('revenue-calculator')` on calculator widget
> - **M4 / L2**: `useDemoTarget('bank-table')` on bank table container
> - **M5 / L3**: `useDemoTarget('bsa-gauge')` on gauge container inside CaseDetailPanel
