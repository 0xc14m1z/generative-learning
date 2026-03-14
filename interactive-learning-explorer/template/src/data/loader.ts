import { StructureData, ContentData } from '../types'
import placeholderStructure from './structure.json'
import placeholderContent from './content.json'

declare global {
  interface Window { __STRUCTURE_DATA__: unknown; __CONTENT_DATA__: unknown }
}

function load<T>(key: string, fallback: T): T {
  const val = (window as unknown as Record<string, unknown>)[key]
  if (val && typeof val === 'object') return val as T
  return fallback
}

// Sync exports — production uses window globals, dev uses imported JSON
export const structure = load<StructureData>('__STRUCTURE_DATA__', placeholderStructure as unknown as StructureData)
export const content = load<ContentData>('__CONTENT_DATA__', placeholderContent as unknown as ContentData)

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
    const [s, c] = await Promise.all([sRes.json(), cRes.json()])
    return { structure: s as StructureData, content: c as ContentData }
  } catch {
    return null
  }
}
