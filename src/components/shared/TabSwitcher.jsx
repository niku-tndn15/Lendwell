// Reusable 2-tab switcher.
// Props:
//   tabs: [{ id: string, label: string }]
//   activeTab: string
//   onChange: (id: string) => void
export default function TabSwitcher({ tabs, activeTab, onChange }) {
  return (
    <div className="flex border-b border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === tab.id
              ? 'border-emerald text-text-pri'
              : 'border-transparent text-text-sec hover:text-text-pri'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
