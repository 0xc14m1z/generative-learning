import { useState } from 'react'
interface Tab { label: string; content: string }
export default function TabbedView({ data, color }: { data: Record<string, unknown>; color: string }) {
  const tabs = (data.tabs ?? []) as Tab[]
  const [active, setActive] = useState(0)
  return <div>
    <div className="flex gap-1 mb-3">
      {tabs.map((t, i) => (
        <button key={i} onClick={() => setActive(i)}
          className="px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors"
          style={{ background: i === active ? color + '18' : 'transparent', color: i === active ? color : 'var(--color-muted-foreground)', borderColor: i === active ? color + '40' : 'var(--color-border)' }}>
          {t.label}
        </button>
      ))}
    </div>
    {tabs[active] && <div className="text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: tabs[active]!.content }} />}
  </div>
}
