interface TimelineEvent {
  date: string
  label: string
  detail?: string
  color: string
}

export default function Timeline({ data, color }: { data: Record<string, unknown>; color: string }) {
  const events = (data.events ?? []) as TimelineEvent[]
  const fallbackColor = color

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-px" style={{ background: `linear-gradient(to bottom, ${fallbackColor}60, ${fallbackColor}20)` }} />

      <div className="flex flex-col gap-5">
        {events.map((event, i) => {
          const c = event.color || fallbackColor
          return (
            <div key={i} className="relative">
              {/* Dot on the timeline */}
              <div
                className="absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 bg-background"
                style={{ borderColor: c }}
              />
              <div className="absolute -left-[17px] top-[7px] w-2 h-2 rounded-full" style={{ background: c }} />

              {/* Content */}
              <div className="ml-2">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: c }}>
                  {event.date}
                </span>
                <h4 className="text-sm font-semibold mt-0.5">{event.label}</h4>
                {event.detail && (
                  <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{event.detail}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
