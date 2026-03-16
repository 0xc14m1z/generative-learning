interface Band {
  from: number
  to: number
  label: string
  color?: string
}

interface Marker {
  value: number
  label: string
}

interface AxisDef {
  label: string
  min: number
  max: number
}

const SVG_W = 600
const MARGIN_X = 30
const BAR_H = 32
const LABEL_AREA = 40  // space for marker labels above/below

export default function ContinuumScale({ data, color }: { data: Record<string, unknown>; color: string }) {
  const axis = (data.axis ?? { label: '', min: 0, max: 100 }) as AxisDef
  const bands = (data.bands ?? []) as Band[]
  const markers = (data.markers ?? []) as Marker[]

  const range = axis.max - axis.min
  if (range <= 0) return null

  const barW = SVG_W - MARGIN_X * 2
  const toX = (val: number) => MARGIN_X + ((val - axis.min) / range) * barW

  // Layout: title (20) + gap (8) + top labels (LABEL_AREA) + bar (BAR_H) + bottom labels (LABEL_AREA) + min/max (16)
  const titleY = 14
  const barY = titleY + 8 + LABEL_AREA
  const svgH = barY + BAR_H + LABEL_AREA + 20

  const clipId = 'continuum-clip'

  return (
    <div>
      <svg viewBox={`0 0 ${SVG_W} ${svgH}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Clip path for rounded bar */}
        <defs>
          <clipPath id={clipId}>
            <rect x={MARGIN_X} y={barY} width={barW} height={BAR_H} rx={BAR_H / 2} />
          </clipPath>
        </defs>

        {/* Axis label */}
        <text x={SVG_W / 2} y={titleY} textAnchor="middle" fontSize={13} fill="currentColor" fontWeight="700">
          {axis.label}
        </text>

        {/* Bands (clipped to rounded bar) */}
        <g clipPath={`url(#${clipId})`}>
          {bands.map((band, i) => {
            const c = band.color || color
            const x1 = toX(band.from)
            const x2 = toX(band.to)
            return (
              <rect key={`band-${i}`} x={x1} y={barY} width={x2 - x1} height={BAR_H} fill={c} opacity={0.35} />
            )
          })}
        </g>

        {/* Band labels (centered in each band) */}
        {bands.map((band, i) => {
          const c = band.color || color
          const x1 = toX(band.from)
          const x2 = toX(band.to)
          const w = x2 - x1
          if (w < 40) return null
          return (
            <text
              key={`blabel-${i}`}
              x={x1 + w / 2}
              y={barY + BAR_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fill={c}
              fontWeight="700"
            >
              {band.label}
            </text>
          )
        })}

        {/* Rounded bar outline */}
        <rect
          x={MARGIN_X} y={barY} width={barW} height={BAR_H}
          rx={BAR_H / 2} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={1}
        />

        {/* Min / Max labels */}
        <text x={MARGIN_X} y={barY + BAR_H + 16} textAnchor="start" fontSize={10} fill="currentColor" opacity={0.4}>
          {axis.min}
        </text>
        <text x={SVG_W - MARGIN_X} y={barY + BAR_H + 16} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.4}>
          {axis.max}
        </text>

        {/* Markers */}
        {markers.map((marker, i) => {
          const x = toX(marker.value)
          const above = i % 2 === 0

          // Tick mark on the bar edge
          const tickTop = barY - 3
          const tickBottom = barY + BAR_H + 3

          // Label position
          const labelY = above ? barY - 16 : barY + BAR_H + 30
          const valueY = above ? barY - 6 : barY + BAR_H + 42

          return (
            <g key={`marker-${i}`}>
              {/* Vertical tick through bar edges */}
              <line x1={x} y1={tickTop} x2={x} y2={tickBottom} stroke="currentColor" strokeWidth={1.5} opacity={0.5} />

              {/* Small triangle indicator */}
              {above ? (
                <polygon points={`${x - 3},${tickTop} ${x + 3},${tickTop} ${x},${tickTop + 4}`} fill="currentColor" opacity={0.6} />
              ) : (
                <polygon points={`${x - 3},${tickBottom} ${x + 3},${tickBottom} ${x},${tickBottom - 4}`} fill="currentColor" opacity={0.6} />
              )}

              {/* Label */}
              <text x={x} y={labelY} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.8} fontWeight="600">
                {marker.label}
              </text>
              {/* Value */}
              <text x={x} y={valueY} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.4}>
                {marker.value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
