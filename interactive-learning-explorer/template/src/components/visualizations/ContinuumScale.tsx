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
const BAR_Y = 50
const BAR_H = 28
const MARGIN_X = 30

export default function ContinuumScale({ data, color }: { data: Record<string, unknown>; color: string }) {
  const axis = (data.axis ?? { label: '', min: 0, max: 100 }) as AxisDef
  const bands = (data.bands ?? []) as Band[]
  const markers = (data.markers ?? []) as Marker[]

  const range = axis.max - axis.min
  if (range <= 0) return null

  const barW = SVG_W - MARGIN_X * 2

  function toX(val: number): number {
    return MARGIN_X + ((val - axis.min) / range) * barW
  }

  // Determine total SVG height based on markers below
  const hasMarkers = markers.length > 0
  const svgH = hasMarkers ? 140 : 110

  return (
    <div>
      <svg viewBox={`0 0 ${SVG_W} ${svgH}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Axis label */}
        <text x={SVG_W / 2} y={18} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7} fontWeight="600">
          {axis.label}
        </text>

        {/* Bands */}
        {bands.map((band, i) => {
          const c = band.color || color
          const x1 = toX(band.from)
          const x2 = toX(band.to)
          const w = x2 - x1
          const isFirst = i === 0
          const isLast = i === bands.length - 1
          const rx = isFirst || isLast ? 6 : 0

          return (
            <g key={`band-${i}`}>
              <rect
                x={x1}
                y={BAR_Y}
                width={w}
                height={BAR_H}
                fill={c}
                opacity={0.7}
                rx={isFirst ? rx : 0}
                ry={isFirst ? rx : 0}
              />
              {/* Apply rounding for first/last via clip or overlay — simplified: use a covering rect for all and rounded outer */}
              {isLast && (
                <rect
                  x={x1}
                  y={BAR_Y}
                  width={w}
                  height={BAR_H}
                  fill={c}
                  opacity={0.7}
                  rx={rx}
                  ry={rx}
                />
              )}
              {/* Band label centered */}
              {w > 30 && (
                <text
                  x={x1 + w / 2}
                  y={BAR_Y + BAR_H / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill="white"
                  fontWeight="600"
                >
                  {band.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Outer rounded border for the full bar */}
        <rect
          x={MARGIN_X}
          y={BAR_Y}
          width={barW}
          height={BAR_H}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          rx={6}
          ry={6}
        />

        {/* Min / Max labels */}
        <text x={MARGIN_X} y={BAR_Y + BAR_H + 16} textAnchor="start" fontSize={10} fill="currentColor" opacity={0.5}>
          {axis.min}
        </text>
        <text x={SVG_W - MARGIN_X} y={BAR_Y + BAR_H + 16} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.5}>
          {axis.max}
        </text>

        {/* Markers */}
        {markers.map((marker, i) => {
          const x = toX(marker.value)
          const above = i % 2 === 0
          const labelY = above ? BAR_Y - 8 : BAR_Y + BAR_H + 32
          const lineY1 = above ? BAR_Y - 2 : BAR_Y + BAR_H + 2
          const lineY2 = above ? BAR_Y : BAR_Y + BAR_H

          return (
            <g key={`marker-${i}`}>
              {/* Marker line through the bar */}
              <line
                x1={x}
                y1={lineY1}
                x2={x}
                y2={lineY2}
                stroke="currentColor"
                strokeWidth={2}
                strokeOpacity={0.8}
              />
              {/* Diamond indicator */}
              <circle cx={x} cy={BAR_Y + BAR_H / 2} r={4} fill="currentColor" opacity={0.9} />
              {/* Label */}
              <text
                x={x}
                y={labelY}
                textAnchor="middle"
                fontSize={9}
                fill="currentColor"
                opacity={0.7}
                fontWeight="500"
              >
                {marker.label}
              </text>
              {/* Value */}
              <text
                x={x}
                y={above ? labelY + 11 : labelY + 11}
                textAnchor="middle"
                fontSize={8}
                fill="currentColor"
                opacity={0.45}
              >
                {marker.value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
