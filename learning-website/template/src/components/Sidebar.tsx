import { SectionView, Phase } from '../types'
import { cn } from '../lib/utils'

interface Props {
  sections: SectionView[]; phases: Phase[]; currentStep: number
  goToSection: (i: number) => void; isOpen: boolean; onClose: () => void; topic: string
}

export default function Sidebar({ sections, phases, currentStep, goToSection, isOpen, onClose, topic }: Props) {
  let currentPhase = ''
  return (
    <nav className={cn(
      "fixed top-0 left-0 h-screen w-72 bg-card border-r border-border z-40 flex flex-col transition-transform duration-300",
      "md:translate-x-0", !isOpen && "-translate-x-full"
    )}>
      <div className="p-5 border-b border-border flex items-start justify-between">
        <div>
          <h1 className="text-sm font-bold leading-tight">{topic}</h1>
          <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">Interactive Explorer</p>
        </div>
        <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        {sections.map((sec, i) => {
          const ph = sec.phase !== currentPhase ? (currentPhase = sec.phase, phases.find(p => p.id === sec.phase)?.label) : null
          const active = currentStep === i
          const visited = i < currentStep
          return (
            <div key={sec.id}>
              {ph && <div className="px-4 pt-4 pb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{ph}</div>}
              <button
                onClick={() => { goToSection(i); onClose() }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-left transition-colors border-l-[3px]",
                  active ? "bg-accent border-l-current" : "border-l-transparent hover:bg-accent/50"
                )}
                style={{ color: active ? sec.color : undefined }}
              >
                <span className="w-2 h-2 rounded-full shrink-0 transition-all" style={{
                  background: active ? sec.color : visited ? sec.color + '60' : 'var(--color-border)',
                  boxShadow: active ? `0 0 8px ${sec.color}50` : 'none'
                }} />
                <span className={cn(!active && "text-muted-foreground")}>{sec.title}</span>
              </button>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
