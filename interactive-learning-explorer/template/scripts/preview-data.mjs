#!/usr/bin/env node
/**
 * Copies generated structure.json + content.json into public/dev-data/
 * so the Vite dev server picks them up automatically.
 *
 * Usage: node scripts/preview-data.mjs <data-directory>
 *    or: npm run preview:data -- <data-directory>
 */
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = process.argv[2]

if (!dataDir) {
  console.log('Usage: npm run preview:data -- <data-directory>')
  console.log('')
  console.log('Copies structure.json and content.json from <data-directory>')
  console.log('into public/dev-data/ for the Vite dev server to serve.')
  console.log('')
  console.log('Example:')
  console.log('  npm run preview:data -- /tmp/explorer-data')
  process.exit(1)
}

const src = resolve(dataDir)
const dest = resolve(__dirname, '..', 'public', 'dev-data')

mkdirSync(dest, { recursive: true })

let copied = 0
for (const file of ['structure.json', 'content.json']) {
  const from = join(src, file)
  if (!existsSync(from)) {
    console.error(`✗ Missing: ${from}`)
    process.exit(1)
  }
  copyFileSync(from, join(dest, file))
  console.log(`✓ ${file}`)
  copied++
}

console.log(`\n${copied} files copied to ${dest}`)
console.log('Run "npm run dev" — the app will load this data automatically.')
