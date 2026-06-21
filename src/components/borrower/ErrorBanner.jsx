export default function ErrorBanner({ bankName }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-red-500 text-lg">🔴</span>
      </div>
      <div>
        <p className="text-sm font-bold text-red-700">Connection Failed</p>
        <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
          {bankName} servers are temporarily unavailable.
        </p>
      </div>
    </div>
  )
}
