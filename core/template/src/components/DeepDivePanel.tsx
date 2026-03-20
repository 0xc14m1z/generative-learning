interface Props {
  id: string; title: string; expanded: Set<string>
  toggle: (id: string) => void; color: string; contentHtml: string
}

export default function DeepDivePanel({ id, title, expanded, toggle, color, contentHtml }: Props) {
  const open = expanded.has(id)
  return (
    <div className="mt-4 border border-border rounded-xl overflow-hidden">
      <button onClick={() => toggle(id)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-semibold bg-muted/50 hover:bg-muted transition-colors">
        <span style={{ color }}>{open ? '▾' : '▸'}</span>
        <span>{title}</span>
      </button>
      {open && (
        <div className="px-4 py-4 text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200"
          dangerouslySetInnerHTML={{ __html: contentHtml }} />
      )}
    </div>
  )
}
