# API Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add model routing (opus-premium), JSON retry logic, multi-product support, input validation, and structured logging to the API.

**Architecture:** Modify existing `api/generator.py` and `api/main.py`. Add `product` field to DB schema for multi-product. Keep changes minimal — the existing architecture is solid.

**Tech Stack:** Python, FastAPI, asyncio, openai SDK, aiosqlite, logging

---

## File Structure

```
api/
├── main.py          # MODIFY: add product field to topic creation, input validation, delete endpoint
├── generator.py     # MODIFY: model routing, JSON retry, logging, product-aware pipeline
├── db.py            # MODIFY: add product column to topics table
└── static/index.html # MODIFY: product selector dropdown in UI
```

---

### Task 1: Add structured logging to generator.py

**Files:**
- Modify: `api/generator.py`

- [ ] **Step 1: Add logging setup at module level**

Add after the imports (line 15):

```python
import logging
import time

log = logging.getLogger("generator")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
)
```

- [ ] **Step 2: Add logging to call_llm**

Replace `call_llm` (lines 35-45) with:

```python
async def call_llm(system: str, prompt: str, model: str = MODEL) -> str:
    client = _get_client()
    t0 = time.monotonic()
    response = await client.chat.completions.create(
        model=model,
        max_tokens=8192,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    elapsed = time.monotonic() - t0
    usage = response.usage
    tokens_in = usage.prompt_tokens if usage else 0
    tokens_out = usage.completion_tokens if usage else 0
    log.info(f"LLM call: model={model} tokens={tokens_in}/{tokens_out} time={elapsed:.1f}s")
    return response.choices[0].message.content or ""
```

Note: `call_llm` now accepts a `model` parameter (defaults to MODULE-level MODEL for backward compat).

- [ ] **Step 3: Add logging to wave functions**

Add `log.info(...)` at the start and end of each wave function:

- `wave_0_structure`: `log.info(f"Wave 0: starting structure for '{topic}'")` and `log.info(f"Wave 0: {section_count} sections")`
- `wave_1_content`: `log.info(f"Wave 1: generating {len(sections)} sections × 4 levels")` and `log.info(f"Wave 1: complete")`
- `wave_2_enrichment`: `log.info(f"Wave 2: enriching {len(sections)} sections")` and `log.info(f"Wave 2: complete")`
- `wave_3_merge`: `log.info(f"Wave 3: merging {len(sections)} sections, {total_words} words")`
- `wave_4_inject`: `log.info(f"Wave 4: injected {file_size} bytes → {output_filename}")`
- `generate_explorer`: `log.info(f"Pipeline started: '{topic}'")` and `log.info(f"Pipeline complete: {output_filename}")` and `log.exception(f"Pipeline failed: {e}")` in the except block

- [ ] **Step 4: Commit**

```bash
git add api/generator.py
git commit -m "feat(api): add structured logging with timing and token tracking"
```

---

### Task 2: Add JSON retry logic

**Files:**
- Modify: `api/generator.py`

- [ ] **Step 1: Replace call_llm_json with robust version**

Replace `call_llm_json` (lines 48-58) with:

