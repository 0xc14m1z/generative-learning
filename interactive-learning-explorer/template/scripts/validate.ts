/**
 * Validates structure.json and content.json against Zod schemas.
 *
 * Usage:
 *   npx tsx scripts/validate.ts <structure.json> <content.json>
 *   npm run validate -- /tmp/explorer-data/structure.json /tmp/explorer-data/content.json
 */
import { readFileSync } from 'fs'
import { StructureSchema } from '../src/schemas/structure'
import { ContentSchema } from '../src/schemas/content'

const [structurePath, contentPath] = process.argv.slice(2)

if (!structurePath || !contentPath) {
  console.log('Usage: npx tsx scripts/validate.ts <structure.json> <content.json>')
  process.exit(1)
}

let errors = 0

// Validate structure
try {
  const raw = JSON.parse(readFileSync(structurePath, 'utf-8'))
  const result = StructureSchema.safeParse(raw)
  if (result.success) {
    console.log(`✓ structure.json — ${result.data.sections.length} sections, topic: "${result.data.topic}"`)
  } else {
    console.error(`✗ structure.json — ${result.error.issues.length} errors:`)
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`)
    }
    errors += result.error.issues.length
  }
} catch (e) {
  console.error(`✗ structure.json — failed to read/parse: ${(e as Error).message}`)
  errors++
}

// Validate content
try {
  const raw = JSON.parse(readFileSync(contentPath, 'utf-8'))
  const result = ContentSchema.safeParse(raw)
  if (result.success) {
    const totalConcepts = result.data.sections.reduce((n, s) => n + Object.keys(s.concepts).length, 0)
    const totalRefs = result.data.sections.reduce((n, s) => n + s.references.length, 0)
    console.log(`✓ content.json — ${result.data.sections.length} sections, ${totalConcepts} concepts, ${totalRefs} references`)
  } else {
    console.error(`✗ content.json — ${result.error.issues.length} errors:`)
    for (const issue of result.error.issues.slice(0, 20)) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`)
    }
    if (result.error.issues.length > 20) {
      console.error(`  ... and ${result.error.issues.length - 20} more`)
    }
    errors += result.error.issues.length
  }
} catch (e) {
  console.error(`✗ content.json — failed to read/parse: ${(e as Error).message}`)
  errors++
}

// Cross-validate
if (errors === 0) {
  try {
    const structure = JSON.parse(readFileSync(structurePath, 'utf-8'))
    const content = JSON.parse(readFileSync(contentPath, 'utf-8'))

    const structureIds = new Set(structure.sections.map((s: { id: string }) => s.id))
    const contentIds = new Set(content.sections.map((s: { id: string }) => s.id))

    for (const id of structureIds) {
      if (!contentIds.has(id)) {
        console.error(`✗ cross-ref: section "${id}" in structure but missing from content`)
        errors++
      }
    }
    for (const id of contentIds) {
      if (!structureIds.has(id)) {
        console.error(`✗ cross-ref: section "${id}" in content but missing from structure`)
        errors++
      }
    }

    if (errors === 0) {
      console.log(`✓ cross-reference — all section IDs match`)
    }
  } catch { /* already reported */ }
}

console.log(errors === 0 ? '\nAll checks passed.' : `\n${errors} error(s) found.`)
process.exit(errors > 0 ? 1 : 0)
