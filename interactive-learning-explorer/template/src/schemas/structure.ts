import { z } from 'zod'
import { VIZ_TYPES } from './viz-types'

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/).describe('Hex color')

export const SectionOutline = z.object({
  core: z.string().describe('One sentence: the essential truth of this section. All level agents read this.'),
  keyPoints: z.array(z.string()).min(3).max(6).describe('3-5 factual bullets that ALL levels should be aware of.'),
  L1_angle: z.string().describe('Level 1 (Intuition) direction: what analogy/mental model to use. NO technical detail.'),
  L2_angle: z.string().describe('Level 2 (Practitioner) direction: what practical mechanism to explain. NO implementation.'),
  L3_angle: z.string().describe('Level 3 (Builder) direction: what benchmarks/tables/techniques to cover. NO basics.'),
  L4_angle: z.string().describe('Level 4 (Researcher) direction: what papers/history/open problems to discuss. NO how-to.'),
}).describe('Per-section outline that guides all Wave 1 content agents. Angles MUST be mutually exclusive to prevent content overlap between levels.')

export const SectionMeta = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).describe('URL-safe identifier, e.g. "fermentation", "tcp-ip"'),
  index: z.number().int().min(0).describe('Section position (0-based)'),
  title: z.string().min(1).max(60).describe('Section title'),
  subtitle: z.string().min(1).max(120).describe('Section subtitle'),
  phase: z.enum(['orientation', 'prerequisites', 'core', 'scale', 'optimization', 'ecosystem', 'synthesis']).describe('Learning arc phase'),
  color: hexColor.describe('Section accent color. Use the palette sequentially: #3b82f6 #8b5cf6 #a855f7 #6366f1 #06b6d4 #14b8a6 #22c55e #84cc16 #eab308 #f97316 #ef4444 #ec4899 #d946ef #64748b'),
  icon: z.string().max(2).describe('Single unicode character or emoji'),
  concepts: z.array(z.string()).describe('IDs of expandable concepts defined in this section. Must match keys in content.json concepts.'),
  vizType: z.enum(VIZ_TYPES as [string, ...string[]]).describe('Visualization type. See viz-types.ts for data shapes.'),
  bridgeTo: z.string().describe('Narrative bridge to the next section. Empty string for the last section.'),
  outline: SectionOutline.optional().describe('Per-section outline for content generation agents. Required during Wave 0 (generation), optional in the final injected structure.'),
})

export const Phase = z.object({
  id: z.enum(['orientation', 'prerequisites', 'core', 'scale', 'optimization', 'ecosystem', 'synthesis']),
  label: z.string().describe('Display label for the phase, e.g. "Core Mechanism"'),
})

export const StructureSchema = z.object({
  topic: z.string().min(1).describe('The topic of the learning experience, e.g. "How the Web Works"'),
  coreQuestion: z.string().describe('The central question this explorer answers'),
  coreTension: z.string().describe('The fundamental tension or trade-off in the topic'),
  sections: z.array(SectionMeta).min(4).max(20).describe('Sections following the learning arc: orientation → prerequisites → core → scale → optimization → ecosystem → synthesis'),
  phases: z.array(Phase).min(2).describe('Phase definitions. Must include at least orientation and synthesis.'),
})

export type StructureData = z.infer<typeof StructureSchema>
export type SectionMetaType = z.infer<typeof SectionMeta>
