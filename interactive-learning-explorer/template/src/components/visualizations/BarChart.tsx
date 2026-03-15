interface Bar {
  label: string
  value: number
  color?: string
}

export default function BarChart({ data, color }: { data: Record<string, unknown>; color: string }) {
  const bars = (data.bars ?? []) as Bar[]
  const unit = (data.unit ?? '') as string
  const maxValue = (data.maxValue ?? Math.max(...bars.map(b => b.value), 1)) as number

  return (
    <div>
      {unit && <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{unit}</p>}

      <div className="flex items-end gap-2 h-40">
        {bars.map((b, i) => {
          const c = b.color || color
          const heightPct = (b.value / maxValue) * 100

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              {/* Value label */}
              <span className="text-[11px] font-semibold" style={{ color: c }}>
                {b.value}
              </span>

              {/* Bar */}
              <div
                className="w-full rounded-t-md transition-all duration-700 ease-out min-h-[4px]"
                style={{
                  height: `${heightPct}%`,
                  background: `linear-gradient(to top, ${c}, ${c}cc)`,
                }}
              />

              {/* Label */}
              <span className="text-[10px] text-muted-foreground text-center mt-1 leading-tight">
                {b.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
