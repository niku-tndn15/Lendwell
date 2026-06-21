// Skeleton placeholder for B4 fetch progress steps (4 steps)
export default function SkeletonProgressStep() {
  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton w-8 h-8 rounded-full shrink-0" />
          <div className="skeleton h-3 rounded flex-1" style={{ maxWidth: `${70 + i * 5}%` }} />
        </div>
      ))}
    </div>
  )
}
