import FlowGraph, { type FlowNodeInput, type FlowEdgeInput } from './FlowGraph'

interface Input { label: string; color: string }
interface Output { label: string; active: boolean }

export default function RoutingDiagram({ data, color }: { data: Record<string, unknown>; color: string }) {
  const inputs = (data.inputs ?? []) as Input[]
  const router = data.router as { label: string; sublabel?: string } | undefined
  const outputs = (data.outputs ?? []) as Output[]
  const fallbackColor = (data.color ?? color) as string

  const nodes: FlowNodeInput[] = []
  const edges: FlowEdgeInput[] = []

  // Input nodes (step type)
  inputs.forEach((inp, i) => {
    nodes.push({
      id: `in-${i}`,
      label: inp.label,
      type: 'step',
      color: inp.color,
    })
  })

  // Router node (decision type)
  if (router) {
    const routerLabel = router.sublabel ? `${router.label}\n${router.sublabel}` : router.label
    nodes.push({
      id: 'router',
      label: routerLabel,
      type: 'decision',
      color: fallbackColor,
    })

    // Edges: inputs → router
    inputs.forEach((_, i) => {
      edges.push({ from: `in-${i}`, to: 'router' })
    })
  }

  // Output nodes (outcome for active, step for inactive)
  outputs.forEach((out, i) => {
    nodes.push({
      id: `out-${i}`,
      label: out.label,
      type: out.active ? 'outcome' : 'step',
      color: out.active ? fallbackColor : undefined,
      active: out.active,
    })

    // Edges: router → outputs
    if (router) {
      edges.push({ from: 'router', to: `out-${i}` })
    }
  })

  return <FlowGraph nodes={nodes} edges={edges} direction="LR" fallbackColor={fallbackColor} animateEdges showArrows />
}
