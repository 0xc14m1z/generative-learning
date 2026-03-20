# Wave 4: Inject & Deliver

**Input:** `structure.json` + `content.json`
**Output:** A single self-contained HTML file

Uses the shared shell and inject script from `learning-website`.

## Process

### 1. Run the injection script

```bash
python3 [learning-website-path]/prebuild/inject.py \
  [learning-website-path]/prebuild/shell.html \
  /tmp/repo-explorer-data/structure.json \
  /tmp/repo-explorer-data/content.json \
  ~/Desktop/[repo-name]-explorer.html
```

### 2. Verify

```bash
FILE="~/Desktop/[repo-name]-explorer.html"
test -s "$FILE" && echo "✓ Created ($(ls -lh $FILE | awk '{print $5}'))" || echo "✗ Missing"
```

### 3. Present

Present the file to the user. Done.
