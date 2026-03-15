interface HeatmapData {
  xLabels: string[]
  yLabels: string[]
  cells: number[][]   // values 0-1, rows × cols
  color: string
  legend?: string
}

function interpolateOpacity(value: number): number {
  return 0.15 + value * 0.85
}

export default function Heatmap({ data, color }: { data: Record<string, unknown>; color: string }) {
  const d = data as unknown as HeatmapData
  const xLabels = d.xLabels ?? []
  const yLabels = d.yLabels ?? []
  const cells = d.cells ?? []
  const c = d.color ?? color

  return (
    <div>
      {d.legend && <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{d.legend}</p>}

      <div className="overflow-x-auto">
        <div className="inline-grid gap-[3px]" style={{
          gridTemplateColumns: `auto repeat(${xLabels.length}, minmax(36px, 1fr))`,
        }}>
          {/* Header row: empty corner + x labels */}
          <div />
          {xLabels.map((label, i) => (
            <div key={`x-${i}`} className="text-[10px] text-muted-foreground text-center pb-1 truncate">
              {label}
            </div>
          ))}

          {/* Data rows */}
          {yLabels.map((yLabel, ri) => (
            <>
              {/* Y label */}
              <div key={`y-${ri}`} className="text-[10px] text-muted-foreground text-right pr-2 flex items-center justify-end">
                {yLabel}
              </div>
              {/* Cells */}
              {(cells[ri] ?? []).map((value, ci) => (
                <div
                  key={`cell-${ri}-${ci}`}
                  className="aspect-square rounded-[4px] min-w-[36px] flex items-center justify-center text-[10px] font-medium"
                  style={{
                    background: c,
                    opacity: interpolateOpacity(Math.max(0, Math.min(1, value))),
                    color: value > 0.5 ? 'white' : 'currentColor',
                  }}
                  title={`${yLabel} × ${xLabels[ci]}: ${Math.round(value * 100)}%`}
                >
                  {value > 0 ? Math.round(value * 100) : ''}
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
