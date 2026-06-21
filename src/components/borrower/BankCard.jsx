// Bank abbreviation logo colors per bank status
const STATUS_CONFIG = {
  'Online':          { dot: 'bg-green-500',  badge: 'bg-green-50 text-green-700 border-green-200',  label: 'Online'  },
  'Latency Warning': { dot: 'bg-amber-500',  badge: 'bg-amber-50 text-amber-700 border-amber-200',  label: 'Slow'    },
  'Downtime':        { dot: 'bg-red-500',    badge: 'bg-red-50   text-red-700   border-red-200',    label: 'Down'    },
}

const BANK_COLORS = {
  'BANK_01': { bg: 'bg-blue-600',   text: 'text-white', abbr: 'HDFC'  },
  'BANK_02': { bg: 'bg-orange-500', text: 'text-white', abbr: 'ICICI' },
  'BANK_03': { bg: 'bg-blue-900',   text: 'text-white', abbr: 'SBI'   },
  'BANK_04': { bg: 'bg-purple-600', text: 'text-white', abbr: 'AXIS'  },
  'BANK_05': { bg: 'bg-blue-400',   text: 'text-white', abbr: 'YES'   },
  'BANK_06': { bg: 'bg-orange-700', text: 'text-white', abbr: 'BOB'   },
}

export default function BankCard({ bank, selected, onClick }) {
  const cfg    = STATUS_CONFIG[bank.status] || STATUS_CONFIG['Online']
  const colors = BANK_COLORS[bank.id] || { bg: 'bg-gray-500', text: 'text-white', abbr: bank.name.slice(0, 4).toUpperCase() }

  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-col items-center p-3.5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] ${
        selected
          ? 'border-b-accent bg-b-accent/5 shadow-md shadow-b-accent/20'
          : 'border-gray-200 bg-white hover:border-b-accent/40 hover:shadow-sm'
      }`}
    >
      {/* Logo circle */}
      <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center mb-2 shadow-sm`}>
        <span className={`text-xs font-black ${colors.text} tracking-tight`}>{colors.abbr}</span>
      </div>

      {/* Bank name */}
      <p className="text-xs font-semibold text-gray-700 text-center leading-tight mb-1.5 w-full truncate">
        {bank.name}
      </p>

      {/* Status badge */}
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${cfg.badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </div>
    </button>
  )
}
