import { useState, useEffect, useCallback, useMemo } from 'react'
import { structure, content } from './data/loader'
import { SectionView } from './types'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SectionRenderer from './components/SectionRenderer'
import BottomNav from './components/BottomNav'

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [depthLevel, setDepthLevel] = useState(1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set())
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(true)

  const sections: SectionView[] = useMemo(() =>
    structure.sections.map(meta => ({
      ...meta,
      content: content.sections.find(c => c.id === meta.id) ?? {
        id: meta.id, levels: { '1': '<p>Content pending.</p>' },
        visualization: { type: 'stat-cards', data: { cards: [] } },
        concepts: {}, deepDives: [], references: []
      }
    }))
  , [])

  const section = sections[currentStep]!

  const goToSection = useCallback((i: number) => {
    setCurrentStep(i)
    setExpandedPanels(new Set())
    setExpandedConcepts(new Set())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goNext = useCallback(() => {
    if (currentStep < sections.length - 1) goToSection(currentStep + 1)
  }, [currentStep, sections.length, goToSection])

  const goPrev = useCallback(() => {
    if (currentStep > 0) goToSection(currentStep - 1)
  }, [currentStep, goToSection])

  const togglePanel = useCallback((id: string) => {
    setExpandedPanels(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  const toggleConcept = useCallback((id: string) => {
    setExpandedConcepts(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  const toggleTheme = useCallback(() => {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d)
      return !d
    })
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key >= '1' && e.key <= '4') setDepthLevel(Number(e.key))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goNext, goPrev])

  useEffect(() => {
    if (!autoPlay) return
    const t = setInterval(() => {
      setCurrentStep(p => { if (p < sections.length - 1) return p + 1; setAutoPlay(false); return p })
    }, 15000)
    return () => clearInterval(t)
  }, [autoPlay, sections.length])

  useEffect(() => { document.title = `${structure.topic} — Interactive Learning Explorer` }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar sections={sections} phases={structure.phases} currentStep={currentStep}
        goToSection={goToSection} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} topic={structure.topic} />

      <main className="flex-1 flex flex-col md:ml-72">
        <Header section={section} depthLevel={depthLevel} setDepthLevel={setDepthLevel}
          autoPlay={autoPlay} setAutoPlay={setAutoPlay}
          onMenuClick={() => setSidebarOpen(true)} dark={dark} toggleTheme={toggleTheme} />

        <article className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 flex-1 animate-in fade-in duration-300" key={currentStep}>
          <SectionRenderer section={section} sections={sections} depthLevel={depthLevel}
            expandedPanels={expandedPanels} expandedConcepts={expandedConcepts}
            togglePanel={togglePanel} toggleConcept={toggleConcept} goToSection={goToSection} />
        </article>

        <BottomNav currentStep={currentStep} total={sections.length}
          goNext={goNext} goPrev={goPrev} color={section.color} />
      </main>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
