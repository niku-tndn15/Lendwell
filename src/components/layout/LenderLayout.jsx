import { Activity, ClipboardList, LayoutDashboard } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const NAV_ITEMS = [
  { to: '/lender/dashboard',     icon: LayoutDashboard, label: 'Executive Dashboard' },
  { to: '/lender/observability', icon: Activity,         label: 'Observability Console' },
  { to: '/lender/underwriting',  icon: ClipboardList,    label: 'Underwriting Workbench' },
]

function LenderSidebar() {
  return (
    <aside className="lender-sidebar shrink-0 w-60 bg-surface border-r border-white/8 flex flex-col py-6 overflow-hidden transition-all duration-200">
      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-4 ${
                isActive
                  ? 'border-emerald bg-white/10 text-text-pri'
                  : 'border-transparent text-text-sec hover:bg-white/5 hover:text-text-pri'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="sidebar-label truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer branding */}
      <div className="mt-auto px-6">
        <div className="text-xs text-text-sec/50 leading-relaxed">
          <div className="font-medium text-text-sec/70">LendWell Intelligence</div>
          <div>Prototype v1.0 Beta</div>
        </div>
      </div>
    </aside>
  )
}

export default function LenderLayout() {
  const { pathname } = useLocation()
  const { updateLastPath } = useAppContext()

  // Track last lender route for mode-switch memory
  useEffect(() => {
    updateLastPath('lender', pathname)
  }, [pathname, updateLastPath])

  return (
    <div className="h-full flex bg-navy text-text-pri">
      <LenderSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
