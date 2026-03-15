interface CycleNode {
  label: string
  detail?: string
  color: string
}

export default function CycleDiagram({ data, color }: { data: Record<string, unknown>; color: string }) {
  const nodes = (data.nodes ?? []) as CycleNode[]
  const centerLabel = (data.centerLabel ?? '') as string
  const n = nodes.length
  if (n === 0) return null

  const size = 300
  const cx = size / 2, cy = size / 2
  const radius = 110
  const nodeW = 90, nodeH = 36

  // Position nodes in a circle
  const positions = nodes.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2 // start from top
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  })

  // Arrow path between consecutive nodes (curved)
  function arcPath(from: { x: number; y: number }, to: { x: number; y: number }) {
    // Shorten the line to not overlap with node boxes
    const dx = to.x - from.x, dy = to.y - from.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const shortenBy = 48
    const ratio1 = shortenBy / dist
    const ratio2 = 1 - shortenBy / dist
    const x1 = from.x + dx * ratio1, y1 = from.y + dy * ratio1
    const x2 = from.x + dx * ratio2, y2 = from.y + dy * ratio2

    // Curve control point: offset perpendicular to the line, toward center
    const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2
    const perpX = -(y2 - y1) * 0.15, perpY = (x2 - x1) * 0.15
    const ctrlX = midX + perpX, ctrlY = midY + perpY

    return `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="cycle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity="0.4" />
          </marker>
        </defs>

        {/* Arrows between nodes */}
        {nodes.map((_, i) => {
          const from = positions[i]!
          const to = positions[(i + 1) % n]!
          return (
            <path
              key={`arrow-${i}`}
              d={arcPath(from, to)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              opacity={0.3}
              markerEnd="url(#cycle-arrow)"
            />
          )
        })}

        {/* Center label */}
        {centerLabel && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="currentColor" opacity={0.5} fontFamily="system-ui">
            {centerLabel}
          </text>
        )}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = positions[i]!
          const c = node.color || color
          return (
            <g key={i}>
              <rect
                x={pos.x - nodeW / 2} y={pos.y - nodeH / 2}
                width={nodeW} height={nodeH}
                rx={8}
                fill={c + '12'} stroke={c} strokeWidth={1.5}
              />
              <text
                x={pos.x} y={pos.y + 1}
                textAnchor="middle" dominantBaseline="central"
                fontSize={11} fontWeight={600} fill={c} fontFamily="system-ui"
              >
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Details below the diagram */}
      {nodes.some(n => n.detail) && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {nodes.map((node, i) => node.detail && (
            <span key={i}>
              <span className="font-semibold" style={{ color: node.color || color }}>{node.label}:</span>{' '}
              {node.detail}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
