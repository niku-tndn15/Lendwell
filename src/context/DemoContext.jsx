import { createContext, useCallback, useContext, useState } from 'react'
import { DEMO_STEP_COUNT } from '../demo/demoSteps'
import { clearSpotlight } from '../demo/spotlightUtils'

const DemoContext = createContext(null)

export function useDemoContext() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemoContext must be used within DemoProvider')
  return ctx
}

export function DemoProvider({ children }) {
  const [demoActive, setDemoActive]         = useState(false)
  const [demoStep, setDemoStep]             = useState(0)
  const [demoForcedBank, setDemoForcedBank] = useState(null)
  const [autoPlay, setAutoPlay]             = useState(false)

  // startDemo: sets demoActive + resets to step 0.
  // GuidedDemoOverlay watches [demoActive, demoStep] and executes navigation.
  const startDemo = useCallback(() => {
    setDemoStep(0)
    setDemoActive(true)
  }, [])

  const exitDemo = useCallback(() => {
    clearSpotlight()
    setDemoActive(false)
    setDemoStep(0)
    setDemoForcedBank(null)
    setAutoPlay(false)
  }, [])

  const nextStep = useCallback(() => {
    setDemoStep(prev => {
      if (prev < DEMO_STEP_COUNT - 1) return prev + 1
      return prev
    })
  }, [])

  const prevStep = useCallback(() => {
    setDemoStep(prev => (prev > 0 ? prev - 1 : 0))
  }, [])

  const goToStep = useCallback((index) => {
    if (index >= 0 && index < DEMO_STEP_COUNT) setDemoStep(index)
  }, [])

  return (
    <DemoContext.Provider value={{
      demoActive,
      setDemoActive,
      demoStep,
      setDemoStep,
      demoForcedBank,
      setDemoForcedBank,
      autoPlay,
      setAutoPlay,
      startDemo,
      exitDemo,
      nextStep,
      prevStep,
      goToStep,
    }}>
      {children}
    </DemoContext.Provider>
  )
}
