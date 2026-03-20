# Wave 4: Inject & Deliver

**Input:** `structure.json` + `content.json`
**Output:** A single self-contained HTML file

This wave does NOT compile anything. The HTML shell is pre-built and shipped with the skill. This wave only injects JSON data into it.

## Process

### 1. Run the injection script

```bash
python3 [core-path]/prebuild/inject.py \
  [core-path]/prebuild/shell.html \
  {work-dir}/structure.json \
  {work-dir}/content.json \
  ~/Desktop/[topic-slug]-explorer.html
```

The output path defaults to `~/Desktop/`. If the API server is running, use `api/outputs/` instead. Adjust based on the environment.

That's it. One command. No npm, no Vite, no TypeScript, no build step.

The script:
1. Reads the pre-built HTML shell (which contains `%%STRUCTURE_DATA%%` and `%%CONTENT_DATA%%` placeholders)
2. Replaces `"%%STRUCTURE_DATA%%"` with the structure JSON object
3. Replaces `"%%CONTENT_DATA%%"` with the content JSON object
4. Updates the page `<title>` from the topic name
5. Writes the output file

### 2. Verify

```bash
FILE=~/Desktop/[topic-slug]-explorer.html
test -s "$FILE" && echo "✓ Created ($(ls -lh $FILE | awk '{print $5}'))" || echo "✗ Missing"
```

### 3. Present

Present the file to the user. Done.

## When to rebuild the shell

The shell only needs rebuilding if you change the UI — components, styling, layout, new visualization types. To rebuild:

```bash
cd [core-path]/template
npm install
npx vite build
cp dist/index.html [core-path]/prebuild/shell.html
```

This is a skill maintenance task, NOT a content generation task. Content generation never touches npm or Vite.
