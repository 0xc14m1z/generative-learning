import { ReferenceDef } from '../types'

export default function References({ sectionId, refs }: { sectionId: string; refs: ReferenceDef[] }) {
  if (refs.length === 0) return null
  return (
    <div className="mt-8 pt-4 border-t border-border">
      <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Sources</h4>
      <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
        {refs.map(ref => (
          <li key={ref.id} id={`ref-${sectionId}-${ref.id}`}>
            <a href={ref.url} target="_blank" rel="noopener"
              className="border-b border-dotted border-muted-foreground/30 hover:text-foreground transition-colors">
              {ref.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
