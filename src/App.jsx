import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import { DemoProvider } from './context/DemoContext'
import ErrorBoundary from './components/shared/ErrorBoundary'
import GlobalHeader from './components/layout/GlobalHeader'
import BorrowerLayout from './components/layout/BorrowerLayout'
import LenderLayout from './components/layout/LenderLayout'
import Toast from './components/shared/Toast'
import GuidedDemoOverlay from './demo/GuidedDemoOverlay'
import B1_LoanHome from './screens/borrower/B1_LoanHome'
import B2_TrustScreen from './screens/borrower/B2_TrustScreen'
import B3_BankDiscovery from './screens/borrower/B3_BankDiscovery'
import B4_FetchStatus from './screens/borrower/B4_FetchStatus'
import B5_Success from './screens/borrower/B5_Success'
import L1_Dashboard from './screens/lender/L1_Dashboard'
import L2_Observability from './screens/lender/L2_Observability'
import L3_Underwriting from './screens/lender/L3_Underwriting'

// Inner app — reads presentationMode from context (AppProvider must wrap this)
function AppInner() {
  const { presentationMode } = useAppContext()

  return (
    <div className={`h-screen flex flex-col overflow-hidden${presentationMode ? ' presentation-mode' : ''}`}>
      <BrowserRouter basename="/Lendwell">
        {/* Always-rendered globals */}
        <GlobalHeader />
        <GuidedDemoOverlay />
        <Toast />

        {/* Content area fills remaining height */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/borrower/home" replace />} />

            {/* Borrower flow — nested inside PhoneFrame layout */}
            <Route path="/borrower" element={<BorrowerLayout />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home"      element={<B1_LoanHome />} />
              <Route path="trust"     element={<B2_TrustScreen />} />
              <Route path="discovery" element={<B3_BankDiscovery />} />
              <Route path="fetch"     element={<B4_FetchStatus />} />
              <Route path="success"   element={<B5_Success />} />
            </Route>

            {/* Lender portal — nested inside sidebar layout */}
            <Route path="/lender" element={<LenderLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"     element={<L1_Dashboard />} />
              <Route path="observability" element={<L2_Observability />} />
              <Route path="underwriting"  element={<L3_Underwriting />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/borrower/home" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <DemoProvider>
          <AppInner />
        </DemoProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}
