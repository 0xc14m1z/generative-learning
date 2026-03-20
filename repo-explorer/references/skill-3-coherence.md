# Wave 3: Coherence & Merge

Same as `learning-website/references/skill-3-coherence.md`.

**Input:** All files from Waves 0-2 in `/tmp/repo-explorer-data/`
**Output:** `/tmp/repo-explorer-data/content.json`

## Additional checks for code content

Beyond the standard coherence checks:

1. **File path consistency** — If Level 3 references `src/auth/handler.ts`, verify the path is consistent across all levels and concepts.
2. **Function name accuracy** — Function names mentioned in content should match what's in the actual code.
3. **Import graph consistency** — If the concept-map viz shows module A depending on B, the content should reflect that.
4. **No stale references** — If a file was renamed or a function signature changed, the content should use the current name.

## Merge process

Same as `learning-website`:
```bash
# Read all section files, merge into content.json ordered by structure.json index
python3 -c "
import json, os
structure = json.load(open('/tmp/repo-explorer-data/structure.json'))
sections = []
for sec in structure['sections']:
    sid = sec['id']
    base = f'/tmp/repo-explorer-data/sections/{sid}'
    levels = {str(l): json.load(open(f'{base}/level-{l}.json'))['html'] for l in [1,2,3,4]}
    enr = json.load(open(f'{base}/enrichment.json'))
    sections.append({'id': sid, 'levels': levels, 'visualization': enr['visualization'], 'concepts': enr['concepts'], 'deepDives': enr['deepDives'], 'references': enr['references']})
json.dump({'sections': sections}, open('/tmp/repo-explorer-data/content.json', 'w'), ensure_ascii=False, indent=2)
print(f'Merged {len(sections)} sections')
"
```

## Validate

```bash
cd [learning-website-path]/template
npm run validate -- /tmp/repo-explorer-data/structure.json /tmp/repo-explorer-data/content.json
```
