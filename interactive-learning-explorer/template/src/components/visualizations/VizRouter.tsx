import Pipeline from './Pipeline'
import ComparisonCards from './ComparisonCards'
import UtilizationBars from './UtilizationBars'
import TokenStream from './TokenStream'
import AnimatedGrid from './AnimatedGrid'
import TieredHierarchy from './TieredHierarchy'
import RoutingDiagram from './RoutingDiagram'
import StatCards from './StatCards'
import TabbedView from './TabbedView'
import ComputeWave from './ComputeWave'
import InlineSvg from './InlineSvg'

interface Props { type: string; data: Record<string, unknown>; color: string }

export default function VizRouter({ type, data, color }: Props) {
  switch (type) {
    case 'pipeline': return <Pipeline data={data} color={color} />
    case 'comparison-cards': return <ComparisonCards data={data} />
    case 'utilization-bars': return <UtilizationBars data={data} />
    case 'token-stream': return <TokenStream data={data} color={color} />
    case 'animated-grid': return <AnimatedGrid data={data} color={color} />
    case 'tiered-hierarchy': return <TieredHierarchy data={data} />
    case 'routing-diagram': return <RoutingDiagram data={data} />
    case 'stat-cards': return <StatCards data={data} />
    case 'tabbed-view': return <TabbedView data={data} color={color} />
    case 'compute-wave': return <ComputeWave data={data} color={color} />
    case 'inline-svg': return <InlineSvg data={data} />
    default: return <div className="py-6 text-center text-muted-foreground italic">Visualization: {type}</div>
  }
}
