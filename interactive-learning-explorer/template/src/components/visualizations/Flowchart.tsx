interface FlowNode {
  id: string
  label: string
  type: 'decision' | 'outcome' | 'step'
  color?: string
}

interface FlowEdge {
  from: string
  to: string
  label?: string
}

export default function Flowchart({ data, color }: { data: Record<string, unknown>; color: string }) {
  const nodes = (data.nodes ?? []) as FlowNode[]
  const edges = (data.edges ?? []) as FlowEdge[]
  const fallbackColor = color

  // Build adjacency: for each node, find its children
  const childrenOf = (id: string) => edges.filter(e => e.from === id)
  const parentOf = (id: string) => edges.find(e => e.to === id)

  // Find root nodes (no incoming edges)
  const rootIds = nodes.filter(n => !parentOf(n.id)).map(n => n.id)

  // BFS to assign levels
  const levels: string[][] = []
  const visited = new Set<string>()
  let queue = [...rootIds]

  while (queue.length > 0) {
    const currentLevel = queue.filter(id => !visited.has(id))
    if (currentLevel.length === 0) break
    levels.push(currentLevel)
    currentLevel.forEach(id => visited.add(id))
    queue = currentLevel.flatMap(id => childrenOf(id).map(e => e.to))
  }

  // Add any unvisited nodes as final level
  const unvisited = nodes.filter(n => !visited.has(n.id)).map(n => n.id)
  if (unvisited.length > 0) levels.push(unvisited)

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  // Layout constants
  const nodeW = 120, nodeH = 44, gapX = 32, gapY = 56
  const levelWidths = levels.map(l => l.length * nodeW + (l.length - 1) * gapX)
  const totalW = Math.max(...levelWidths, 200) + 40
  const totalH = levels.length * nodeH + (levels.length - 1) * gapY + 40

  // Calculate positions
  const positions: Record<string, { x: number; y: number }> = {}
  levels.forEach((level, li) => {
    const lw = level.length * nodeW + (level.length - 1) * gapX
    const startX = (totalW - lw) / 2
    level.forEach((id, ni) => {
      positions[id] = {
        x: startX + ni * (nodeW + gapX),
        y: 20 + li * (nodeH + gapY),
      }
    })
  })

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
      {/* Edges */}
      {edges.map((edge, i) => {
        const from = positions[edge.from]
        const to = positions[edge.to]
        if (!from || !to) return null
        const x1 = from.x + nodeW / 2, y1 = from.y + nodeH
        const x2 = to.x + nodeW / 2, y2 = to.y
        const midY = (y1 + y2) / 2
        return (
          <g key={`e${i}`}>
            <path
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.25}
            />
            <polygon
              points={`${x2 - 4},${y2 - 6} ${x2},${y2} ${x2 + 4},${y2 - 6}`}
              fill="currentColor" opacity={0.3}
            />
            {edge.label && (
              <text
                x={(x1 + x2) / 2 + (x1 < x2 ? 8 : -8)} y={midY}
                textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.5}
                fontFamily="system-ui"
              >
                {edge.label}
              </text>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const pos = positions[node.id]
        if (!pos) return null
        const c = node.color || fallbackColor
        const isDiamond = node.type === 'decision'
        const isOutcome = node.type === 'outcome'

        if (isDiamond) {
          const cx = pos.x + nodeW / 2, cy = pos.y + nodeH / 2
          const dx = nodeW / 2 - 4, dy = nodeH / 2
          return (
            <g key={node.id}>
              <polygon
                points={`${cx},${cy - dy} ${cx + dx},${cy} ${cx},${cy + dy} ${cx - dx},${cy}`}
                fill={c + '12'} stroke={c} strokeWidth={1.5}
              />
              <text x={cx} y={cy + 4} textAnchor="middle" fill={c} fontSize={11} fontFamily="system-ui" fontWeight={600}>
                {node.label}
              </text>
            </g>
          )
        }

        return (
          <g key={node.id}>
            <rect
              x={pos.x} y={pos.y} width={nodeW} height={nodeH}
              rx={isOutcome ? nodeH / 2 : 8}
              fill={c + '12'} stroke={c} strokeWidth={isOutcome ? 2 : 1.5}
              strokeDasharray={isOutcome ? '6 3' : undefined}
            />
            <text
              x={pos.x + nodeW / 2} y={pos.y + nodeH / 2 + 4}
              textAnchor="middle" fill={c} fontSize={11} fontFamily="system-ui"
              fontWeight={isOutcome ? 700 : 500}
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
