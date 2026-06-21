// Skeleton placeholder matching KPICard dimensions
export default function SkeletonKPICard() {
  return (
    <div className="bg-surface rounded-card p-5 flex flex-col gap-3 border border-white/5">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-7 w-32 rounded" />
      <div className="skeleton h-3 w-20 rounded" />
    </div>
  )
}
