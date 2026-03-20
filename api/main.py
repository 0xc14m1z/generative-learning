import asyncio
import json
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from db import init_db, create_topic, get_topic, list_topics, get_events
from generator import generate_explorer

OUTPUTS_DIR = Path(__file__).parent / "outputs"


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    OUTPUTS_DIR.mkdir(exist_ok=True)
    yield


app = FastAPI(title="Learning Explorer Generator", lifespan=lifespan)

# Serve generated HTML files
app.mount("/outputs", StaticFiles(directory=str(OUTPUTS_DIR)), name="outputs")


# ─── API Models ──────────────────────────────────────────────────

class TopicCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200, description="Topic to generate")


# ─── API Routes ──────────────────────────────────────────────────

@app.post("/api/topics")
async def create_new_topic(body: TopicCreate, background_tasks: BackgroundTasks):
    topic = await create_topic(body.title)
    background_tasks.add_task(generate_explorer, topic["id"], body.title)
    return topic


@app.get("/api/topics")
async def get_all_topics():
    return await list_topics()


@app.get("/api/topics/{topic_id}")
async def get_single_topic(topic_id: str):
    topic = await get_topic(topic_id)
    if not topic:
        raise HTTPException(404, "Topic not found")
    return topic


@app.get("/api/topics/{topic_id}/events")
async def stream_events(topic_id: str):
    """SSE endpoint — streams events as they arrive."""
    topic = await get_topic(topic_id)
    if not topic:
        raise HTTPException(404, "Topic not found")

    async def event_generator():
        last_id = 0
        while True:
            events = await get_events(topic_id, after_id=last_id)
            for event in events:
                last_id = event["id"]
                sse_data = json.dumps({
                    "wave": event["wave"],
                    "type": event["event_type"],
                    "data": event["data"],
                    "timestamp": event["created_at"],
                })
                yield f"data: {sse_data}\n\n"

                # Stop streaming after terminal events
                if event["event_type"] in ("generation_complete", "error"):
                    return

            # Check if topic already completed/failed (for reconnection)
            topic_now = await get_topic(topic_id)
            if topic_now and topic_now["status"] in ("completed", "failed") and not events:
                return

            await asyncio.sleep(1)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


# ─── Frontend ────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def home():
    html_path = Path(__file__).parent / "static" / "index.html"
    return html_path.read_text()
