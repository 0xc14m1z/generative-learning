import { StructureData, ContentData } from '../types'
import { StructureSchema, ContentSchema } from '../schemas'
import placeholderStructure from './structure.json'
import placeholderContent from './content.json'

declare global {
  interface Window { __STRUCTURE_DATA__: unknown; __CONTENT_DATA__: unknown }
}

/** Validation errors shown in dev mode */
export let validationErrors: string[] = []

function validateStructure(data: unknown): StructureData | null {
  const result = StructureSchema.safeParse(data)
  if (result.success) return result.data
  if (import.meta.env.DEV) {
    const errors = result.error.issues.map(i => `structure: ${i.path.join('.')} — ${i.message}`)
    validationErrors.push(...errors)
    console.warn('[loader] structure.json validation errors:', errors)
  }
  // Return data as-is even if invalid (best-effort rendering)
  return data as StructureData
}

function validateContent(data: unknown): ContentData | null {
  const result = ContentSchema.safeParse(data)
  if (result.success) return result.data
  if (import.meta.env.DEV) {
    const errors = result.error.issues.map(i => `content: ${i.path.join('.')} — ${i.message}`)
    validationErrors.push(...errors)
    console.warn('[loader] content.json validation errors:', errors)
  }
  return data as ContentData
}

function load<T>(key: string, fallback: T): T {
  const val = (window as unknown as Record<string, unknown>)[key]
  if (val && typeof val === 'object') return val as T
  return fallback
}

// Sync exports — production uses window globals, dev uses imported JSON
const rawStructure = load<unknown>('__STRUCTURE_DATA__', placeholderStructure)
const rawContent = load<unknown>('__CONTENT_DATA__', placeholderContent)

export const structure = validateStructure(rawStructure) as StructureData
export const content = validateContent(rawContent) as ContentData

/**
 * Dev-only: tries to fetch JSON from public/dev-data/.
 * Drop your generated structure.json + content.json there to preview them.
 * Returns null in production or if files aren't found.
 */
export async function loadDevData(): Promise<{ structure: StructureData; content: ContentData } | null> {
  if (!import.meta.env.DEV) return null
  try {
    const t = Date.now()
    const [sRes, cRes] = await Promise.all([
      fetch(`/dev-data/structure.json?t=${t}`),
      fetch(`/dev-data/content.json?t=${t}`),
    ])
    if (!sRes.ok || !cRes.ok) return null
    const [rawS, rawC] = await Promise.all([sRes.json(), cRes.json()])

    validationErrors = []
    const s = validateStructure(rawS)
    const c = validateContent(rawC)
    if (!s || !c) return null

    return { structure: s, content: c }
  } catch {
    return null
  }
}