```python
def _extract_json(text: str) -> dict:
    """Extract the first valid JSON object from text."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines[1:] if l.strip() != "```"]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    start = text.find("{")
    if start == -1:
        raise json.JSONDecodeError("No JSON object found", text, 0)
    decoder = json.JSONDecoder()
    obj, _ = decoder.raw_decode(text, start)
    return obj


async def call_llm_json(system: str, prompt: str, model: str = MODEL, max_retries: int = 3) -> dict:
    """Call LLM and parse JSON. Retries on malformed JSON."""
    last_error = None
    for attempt in range(max_retries):
        text = await call_llm(system, prompt, model)
        try:
            return _extract_json(text)
        except (json.JSONDecodeError, ValueError) as e:
            last_error = e
            if attempt < max_retries - 1:
                log.warning(f"JSON parse failed (attempt {attempt + 1}/{max_retries}): {e}")
    log.error(f"JSON parse failed after {max_retries} attempts")
    raise last_error
```

- [ ] **Step 2: Commit**

```bash
git add api/generator.py
git commit -m "feat(api): add JSON retry logic with robust extraction"
```

---

### Task 3: Add model routing (opus-premium)

**Files:**
- Modify: `api/generator.py`

- [ ] **Step 1: Add model constants**

Replace the MODEL constant (line 21) with:

```python
MODEL_OPUS = os.getenv("LLM_MODEL_OPUS", "anthropic/claude-opus-4")
MODEL_SONNET = os.getenv("LLM_MODEL_SONNET", "anthropic/claude-sonnet-4")
MODEL = MODEL_SONNET  # default for backward compat
```

- [ ] **Step 2: Update wave_0_structure to use Opus**

Change line 102:
```python
structure = await call_llm_json(system, prompt)
```
To:
```python
log.info(f"Wave 0: using {MODEL_OPUS}")
structure = await call_llm_json(system, prompt, model=MODEL_OPUS)
```

- [ ] **Step 3: Verify waves 1-2 use Sonnet (default)**

`call_llm_json` in wave_1 (line 161) and wave_2 (line 225) don't pass a model parameter, so they default to `MODEL` which is `MODEL_SONNET`. No change needed.

- [ ] **Step 4: Commit**

```bash
git add api/generator.py
git commit -m "feat(api): add opus-premium model routing — Opus for Wave 0, Sonnet for 1-2"
```

---

### Task 4: Add input validation

**Files:**
- Modify: `api/main.py`

- [ ] **Step 1: Add validation to TopicCreate model**

Replace the TopicCreate model (lines 35-36):

```python
class TopicCreate(BaseModel):
    title: str
```

With:

```python
from pydantic import Field

class TopicCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200, description="Topic to generate")
```

- [ ] **Step 2: Commit**

```bash
git add api/main.py
git commit -m "feat(api): add input validation for topic title (2-200 chars)"
```

---

### Task 5: Add product field to database

**Files:**
- Modify: `api/db.py`

- [ ] **Step 1: Add product column to topics table**

In `init_db()`, add after the topics CREATE TABLE (line 21):

```python
# Add product column if it doesn't exist (migration for existing DBs)
try:
    await db.execute("ALTER TABLE topics ADD COLUMN product TEXT NOT NULL DEFAULT 'topic-explorer'")
    await db.commit()
except Exception:
    pass  # Column already exists
```

- [ ] **Step 2: Update create_topic to accept product**

Replace `create_topic` (lines 35-44):

```python
async def create_topic(title: str, product: str = "topic-explorer") -> dict:
    topic_id = uuid.uuid4().hex[:12]
    now = datetime.now(timezone.utc).isoformat()
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO topics (id, title, product, status, created_at) VALUES (?, ?, ?, 'pending', ?)",
            (topic_id, title, product, now),
        )
        await db.commit()
    return {"id": topic_id, "title": title, "product": product, "status": "pending", "created_at": now}
```

- [ ] **Step 3: Commit**

```bash
git add api/db.py
git commit -m "feat(api): add product field to topics table with migration"
```

---

### Task 6: Multi-product API support

**Files:**
- Modify: `api/main.py`
- Modify: `api/generator.py`

- [ ] **Step 1: Update TopicCreate to include product**

```python
class TopicCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200, description="Topic or URL to generate")
    product: str = Field(default="topic-explorer", description="Product type")
```

- [ ] **Step 2: Update create_new_topic route**

Replace the route (lines 41-45):

```python
VALID_PRODUCTS = {"topic-explorer", "paper-explainer", "repo-explorer", "company-explorer"}

@app.post("/api/topics")
async def create_new_topic(body: TopicCreate, background_tasks: BackgroundTasks):
    if body.product not in VALID_PRODUCTS:
        raise HTTPException(400, f"Invalid product. Must be one of: {', '.join(sorted(VALID_PRODUCTS))}")
    topic = await create_topic(body.title, body.product)
    background_tasks.add_task(generate_explorer, topic["id"], body.title, body.product)
    return topic
