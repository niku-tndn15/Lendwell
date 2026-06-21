// Skeleton placeholder matching a table with N rows
// Props: rows (default 6)
export default function SkeletonTable({ rows = 6 }) {
  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex gap-4 px-4 py-3 border-b border-white/8">
        {[40, 70, 50, 60, 45].map((w, i) => (
          <div key={i} className={`skeleton h-3 rounded`} style={{ width: `${w}px` }} />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3.5 border-b border-white/5 items-center">
          {[48, 80, 55, 65, 40].map((w, j) => (
            <div key={j} className={`skeleton h-3 rounded`} style={{ width: `${w}px`, opacity: 1 - i * 0.08 }} />
          ))}
        </div>
      ))}
    </div>
  )
}
