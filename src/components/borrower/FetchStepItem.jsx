// status: 'pending' | 'loading' | 'done'
export default function FetchStepItem({ icon, label, status }) {
  return (
    <div
      className={`flex items-center gap-4 py-3.5 px-4 rounded-2xl transition-all duration-300 ${
        status === 'done'
          ? 'bg-green-50 border border-green-100'
          : status === 'loading'
          ? 'bg-b-surface border border-b-accent/20'
          : 'bg-gray-50 border border-gray-100'
      }`}
    >
      {/* Status indicator */}
      <div className="w-9 h-9 shrink-0 flex items-center justify-center">
        {status === 'done' && (
          <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center check-scale-in">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9l3.5 3.5L14 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {status === 'loading' && (
          <div className="w-9 h-9 rounded-full border-2 border-gray-200 border-t-b-accent animate-spin" />
        )}
        {status === 'pending' && (
          <div className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
        )}
      </div>

      {/* Icon + Label */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-base">{icon}</span>
        <span
          className={`text-sm font-medium transition-colors duration-300 ${
            status === 'done'
              ? 'text-green-700'
              : status === 'loading'
              ? 'text-gray-800'
              : 'text-gray-400'
          }`}
        >
          {label}
        </span>
      </div>

      {/* Status badge */}
      {status === 'done' && (
        <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
          Done
        </span>
      )}
      {status === 'loading' && (
        <span className="text-[10px] font-semibold bg-b-accent/10 text-b-accent px-2 py-0.5 rounded-full shrink-0">
          Processing…
        </span>
      )}
    </div>
  )
}
