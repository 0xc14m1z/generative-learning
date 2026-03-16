import { z } from 'zod'
import { VizData } from './viz-types'

const htmlContent = z.string().describe('HTML content. Allowed tags: <p>, <h3>, <h4>, <strong>, <em>, <code>, <table>, <th>, <tr>, <td>, <ul>, <ol>, <li>, <sup>, <sub>. Content patterns: <div class="callout" data-type="insight|tip|warning|quote">, <div class="takeaway">, <div class="do-dont">, <div class="steps">, <div class="vocab-grid">, <section class="practice-block">, <section class="worked-example">, <figure class="formula-card">, <section class="misconception">, <table class="reference-matrix">. Inline: <span class="concept-trigger" data-concept="ID">, <a class="citation" href="#ref-SECTIONID-N">[N]</a>. NEVER use: <script>, onclick, <style>, or any JavaScript.')

export const ConceptDef = z.object({
  title: z.string().describe('Full name of the concept'),
  body: z.string().min(50).max(1500).describe('50-150 word explanation of the concept'),
  context: z.string().optional().describe('Why this concept matters in this section (1-2 sentences)'),
  linkedSectionId: z.string().nullable().optional().describe('ID of a section that covers this concept in depth, or null'),
})

export const DeepDiveDef = z.object({
  id: z.string().describe('Unique ID, format: "dd-{sectionId}-{N}"'),
  title: z.string().describe('Panel title, e.g. "Deep Dive: Temperature and Flavor"'),
  content: htmlContent.describe('HTML content for the collapsible panel, 100-200 words'),
})

export const ReferenceDef = z.object({
  id: z.number().int().min(1).describe('Sequential reference number starting from 1. Must match citation numbers [N] in level HTML.'),
  text: z.string().describe('Formatted citation: Author — "Title" (Year)'),
  url: z.string().url().describe('Source URL'),
})

export const SectionContent = z.object({
  id: z.string().describe('Must match the section id in structure.json'),
  levels: z.object({
    '1': htmlContent.describe('Level 1 — Intuition (150-250 words). Analogy, mental model, why it matters. NO tables, code, citations.'),
    '2': htmlContent.describe('Level 2 — Practitioner (200-400 words). Mechanism, trade-offs, practical implications. Citations required.'),
    '3': htmlContent.describe('Level 3 — Builder (300-500 words). Implementation, benchmarks, tables, failure modes. All claims cited.'),
    '4': htmlContent.describe('Level 4 — Researcher (300-600 words). Papers, history, open problems. Named papers with years.'),
  }).describe('Content at four depth levels. Each level targets a different audience and MUST NOT overlap with other levels.'),
  visualization: VizData.describe('The section visualization. Type must match vizType from structure.json.'),
  concepts: z.record(z.string(), ConceptDef).describe('Expandable concept definitions. Keys must match the concept IDs listed in structure.json for this section.'),
  deepDives: z.array(DeepDiveDef).min(0).max(3).describe('1-2 collapsible deep-dive panels'),
  references: z.array(ReferenceDef).describe('All sources cited in the level content. IDs must be sequential starting from 1.'),
})

export const ContentSchema = z.object({
  sections: z.array(SectionContent).min(1).describe('One entry per section, ordered by structure.json index'),
})

export type ContentData = z.infer<typeof ContentSchema>
export type SectionContentType = z.infer<typeof SectionContent>