```

- [ ] **Step 3: Update generate_explorer to accept product**

In `generator.py`, update `generate_explorer` signature (line 335):

```python
async def generate_explorer(topic_id: str, topic: str, product: str = "topic-explorer"):
```

And add product to the generation_started event (line 341):

```python
await emit(topic_id, None, "generation_started", {"topic": topic, "product": product})
```

For now, all products use the same pipeline (same prompts). Product-specific prompt customization is a future enhancement — the plumbing is in place.

- [ ] **Step 4: Commit**

```bash
git add api/main.py api/generator.py
git commit -m "feat(api): add multi-product support with product field in topics"
```

---

### Task 7: Update frontend UI with product selector

**Files:**
- Modify: `api/static/index.html`

- [ ] **Step 1: Add product dropdown to input row**

Find the input row in the HTML (the section with the text input and Generate button). Add a `<select>` dropdown before the Generate button:

```html
<select id="productSelect">
  <option value="topic-explorer">Topic Explorer</option>
  <option value="paper-explainer">Paper Explainer</option>
  <option value="repo-explorer">Repo Explorer</option>
  <option value="company-explorer">Company Explorer</option>
</select>
```

Style it to match the existing dark theme (same background, border, font as the text input).

- [ ] **Step 2: Update createTopic() JavaScript function**

Update the fetch call to include the selected product:

```javascript
const product = document.getElementById('productSelect').value;
const res = await fetch('/api/topics', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: topic, product: product})
});
```

- [ ] **Step 3: Show product badge in topic library**

In the topic list rendering, show the product name next to the topic title (e.g., a small badge like `[paper]` or `[company]`).

- [ ] **Step 4: Update input placeholder based on product**

Add an event listener on the select:

```javascript
document.getElementById('productSelect').addEventListener('change', function() {
    const placeholders = {
        'topic-explorer': 'e.g. How DNS Works',
        'paper-explainer': 'e.g. https://arxiv.org/abs/2401.12345',
        'repo-explorer': 'e.g. https://github.com/org/repo',
        'company-explorer': 'e.g. https://acme.com',
    };
    document.getElementById('topicInput').placeholder = placeholders[this.value] || '';
});
```

- [ ] **Step 5: Commit**

```bash
git add api/static/index.html
git commit -m "feat(api): add product selector to frontend UI"
```

---

### Task 8: Add delete endpoint for topics

**Files:**
- Modify: `api/main.py`
- Modify: `api/db.py`

- [ ] **Step 1: Add delete_topic to db.py**

```python
async def delete_topic(topic_id: str) -> bool:
    async with aiosqlite.connect(DB_PATH) as db:
        # Delete events first (foreign key)
        await db.execute("DELETE FROM events WHERE topic_id = ?", (topic_id,))
        cur = await db.execute("DELETE FROM topics WHERE id = ?", (topic_id,))
        await db.commit()
        return cur.rowcount > 0
```

- [ ] **Step 2: Add DELETE route to main.py**

```python
@app.delete("/api/topics/{topic_id}")
async def remove_topic(topic_id: str):
    topic = await get_topic(topic_id)
    if not topic:
        raise HTTPException(404, "Topic not found")
    # Delete output file if exists
    if topic.get("output_path"):
        output_file = OUTPUTS_DIR / topic["output_path"]
        if output_file.exists():
            output_file.unlink()
    await delete_topic(topic_id)
    return {"deleted": True}
```

Add `delete_topic` to the db import.

- [ ] **Step 3: Add delete button to frontend**

Add a small delete button (X or trash icon) next to each topic in the library list. On click, call `DELETE /api/topics/{id}` and reload the list.

- [ ] **Step 4: Commit**

```bash
git add api/main.py api/db.py api/static/index.html
git commit -m "feat(api): add topic deletion with output file cleanup"
```

---

### Task 9: Verify everything works

- [ ] **Step 1: Start the API**

```bash
cd api && uv run uvicorn main:app --reload
```

- [ ] **Step 2: Test input validation**

```bash
curl -X POST http://localhost:8000/api/topics -H "Content-Type: application/json" -d '{"title": ""}'
# Expected: 422 validation error

curl -X POST http://localhost:8000/api/topics -H "Content-Type: application/json" -d '{"title": "Test", "product": "invalid"}'
# Expected: 400 "Invalid product"
```

- [ ] **Step 3: Test product selector in UI**

Open http://localhost:8000 — verify dropdown appears, placeholder changes per product.

- [ ] **Step 4: Check logs**

Verify structured logs appear in the terminal with timing and token info.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A && git status
# Only commit if changes needed
```
