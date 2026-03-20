import Pipeline from './Pipeline'
import ComparisonCards from './ComparisonCards'
import UtilizationBars from './UtilizationBars'
import TokenStream from './TokenStream'
import Heatmap from './Heatmap'
import TieredHierarchy from './TieredHierarchy'
import RoutingDiagram from './RoutingDiagram'
import StatCards from './StatCards'
import TabbedView from './TabbedView'
import BarChart from './BarChart'
import InlineSvg from './InlineSvg'
import Timeline from './Timeline'
import Flowchart from './Flowchart'
import ProsCons from './ProsCons'
import CycleDiagram from './CycleDiagram'
import QuadrantMatrix from './QuadrantMatrix'
import XYPlot from './XYPlot'
import ConceptMap from './ConceptMap'
import CompositionStack from './CompositionStack'
import ContinuumScale from './ContinuumScale'
import SankeyFlow from './SankeyFlow'

interface Props { type: string; data: Record<string, unknown>; color: string }

export default function VizRouter({ type, data, color }: Props) {
  switch (type) {
    case 'pipeline': return <Pipeline data={data} color={color} />
    case 'comparison-cards': return <ComparisonCards data={data} />
    case 'utilization-bars': return <UtilizationBars data={data} />
    case 'token-stream': return <TokenStream data={data} color={color} />
    case 'heatmap': return <Heatmap data={data} color={color} />
    case 'tiered-hierarchy': return <TieredHierarchy data={data} />
    case 'routing-diagram': return <RoutingDiagram data={data} color={color} />
    case 'stat-cards': return <StatCards data={data} />
    case 'tabbed-view': return <TabbedView data={data} color={color} />
    case 'bar-chart': return <BarChart data={data} color={color} />
    case 'inline-svg': return <InlineSvg data={data} />
    case 'timeline': return <Timeline data={data} color={color} />
    case 'flowchart': return <Flowchart data={data} color={color} />
    case 'pros-cons': return <ProsCons data={data} />
    case 'cycle': return <CycleDiagram data={data} color={color} />
    case 'quadrant': return <QuadrantMatrix data={data} />
    case 'xy-plot': return <XYPlot data={data} color={color} />
    case 'concept-map': return <ConceptMap data={data} color={color} />
    case 'composition-stack': return <CompositionStack data={data} color={color} />
    case 'continuum-scale': return <ContinuumScale data={data} color={color} />
    case 'sankey-flow': return <SankeyFlow data={data} color={color} />
    default: return <div className="py-6 text-center text-muted-foreground italic">Visualization: {type}</div>
  }
}
