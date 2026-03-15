interface Quadrant {
  label: string
  items: string[]
  color: string
}

interface AxisLabels {
  low: string
  high: string
}

export default function QuadrantMatrix({ data }: { data: Record<string, unknown> }) {
  const axisX = (data.axisX ?? { low: '', high: '' }) as AxisLabels
  const axisY = (data.axisY ?? { low: '', high: '' }) as AxisLabels
  const quadrants = (data.quadrants ?? []) as Quadrant[] // [top-left, top-right, bottom-left, bottom-right]

  const q = (i: number) => quadrants[i] ?? { label: '', items: [], color: '#6366f1' }

  return (
    <div className="relative">
      {/* Y axis label */}
      <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-between items-center py-6 text-[10px] text-muted-foreground">
        <span className="writing-mode-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>{axisY.high} ↑</span>
        <span className="writing-mode-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>↓ {axisY.low}</span>
      </div>

      <div className="ml-5">
        {/* Grid */}
        <div className="grid grid-cols-2 gap-2">
          {[q(0), q(1), q(2), q(3)].map((quadrant, i) => (
            <div
              key={i}
              className="rounded-lg p-3 border-[1.5px] min-h-[100px]"
              style={{ borderColor: quadrant.color, background: quadrant.color + '08' }}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: quadrant.color }}>
                {quadrant.label}
              </div>
              <ul className="space-y-1">
                {quadrant.items.map((item, j) => (
                  <li key={j} className="text-[12px] text-muted-foreground flex items-start gap-1.5">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: quadrant.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* X axis label */}
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground px-2">
          <span>← {axisX.low}</span>
          <span>{axisX.high} →</span>
        </div>
      </div>
    </div>
  )
}
