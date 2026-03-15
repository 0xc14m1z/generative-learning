import { useMemo } from 'react'
import {
  ReactFlow,
  type Node,
  type Edge,
  Position,
  Handle,
  type NodeProps,
} from '@xyflow/react'
import dagre from '@dagrejs/dagre'
import '@xyflow/react/dist/style.css'

/* ── Data shape from JSON ─────────────────────────────────────── */
interface FlowNodeData {
  id: string
  label: string
  type: 'decision' | 'outcome' | 'step'
  color?: string
}
interface FlowEdgeData {
  from: string
  to: string
  label?: string
}

/* ── Custom node components ───────────────────────────────────── */
function StepNode({ data }: NodeProps) {
  const d = data as unknown as { label: string; nodeColor: string }
  return (
    <div
      className="px-4 py-2 rounded-lg border-[1.5px] text-[12px] font-medium text-center min-w-[80px] max-w-[160px]"
      style={{ borderColor: d.nodeColor, background: d.nodeColor + '12', color: d.nodeColor }}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      {d.label}
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

function DecisionNode({ data }: NodeProps) {
  const d = data as unknown as { label: string; nodeColor: string }
  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 60 }}>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <svg viewBox="0 0 120 60" className="absolute inset-0" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="60,2 118,30 60,58 2,30"
          fill={d.nodeColor + '12'}
          stroke={d.nodeColor}
          strokeWidth={1.5}
        />
      </svg>
      <span className="relative z-10 text-[11px] font-semibold text-center px-4" style={{ color: d.nodeColor }}>
        {d.label}
      </span>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

function OutcomeNode({ data }: NodeProps) {
  const d = data as unknown as { label: string; nodeColor: string }
  return (
    <div
      className="px-4 py-2 rounded-full border-2 border-dashed text-[12px] font-bold text-center min-w-[80px] max-w-[160px]"
      style={{ borderColor: d.nodeColor, background: d.nodeColor + '12', color: d.nodeColor }}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      {d.label}
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

const nodeTypes = {
  step: StepNode,
  decision: DecisionNode,
  outcome: OutcomeNode,
}

/* ── Dagre layout ─────────────────────────────────────────────── */
const NODE_DIMS: Record<string, { width: number; height: number }> = {
  step: { width: 140, height: 40 },
  decision: { width: 120, height: 60 },
  outcome: { width: 140, height: 40 },
}

function layoutGraph(flowNodes: FlowNodeData[], flowEdges: FlowEdgeData[], fallbackColor: string) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', ranksep: 50, nodesep: 40 })

  for (const n of flowNodes) {
    const dims = NODE_DIMS[n.type] ?? NODE_DIMS.step
    g.setNode(n.id, { width: dims.width, height: dims.height })
  }
  for (const e of flowEdges) {
    g.setEdge(e.from, e.to)
  }

  dagre.layout(g)

  const nodes: Node[] = flowNodes.map(n => {
    const pos = g.node(n.id)
    const dims = NODE_DIMS[n.type] ?? NODE_DIMS.step
    return {
      id: n.id,
      type: n.type,
      position: { x: pos.x - dims.width / 2, y: pos.y - dims.height / 2 },
      data: { label: n.label, nodeColor: n.color || fallbackColor },
      draggable: false,
      connectable: false,
      selectable: false,
    }
  })

  const edges: Edge[] = flowEdges.map((e, i) => ({
    id: `e-${i}`,
    source: e.from,
    target: e.to,
    label: e.label,
    type: 'default',
    style: { stroke: 'var(--color-muted-foreground)', strokeWidth: 1.5, opacity: 0.4 },
    labelStyle: { fontSize: 10, fill: 'var(--color-muted-foreground)' },
    labelBgStyle: { fill: 'var(--color-background)', fillOpacity: 0.8 },
  }))

  // Calculate bounds for container sizing
  let maxX = 0, maxY = 0
  for (const n of nodes) {
    const dims = NODE_DIMS[flowNodes.find(fn => fn.id === n.id)?.type ?? 'step'] ?? NODE_DIMS.step
    maxX = Math.max(maxX, n.position.x + dims.width)
    maxY = Math.max(maxY, n.position.y + dims.height)
  }

  return { nodes, edges, width: maxX + 40, height: maxY + 40 }
}

/* ── Main component ───────────────────────────────────────────── */
export default function Flowchart({ data, color }: { data: Record<string, unknown>; color: string }) {
  const flowNodes = (data.nodes ?? []) as FlowNodeData[]
  const flowEdges = (data.edges ?? []) as FlowEdgeData[]

  const { nodes, edges, height } = useMemo(
    () => layoutGraph(flowNodes, flowEdges, color),
    [flowNodes, flowEdges, color]
  )

  // Clamp height to a reasonable range
  const containerHeight = Math.max(200, Math.min(height, 600))

  return (
    <div style={{ height: containerHeight }} className="w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.5}
      />
    </div>
  )
}
