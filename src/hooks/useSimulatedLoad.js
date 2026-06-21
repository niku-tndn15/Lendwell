import { useEffect, useState } from 'react'

// Returns true for `delayMs` milliseconds on mount, then false.
// Replays every time the component mounts (intentional for demo realism).
export const useSimulatedLoad = (delayMs = 750) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])

  return loading
}
