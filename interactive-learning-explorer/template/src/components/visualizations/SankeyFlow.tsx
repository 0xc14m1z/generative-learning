interface SankeyNode {
  id: string
  label: string
  color?: string
}

interface SankeyLink {
  source: string
  target: string
  value: number
  label?: string
}

const SVG_W = 600
const SVG_H = 320
const NODE_W = 20
const MARGIN = { top: 20, bottom: 20, left: 80, right: 80 }

export default function SankeyFlow({ data, color }: { data: Record<string, unknown>; color: string }) {
  const nodes = (data.nodes ?? []) as SankeyNode[]
  const links = (data.links ?? []) as SankeyLink[]

  if (nodes.length === 0 || links.length === 0) return null

  // Determine source and target nodes
  const sourceIds = new Set(links.map(l => l.source))
  const targetIds = new Set(links.map(l => l.target))

  // Source nodes: those that appear as source but not as target
  // Target nodes: those that appear as target but not as source
  // Nodes that are both get placed based on first appearance
  const sourceNodes = nodes.filter(n => sourceIds.has(n.id) && !targetIds.has(n.id))
  const targetNodes = nodes.filter(n => targetIds.has(n.id) && !sourceIds.has(n.id))

  // Nodes that are both source and target (middle nodes) — treat as targets for simple 2-column
  const middleNodes = nodes.filter(n => sourceIds.has(n.id) && targetIds.has(n.id))
  const allTargets = [...middleNodes, ...targetNodes]

  // If no clear separation, just put first node as source
  if (sourceNodes.length === 0 && allTargets.length === 0) {
    sourceNodes.push(nodes[0])
    allTargets.push(...nodes.slice(1))
  } else if (sourceNodes.length === 0) {
    sourceNodes.push(nodes[0])
  } else if (allTargets.length === 0) {
    allTargets.push(...nodes.filter(n => !sourceNodes.includes(n)))
  }

  // Calculate total values for sizing
  const totalValue = links.reduce((sum, l) => sum + l.value, 0)

  // Layout: sources on left, targets on right
  const leftX = MARGIN.left
  const rightX = SVG_W - MARGIN.right - NODE_W
  const availableH = SVG_H - MARGIN.top - MARGIN.bottom

  // Calculate heights for source nodes
  const sourceHeights = sourceNodes.map(sn => {
    const outgoing = links.filter(l => l.source === sn.id).reduce((s, l) => s + l.value, 0)
    return (outgoing / totalValue) * availableH
  })
  const sourceTotalH = sourceHeights.reduce((s, h) => s + h, 0)
  const sourceGap = sourceNodes.length > 1
    ? Math.min(12, (availableH - sourceTotalH) / (sourceNodes.length - 1))
    : 0

  // Calculate heights for target nodes
  const targetHeights = allTargets.map(tn => {
    const incoming = links.filter(l => l.target === tn.id).reduce((s, l) => s + l.value, 0)
    return (incoming / totalValue) * availableH
  })
  const targetTotalH = targetHeights.reduce((s, h) => s + h, 0)
  const targetGap = allTargets.length > 1
    ? Math.min(12, (availableH - targetTotalH) / (allTargets.length - 1))
    : 0

  // Position source nodes
  const sourcePositions: Record<string, { x: number; y: number; h: number }> = {}
  let sy = MARGIN.top + (availableH - (sourceTotalH + sourceGap * (sourceNodes.length - 1))) / 2
  sourceNodes.forEach((sn, i) => {
    const h = Math.max(sourceHeights[i], 16)
    sourcePositions[sn.id] = { x: leftX, y: sy, h }
    sy += h + sourceGap
  })

  // Position target nodes
  const targetPositions: Record<string, { x: number; y: number; h: number }> = {}
  let ty = MARGIN.top + (availableH - (targetTotalH + targetGap * (allTargets.length - 1))) / 2
  allTargets.forEach((tn, i) => {
    const h = Math.max(targetHeights[i], 16)
    targetPositions[tn.id] = { x: rightX, y: ty, h }
    ty += h + targetGap
  })

  // Track offsets for stacking links at each node
  const sourceOffsets: Record<string, number> = {}
  const targetOffsets: Record<string, number> = {}
  sourceNodes.forEach(n => { sourceOffsets[n.id] = 0 })
  allTargets.forEach(n => { targetOffsets[n.id] = 0 })

  // Node color lookup
  const nodeColorMap: Record<string, string> = {}
  nodes.forEach(n => { nodeColorMap[n.id] = n.color || color })

  // Build link paths
  const linkPaths = links.map((link, i) => {
    const sp = sourcePositions[link.source]
    const tp = targetPositions[link.target]
    if (!sp || !tp) return null

    const linkH = (link.value / totalValue) * availableH
    const sOffset = sourceOffsets[link.source] ?? 0
    const tOffset = targetOffsets[link.target] ?? 0

    const y0 = sp.y + sOffset
    const y1 = tp.y + tOffset

    sourceOffsets[link.source] = sOffset + linkH
    targetOffsets[link.target] = tOffset + linkH

    const x0 = sp.x + NODE_W
    const x1 = tp.x
    const midX = (x0 + x1) / 2

    const path = `M ${x0} ${y0}
      C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}
      L ${x1} ${y1 + linkH}
      C ${midX} ${y1 + linkH}, ${midX} ${y0 + linkH}, ${x0} ${y0 + linkH}
      Z`

    const c = nodeColorMap[link.source]

    return (
      <g key={`link-${i}`}>
        <path d={path} fill={c} fillOpacity={0.2} stroke={c} strokeOpacity={0.3} strokeWidth={0.5} />
        {/* Link label */}
        {link.label && (
          <text
            x={midX}
            y={(y0 + y1) / 2 + linkH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="currentColor"
            opacity={0.6}
            fontWeight="500"
          >
            {link.label}
          </text>
        )}
      </g>
    )
  })

  return (
    <div>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Links */}
        {linkPaths}

        {/* Source nodes */}
        {sourceNodes.map(sn => {
          const pos = sourcePositions[sn.id]
          const c = sn.color || color
          return (
            <g key={`sn-${sn.id}`}>
              <rect x={pos.x} y={pos.y} width={NODE_W} height={pos.h} fill={c} rx={3} ry={3} />
              <text
                x={pos.x - 6}
                y={pos.y + pos.h / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="currentColor"
                opacity={0.8}
                fontWeight="600"
              >
                {sn.label}
              </text>
            </g>
          )
        })}

        {/* Target nodes */}
        {allTargets.map(tn => {
          const pos = targetPositions[tn.id]
          if (!pos) return null
          const c = tn.color || color
          return (
            <g key={`tn-${tn.id}`}>
              <rect x={pos.x} y={pos.y} width={NODE_W} height={pos.h} fill={c} rx={3} ry={3} />
              <text
                x={pos.x + NODE_W + 6}
                y={pos.y + pos.h / 2}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize={11}
                fill="currentColor"
                opacity={0.8}
                fontWeight="600"
              >
                {tn.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
