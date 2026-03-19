interface Card { value: string; unit: string; color: string }
export default function StatCards({ data }: { data: Record<string, unknown> }) {
  const cards = (data.cards ?? []) as Card[]
  return <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {cards.map((c, i) => (
      <div key={i} className="rounded-xl p-4 text-center border-[1.5px]" style={{ borderColor: c.color, background: c.color + '08' }}>
        <div className="text-2xl font-extrabold tracking-tight" style={{ color: c.color }}>{c.value}</div>
        <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{c.unit}</div>
      </div>
    ))}
  </div>
}
