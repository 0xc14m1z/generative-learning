interface Row { label: string; value: string; badge?: string | null }
interface Card { title: string; color: string; rows: Row[] }
export default function ComparisonCards({ data }: { data: Record<string, unknown> }) {
  const cards = (data.cards ?? []) as Card[]
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(cards.length, 3)}, 1fr)` }}>
      {cards.map((c, i) => (
        <div key={i} className="bg-muted/30 rounded-xl p-5 border-t-[3px]" style={{ borderColor: c.color }}>
          <h4 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: c.color }}>{c.title}</h4>
          {c.rows.map((r, ri) => (
            <div key={ri} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold">{r.value}</span>
                {r.badge && <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ color: c.color, background: c.color + '18' }}>{r.badge}</span>}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
