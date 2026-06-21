import { useLocation } from 'react-router-dom'

// Derives the current mode ('borrower' | 'lender') from the URL.
// Must be called inside <BrowserRouter>.
export const useMode = () => {
  const { pathname } = useLocation()
  return pathname.startsWith('/lender') ? 'lender' : 'borrower'
}
