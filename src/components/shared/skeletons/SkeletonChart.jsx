// Skeleton placeholder for chart areas
// Props: height (px, default 280)
export default function SkeletonChart({ height = 280 }) {
  return (
    <div
      className="skeleton w-full rounded-card"
      style={{ height: `${height}px` }}
    />
  )
}
