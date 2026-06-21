export default function RetryNudgeCard() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <span className="text-base">✅</span>
        </div>
        <div>
          <p className="text-sm font-bold text-green-800">
            We recover <span className="text-green-600">92%</span> of temporary failures
          </p>
          <p className="text-xs text-green-700 mt-1 leading-relaxed">
            Our Smart Retry Engine detects bank-side outages and retries automatically.
            Most failures recover within 30 seconds.{' '}
            <strong>Please stay on this page.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
