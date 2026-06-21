import { useEffect, useRef } from 'react'

// Registers a DOM element as a spotlight target for the Guided Demo.
// Usage: const ref = useDemoTarget('funnel-chart')
//        <div ref={ref}>...</div>
//
// Sets data-demo-id on mount; removes it on unmount.
// All M1–M5 spotlight elements MUST use this hook — never set data-demo-id manually.
export const useDemoTarget = (demoId) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.setAttribute('data-demo-id', demoId)
    return () => {
      if (el) el.removeAttribute('data-demo-id')
    }
  }, [demoId])

  return ref
}
