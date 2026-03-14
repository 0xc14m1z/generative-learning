import { useCallback } from 'react'
import { SectionView } from '../types'
import DeepDivePanel from './DeepDivePanel'
import References from './References'
import VizRouter from './visualizations/VizRouter'

interface Props {
  section: SectionView; sections: SectionView[]; depthLevel: number
  expandedPanels: Set<string>; expandedConcepts: Set<string>
  togglePanel: (id: string) => void; toggleConcept: (id: string) => void
  goToSection: (i: number) => void
}

export default function SectionRenderer({ section, sections, depthLevel, expandedPanels, expandedConcepts, togglePanel, toggleConcept, goToSection }: Props) {
  const { content } = section

  const renderHTML = useCallback((html: string) => {
    return html.replace(
      /<span class="concept-trigger" data-concept="([^"]+)">([^<]+)<\/span>/g,
      (_, conceptId: string, text: string) => {
        const isExpanded = expandedConcepts.has(conceptId)
        const concept = content.concepts[conceptId]
        if (!concept) return text
        const linkedIdx = concept.linkedSectionId ? sections.findIndex(s => s.id === concept.linkedSectionId) : -1
        let exp = ''
        if (isExpanded) {
          exp = `<span class="block bg-muted/50 border-l-[3px] rounded-r-lg px-4 py-3 my-2.5 text-sm leading-relaxed" style="border-color:${section.color}40">`
          exp += `<span class="block font-bold text-sm mb-1" style="color:${section.color}">${concept.title}</span>`
          exp += `<span class="block">${concept.body}</span>`
          if (concept.context) exp += `<span class="block text-muted-foreground text-[13px] mt-1">${concept.context}</span>`
          if (linkedIdx >= 0) exp += `<span class="concept-link inline-block mt-2 text-[13px] cursor-pointer border-b border-dotted text-muted-foreground hover:text-foreground" data-section-index="${linkedIdx}">Covered in depth in Section ${linkedIdx + 1}: ${sections[linkedIdx]!.title} →</span>`
          exp += `</span>`
        }
        return `<span class="expandable underline decoration-dotted decoration-muted-foreground/50 underline-offset-[3px] cursor-pointer hover:decoration-current transition-colors" data-concept-id="${conceptId}">${text}</span>${exp}`
      }
    )
  }, [expandedConcepts, content.concepts, sections, section.color])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const t = e.target as HTMLElement
    if (t.dataset.conceptId) toggleConcept(t.dataset.conceptId)
    if (t.classList.contains('concept-link') && t.dataset.sectionIndex) goToSection(Number(t.dataset.sectionIndex))
  }, [toggleConcept, goToSection])

  return (
    <div onClick={handleClick}>
      {/* Section header */}
      <div className="border-l-4 pl-4 mb-6" style={{ borderColor: section.color }}>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: section.color }}>{section.title}</h2>
        <p className="text-muted-foreground text-[15px] mt-1">{section.subtitle}</p>
      </div>

      {/* Level 1 */}
      <div className="level-content text-[15.5px] leading-[1.75]" dangerouslySetInnerHTML={{ __html: renderHTML(content.levels['1'] ?? '') }} />

      {/* Visualization */}
      <div className="bg-card border border-border rounded-xl p-6 my-5 overflow-hidden">
        <VizRouter type={section.vizType} data={content.visualization.data} color={section.color} />
      </div>

      {/* Level 2 */}
      {depthLevel >= 2 && content.levels['2'] && (
        <div className="level-content border-l-[3px] pl-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ borderColor: section.color + '40' }}
          dangerouslySetInnerHTML={{ __html: renderHTML(content.levels['2']) }} />
      )}

      {/* Level 3 */}
      {depthLevel >= 3 && content.levels['3'] && (
        <div className="level-content border-l-[3px] pl-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ borderColor: section.color + '60' }}
          dangerouslySetInnerHTML={{ __html: renderHTML(content.levels['3']) }} />
      )}

      {/* Level 4 */}
      {depthLevel >= 4 && content.levels['4'] && (
        <div className="level-content border-l-[3px] pl-5 mt-6 bg-card rounded-xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ borderColor: section.color + '80' }}
          dangerouslySetInnerHTML={{ __html: renderHTML(content.levels['4']) }} />
      )}

      {/* Deep Dives */}
      {depthLevel >= 2 && content.deepDives.map(dd => (
        <DeepDivePanel key={dd.id} id={dd.id} title={dd.title}
          expanded={expandedPanels} toggle={togglePanel} color={section.color} contentHtml={dd.content} />
      ))}

      {/* References */}
      <References sectionId={section.id} refs={content.references} />
    </div>
  )
}
