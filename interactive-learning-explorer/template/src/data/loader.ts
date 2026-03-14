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

export const structure = load<StructureData>('__STRUCTURE_DATA__', placeholderStructure as unknown as StructureData)
export const content = load<ContentData>('__CONTENT_DATA__', placeholderContent as unknown as ContentData)
