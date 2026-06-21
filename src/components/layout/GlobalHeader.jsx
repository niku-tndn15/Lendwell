import { Maximize2, Minimize2, Monitor, Play, Smartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { useDemoContext } from '../../context/DemoContext'
import { useMode } from '../../hooks/useMode'

export default function GlobalHeader() {
  const navigate = useNavigate()
  const mode = useMode()
  const { lastBorrowerPath, lastLenderPath, presentationMode, setPresentationMode } = useAppContext()
  const { startDemo } = useDemoContext()

  const toggleMode = () => {
    if (mode === 'borrower') navigate(lastLenderPath || '/lender/dashboard')
    else navigate(lastBorrowerPath || '/borrower/home')
  }

  return (
    <header className="global-header flex items-center justify-between px-6 py-3 bg-navy border-b border-white/10 shrink-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald flex items-center justify-center text-navy font-bold text-sm">
          LW
        </div>
        <span className="text-text-pri font-semibold text-sm tracking-wide">
          LendWell Intelligence Platform
        </span>
      </div>

      {/* Mode toggle — segmented pill */}
      <div className="flex items-center bg-surface rounded-full p-1 gap-1">
        <button
          onClick={() => mode !== 'borrower' && navigate(lastBorrowerPath || '/borrower/home')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === 'borrower'
              ? 'bg-b-accent text-white'
              : 'text-text-sec hover:text-text-pri'
          }`}
        >
          <Smartphone size={14} />
          <span>Borrower App View</span>
        </button>

        <button
          onClick={() => mode !== 'lender' && navigate(lastLenderPath || '/lender/dashboard')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === 'lender'
              ? 'bg-emerald text-navy'
              : 'text-text-sec hover:text-text-pri'
          }`}
        >
          <Monitor size={14} />
          <span>Lender Portal View</span>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Guided Demo button */}
        <button
          onClick={startDemo}
          className="flex items-center gap-2 px-4 py-2 bg-emerald text-navy rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Play size={13} fill="currentColor" />
          Start Guided Demo
        </button>

        {/* Presentation Mode toggle (R3) */}
        <button
          id="presentation-mode-toggle"
          onClick={() => setPresentationMode(!presentationMode)}
          title={presentationMode ? 'Exit Presentation Mode' : 'Enter Presentation Mode'}
          className="p-2 rounded-lg text-text-sec hover:text-text-pri hover:bg-white/5 transition-colors"
        >
          {presentationMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </header>
  )
}
