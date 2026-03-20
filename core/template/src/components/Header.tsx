import { SectionView } from '../types'
import { cn } from '../lib/utils'

interface Props {
  section: SectionView; depthLevel: number; setDepthLevel: (l: number) => void
  autoPlay: boolean; setAutoPlay: (a: boolean) => void
  onMenuClick: () => void; dark: boolean; toggleTheme: () => void
}

const labels = ['Intuition', 'Practitioner', 'Builder', 'Researcher']

export default function Header({ section, depthLevel, setDepthLevel, autoPlay, setAutoPlay, onMenuClick, dark, toggleTheme }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-8 py-2.5 flex items-center gap-3">
      <button onClick={onMenuClick} className="md:hidden px-2.5 py-1 border border-border rounded-md text-muted-foreground hover:bg-accent">☰</button>
      <div className="flex gap-0.5 bg-muted rounded-lg p-0.5">
        {labels.map((label, i) => {
          const level = i + 1
          const active = depthLevel >= level
          const current = depthLevel === level
          return (
            <button key={level} onClick={() => setDepthLevel(level)}
              className={cn("px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all", current && "shadow-sm")}
              style={{
                background: current ? section.color + '20' : undefined,
                color: active ? section.color : 'var(--color-muted-foreground)',
                boxShadow: current ? `0 0 0 1px ${section.color}30` : undefined,
              }}>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{level}</span>
            </button>
          )
        })}
      </div>
      <div className="flex-1" />
      <button onClick={toggleTheme}
        className="px-2.5 py-1.5 border border-border rounded-md text-muted-foreground hover:bg-accent text-sm">
        {dark ? '☀️' : '🌙'}
      </button>
      <button onClick={() => setAutoPlay(!autoPlay)}
        className={cn("px-3 py-1.5 border rounded-md text-xs font-semibold transition-colors",
          autoPlay ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:bg-accent")}>
        {autoPlay ? '⏸' : '▶'} Auto
      </button>
    </header>
  )
}
