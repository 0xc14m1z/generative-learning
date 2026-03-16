interface Segment {
  label: string
  value: number
  color?: string
}

export default function CompositionStack({ data, color }: { data: Record<string, unknown>; color: string }) {
  const totalLabel = (data.totalLabel ?? '') as string
  const segments = (data.segments ?? []) as Segment[]
  const unit = (data.unit ?? '') as string

  const total = segments.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) return null

  return (
    <div>
      {totalLabel && (
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{totalLabel}</p>
      )}

      {/* Stacked bar */}
      <div className="flex w-full h-8 rounded-full overflow-hidden">
        {segments.map((seg, i) => {
          const c = seg.color || color
          const widthPct = (seg.value / total) * 100
          return (
            <div
              key={i}
              className="h-full flex items-center justify-center text-[10px] font-semibold text-white transition-all duration-500"
              style={{
                width: `${widthPct}%`,
                background: c,
                minWidth: widthPct > 0 ? '2px' : 0,
              }}
              title={`${seg.label}: ${seg.value}${unit}`}
            >
              {widthPct >= 8 ? `${Math.round(widthPct)}%` : ''}
            </div>
          )
        })}
      </div>

      {/* Labels below */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {segments.map((seg, i) => {
          const c = seg.color || color
          const pct = Math.round((seg.value / total) * 100)
          return (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c }} />
              <span className="text-[11px] text-muted-foreground">
                {seg.label}
                <span className="font-semibold ml-1" style={{ color: c }}>
                  {seg.value}{unit} ({pct}%)
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
