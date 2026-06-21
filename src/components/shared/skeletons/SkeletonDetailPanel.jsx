// Skeleton placeholder for BSA Case Detail panel
export default function SkeletonDetailPanel() {
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Applicant header */}
      <div className="flex flex-col gap-2">
        <div className="skeleton h-4 w-48 rounded" />
        <div className="skeleton h-3 w-64 rounded" />
      </div>

      {/* Circular gauge placeholder */}
      <div className="flex justify-center">
        <div className="skeleton w-28 h-28 rounded-full" />
      </div>

      {/* Metric blocks */}
      {[80, 100, 90, 75].map((w, i) => (
        <div key={i} className="bg-surface/50 rounded-card p-4 flex flex-col gap-2">
          <div className="skeleton h-3 rounded" style={{ width: `${w}%` }} />
          <div className="skeleton h-3 rounded w-1/2" />
        </div>
      ))}

      {/* Reason code list */}
      <div className="flex flex-col gap-2">
        {[90, 70, 85, 60].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="skeleton w-4 h-4 rounded" />
            <div className="skeleton h-3 rounded flex-1" style={{ maxWidth: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
