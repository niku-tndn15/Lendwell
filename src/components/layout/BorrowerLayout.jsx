import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import PhoneFrame from './PhoneFrame'

// Step routes for the 5-dot progress indicator
const STEP_ROUTES = [
  '/borrower/home',
  '/borrower/trust',
  '/borrower/discovery',
  '/borrower/fetch',
  '/borrower/success',
]

function StepProgressDots({ activeStep }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2 shrink-0">
      {STEP_ROUTES.map((_, i) => (
        <div
          key={i}
          title={['Loan Application', 'Trust & Consent', 'Bank Linking', 'Fetch Progress', 'Success'][i]}
          className={`rounded-full transition-all duration-300 ${
            i === activeStep
              ? 'w-5 h-2 bg-b-accent'
              : i < activeStep
              ? 'w-2 h-2 bg-b-accent/60'
              : 'w-2 h-2 bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function ResetDemoButton() {
  const navigate = useNavigate()
  const { setSelectedBank } = useAppContext()

  const handleReset = () => {
    setSelectedBank(null)
    navigate('/borrower/home', { replace: true })
  }

  return (
    <button
      onClick={handleReset}
      className="reset-demo-btn mt-4 px-4 py-2 text-xs text-text-sec border border-white/10 rounded-full hover:border-white/25 hover:text-text-pri transition-colors"
    >
      ↺ Reset Demo
    </button>
  )
}

export default function BorrowerLayout() {
  const { pathname } = useLocation()
  const { updateLastPath } = useAppContext()

  // Track last borrower route for mode-switch memory
  useEffect(() => {
    updateLastPath('borrower', pathname)
  }, [pathname, updateLastPath])

  const activeStep = STEP_ROUTES.findIndex((r) => r === pathname)

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-950 overflow-auto py-8">
      <PhoneFrame>
        {/* Step progress dots — top of phone content */}
        <StepProgressDots activeStep={activeStep} />

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </PhoneFrame>

      {/* Reset button — outside phone frame */}
      <ResetDemoButton />
    </div>
  )
}
