export interface StructureData {
  topic: string; coreQuestion: string; coreTension: string
  sections: SectionMeta[]; phases: Phase[]
}
export interface SectionMeta {
  id: string; index: number; title: string; subtitle: string
  phase: string; color: string; icon: string
  concepts: string[]; vizType: string; bridgeTo: string
}
export interface Phase { id: string; label: string }
export interface ContentData { sections: SectionContent[] }
export interface SectionContent {
  id: string; levels: Record<string, string>
  visualization: { type: string; data: Record<string, unknown> }
  concepts: Record<string, ConceptDef>
  deepDives: DeepDiveDef[]; references: ReferenceDef[]
}
export interface ConceptDef {
  title: string; body: string; context?: string; linkedSectionId?: string | null
}
export interface DeepDiveDef { id: string; title: string; content: string }
export interface ReferenceDef { id: number; text: string; url: string }
export interface SectionView extends SectionMeta { content: SectionContent }
