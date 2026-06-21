import { createContext, useCallback, useContext, useRef, useState } from 'react'

const AppContext = createContext(null)

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }) {
  // R1: Route memory for mode-switching
  const [lastBorrowerPath, setLastBorrowerPath] = useState('/borrower/home')
  const [lastLenderPath, setLastLenderPath]     = useState('/lender/dashboard')

  // B1 loan state — persisted so B5 can display the correct summary
  const [loanAmount, setLoanAmount] = useState(80000)
  const [loanTenure, setLoanTenure] = useState(12)
  const [loanEmi, setLoanEmi]       = useState(7400)

  // B3 bank selection — read by B4 for state branching
  // Stores bank.id from banks.js ('BANK_03' = SBI, 'BANK_05' = Yes Bank, etc.)
  const [selectedBank, setSelectedBank] = useState(null)

  // L3 case detail panel
  const [selectedApplicantId, setSelectedApplicantId] = useState(null)
  const [activeCaseTab, setActiveCaseTab]              = useState('bsa-signals')

  // Toast — { text: string, type: 'success'|'error'|'info'|'warning' } | null
  const [toastMessage, setToastMessage] = useState(null)
  const toastTimerRef = useRef(null)

  // R3: Presentation Mode
  const [presentationMode, setPresentationMode] = useState(false)

  // ── Actions ──────────────────────────────────────────────────────────────

  const setLoanState = useCallback(({ amount, tenure, emi }) => {
    setLoanAmount(amount)
    setLoanTenure(tenure)
    setLoanEmi(emi)
  }, [])

  const showToast = useCallback((text, type = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage({ text, type })
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000)
  }, [])

  const clearToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage(null)
  }, [])

  const openCaseDetail = useCallback((id) => {
    setSelectedApplicantId(id)
  }, [])

  const switchCaseTab = useCallback((tab) => {
    setActiveCaseTab(tab)
  }, [])

  const updateLastPath = useCallback((mode, path) => {
    if (mode === 'borrower') setLastBorrowerPath(path)
    else setLastLenderPath(path)
  }, [])

  return (
    <AppContext.Provider value={{
      // Route memory
      lastBorrowerPath,
      lastLenderPath,
      updateLastPath,

      // Loan state (set by B1, read by B5)
      loanAmount,
      loanTenure,
      loanEmi,
      setLoanState,

      // Bank selection (set by B3, read by B4)
      selectedBank,
      setSelectedBank,

      // L3 case detail
      selectedApplicantId,
      openCaseDetail,
      activeCaseTab,
      switchCaseTab,

      // Toast
      toastMessage,
      showToast,
      clearToast,

      // Presentation Mode
      presentationMode,
      setPresentationMode,
    }}>
      {children}
    </AppContext.Provider>
  )
}
