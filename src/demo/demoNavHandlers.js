import { DEMO_STEPS } from './demoSteps'
import { clearSpotlight, waitAndSpotlight, waitAndScroll } from './spotlightUtils'

// Route-change delay before spotlighting — enough for component mount + render.
// For routes with skeleton loading (L3 uses 850ms), waitAndSpotlight polls until element appears.
const NAV_SETTLE_MS = 350

export const buildNavigateDemoStep = ({ navigate, appContext, demoContext }) => {
  return (index) => {
    const step = DEMO_STEPS[index]
    if (!step) return

    clearSpotlight()

    // Execute state-mutation side effects before navigation so the
    // destination route mounts with the correct initial state.
    for (const effect of step.sideEffects) {
      switch (effect) {
        case 'SET_FORCED_BANK_YES_BANK':
          demoContext.setDemoForcedBank('BANK_05')
          appContext.setSelectedBank('BANK_05')
          break
        case 'CLEAR_FORCED_BANK':
          demoContext.setDemoForcedBank(null)
          appContext.setSelectedBank(null)
          break
        case 'OPEN_CASE_APP001':
          appContext.openCaseDetail('APP-001')
          break
        case 'SWITCH_TAB_BSA':
          appContext.switchCaseTab('bsa-signals')
          break
        case 'SCROLL_TO_CALCULATOR':
          // Handled after navigation settle — element may not exist yet.
          break
        default:
          console.warn(`[Demo] Unknown side effect: ${effect}`)
      }
    }

    navigate(step.route)

    setTimeout(() => {
      waitAndSpotlight(step.spotlightTargetId)

      if (step.sideEffects.includes('SCROLL_TO_CALCULATOR')) {
        waitAndScroll('revenue-calculator')
      }
    }, NAV_SETTLE_MS)
  }
}
