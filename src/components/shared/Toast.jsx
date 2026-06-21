import { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'

const TYPE_STYLES = {
  success: 'bg-emerald text-navy border-emerald/50',
  error:   'bg-coral text-white border-coral/50',
  warning: 'bg-amber text-navy border-amber/50',
  info:    'bg-surface text-text-pri border-white/10',
}

const TYPE_ICONS = {
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  info:    'ℹ️',
}

export default function Toast() {
  const { toastMessage, clearToast } = useAppContext()

  // Auto-dismiss is managed by AppContext.showToast timeout.
  // This effect clears on unmount for safety.
  useEffect(() => {
    return () => {}
  }, [toastMessage])

  if (!toastMessage) return null

  const styles = TYPE_STYLES[toastMessage.type] || TYPE_STYLES.info
  const icon = TYPE_ICONS[toastMessage.type] || TYPE_ICONS.info

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast-enter fixed top-20 right-4 z-50 flex items-start gap-3 px-4 py-3 rounded-card border shadow-xl max-w-sm ${styles}`}
    >
      <span className="text-base leading-none mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium leading-snug">{toastMessage.text}</p>
      </div>
      <button
        onClick={clearToast}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-sm leading-none"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
