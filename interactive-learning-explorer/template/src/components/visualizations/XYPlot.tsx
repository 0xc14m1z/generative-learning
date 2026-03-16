interface Point {
  x: number
  y: number
}

interface Series {
  label: string
  color?: string
  mode: 'line' | 'scatter' | 'area'
  points: Point[]
}

interface Axis {
  label: string
  min: number
  max: number
}

interface Annotation {
  x: number
  label: string
}

const MARGIN = { top: 20, right: 20, bottom: 50, left: 55 }
const W = 600
const H = 320
const PLOT_W = W - MARGIN.left - MARGIN.right
const PLOT_H = H - MARGIN.top - MARGIN.bottom

function niceTickCount(range: number): number {
  if (range <= 5) return range
  if (range <= 10) return 5
  return 5
}

function ticks(min: number, max: number): number[] {
  const range = max - min
  const count = niceTickCount(range)
  const step = range / count
  const result: number[] = []
  for (let i = 0; i <= count; i++) {
    result.push(min + step * i)
  }
  return result
}

function scaleX(val: number, min: number, max: number): number {
  return MARGIN.left + ((val - min) / (max - min)) * PLOT_W
}

function scaleY(val: number, min: number, max: number): number {
  return MARGIN.top + PLOT_H - ((val - min) / (max - min)) * PLOT_H
}

function buildPath(points: Point[], xAxis: Axis, yAxis: Axis): string {
  if (points.length === 0) return ''
  const sorted = [...points].sort((a, b) => a.x - b.x)
  return sorted
    .map((p, i) => {
      const x = scaleX(p.x, xAxis.min, xAxis.max)
      const y = scaleY(p.y, yAxis.min, yAxis.max)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')
}

function buildAreaPath(points: Point[], xAxis: Axis, yAxis: Axis): string {
  if (points.length === 0) return ''
  const sorted = [...points].sort((a, b) => a.x - b.x)
  const linePart = sorted
    .map((p, i) => {
      const x = scaleX(p.x, xAxis.min, xAxis.max)
      const y = scaleY(p.y, yAxis.min, yAxis.max)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  const lastX = scaleX(sorted[sorted.length - 1].x, xAxis.min, xAxis.max)
  const firstX = scaleX(sorted[0].x, xAxis.min, xAxis.max)
  const baseline = scaleY(yAxis.min, yAxis.min, yAxis.max)

  return `${linePart} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`
}

export default function XYPlot({ data, color }: { data: Record<string, unknown>; color: string }) {
  const xAxis = (data.xAxis ?? { label: '', min: 0, max: 10 }) as Axis
  const yAxis = (data.yAxis ?? { label: '', min: 0, max: 100 }) as Axis
  const series = (data.series ?? []) as Series[]
  const annotations = (data.annotations ?? []) as Annotation[]

  const xTicks = ticks(xAxis.min, xAxis.max)
  const yTicks = ticks(yAxis.min, yAxis.max)

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Grid lines */}
        {yTicks.map((t, i) => {
          const y = scaleY(t, yAxis.min, yAxis.max)
          return (
            <line
              key={`yg-${i}`}
              x1={MARGIN.left}
              y1={y}
              x2={W - MARGIN.right}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeDasharray="4 4"
            />
          )
        })}
        {xTicks.map((t, i) => {
          const x = scaleX(t, xAxis.min, xAxis.max)
          return (
            <line
              key={`xg-${i}`}
              x1={x}
              y1={MARGIN.top}
              x2={x}
              y2={MARGIN.top + PLOT_H}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeDasharray="4 4"
            />
          )
        })}

        {/* Axes */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top + PLOT_H}
          x2={W - MARGIN.right}
          y2={MARGIN.top + PLOT_H}
          stroke="currentColor"
          strokeOpacity={0.25}
        />
        <line
          x1={MARGIN.left}
          y1={MARGIN.top}
          x2={MARGIN.left}
          y2={MARGIN.top + PLOT_H}
          stroke="currentColor"
          strokeOpacity={0.25}
        />

        {/* Y axis ticks and labels */}
        {yTicks.map((t, i) => {
          const y = scaleY(t, yAxis.min, yAxis.max)
          return (
            <text
              key={`yl-${i}`}
              x={MARGIN.left - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill="currentColor"
              opacity={0.5}
            >
              {Number.isInteger(t) ? t : t.toFixed(1)}
            </text>
          )
        })}

        {/* X axis ticks and labels */}
        {xTicks.map((t, i) => {
          const x = scaleX(t, xAxis.min, xAxis.max)
          return (
            <text
              key={`xl-${i}`}
              x={x}
              y={MARGIN.top + PLOT_H + 16}
              textAnchor="middle"
              fontSize={10}
              fill="currentColor"
              opacity={0.5}
            >
              {Number.isInteger(t) ? t : t.toFixed(1)}
            </text>
          )
        })}

        {/* Axis labels */}
        <text
          x={MARGIN.left + PLOT_W / 2}
          y={MARGIN.top + PLOT_H + 38}
          textAnchor="middle"
          fontSize={11}
          fill="currentColor"
          opacity={0.6}
        >
          {xAxis.label}
        </text>
        <text
          x={14}
          y={MARGIN.top + PLOT_H / 2}
          textAnchor="middle"
          fontSize={11}
          fill="currentColor"
          opacity={0.6}
          transform={`rotate(-90, 14, ${MARGIN.top + PLOT_H / 2})`}
        >
          {yAxis.label}
        </text>

        {/* Annotations */}
        {annotations.map((a, i) => {
          const x = scaleX(a.x, xAxis.min, xAxis.max)
          return (
            <g key={`ann-${i}`}>
              <line
                x1={x}
                y1={MARGIN.top}
                x2={x}
                y2={MARGIN.top + PLOT_H}
                stroke="currentColor"
                strokeOpacity={0.3}
                strokeDasharray="6 3"
              />
              <text
                x={x}
                y={MARGIN.top - 6}
                textAnchor="middle"
                fontSize={9}
                fill="currentColor"
                opacity={0.6}
                fontWeight="600"
              >
                {a.label}
              </text>
            </g>
          )
        })}

        {/* Series */}
        {series.map((s, si) => {
          const c = s.color || color
          return (
            <g key={`s-${si}`}>
              {/* Area fill */}
              {s.mode === 'area' && (
                <path d={buildAreaPath(s.points, xAxis, yAxis)} fill={c} fillOpacity={0.15} />
              )}

              {/* Line */}
              {(s.mode === 'line' || s.mode === 'area') && (
                <path
                  d={buildPath(s.points, xAxis, yAxis)}
                  fill="none"
                  stroke={c}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Dots */}
              {s.points.map((p, pi) => (
                <circle
                  key={`p-${si}-${pi}`}
                  cx={scaleX(p.x, xAxis.min, xAxis.max)}
                  cy={scaleY(p.y, yAxis.min, yAxis.max)}
                  r={s.mode === 'scatter' ? 4 : 3}
                  fill={c}
                />
              ))}
            </g>
          )
        })}

        {/* Legend */}
        {series.length > 1 &&
          series.map((s, i) => {
            const c = s.color || color
            const legendX = MARGIN.left + i * 120
            const legendY = H + 18
            return (
              <g key={`leg-${i}`}>
                <circle cx={legendX} cy={legendY} r={4} fill={c} />
                <text x={legendX + 8} y={legendY} dominantBaseline="middle" fontSize={10} fill="currentColor" opacity={0.7}>
                  {s.label}
                </text>
              </g>
            )
          })}
      </svg>
    </div>
  )
}
