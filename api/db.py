import aiosqlite
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).parent / "explorer.db"

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS topics (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL,
                completed_at TEXT,
                output_path TEXT,
                error TEXT
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic_id TEXT NOT NULL REFERENCES topics(id),
                wave INTEGER,
                event_type TEXT NOT NULL,
                data TEXT,
                created_at TEXT NOT NULL
            )
        """)
        await db.commit()

        # Add product column if it doesn't exist (migration for existing DBs)
        try:
            await db.execute("ALTER TABLE topics ADD COLUMN product TEXT NOT NULL DEFAULT 'topic-explorer'")
            await db.commit()
        except Exception:
            pass  # Column already exists


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


async def get_topic(topic_id: str) -> dict | None:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM topics WHERE id = ?", (topic_id,)) as cur:
            row = await cur.fetchone()
            return dict(row) if row else None


async def list_topics() -> list[dict]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM topics ORDER BY created_at DESC") as cur:
            return [dict(row) async for row in cur]


async def update_topic(topic_id: str, **kwargs):
    sets = ", ".join(f"{k} = ?" for k in kwargs)
    vals = list(kwargs.values()) + [topic_id]
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(f"UPDATE topics SET {sets} WHERE id = ?", vals)
        await db.commit()


async def add_event(topic_id: str, wave: int | None, event_type: str, data: dict | None = None):
    now = datetime.now(timezone.utc).isoformat()
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO events (topic_id, wave, event_type, data, created_at) VALUES (?, ?, ?, ?, ?)",
            (topic_id, wave, event_type, json.dumps(data) if data else None, now),
        )
        await db.commit()


async def get_events(topic_id: str, after_id: int = 0) -> list[dict]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM events WHERE topic_id = ? AND id > ? ORDER BY id",
            (topic_id, after_id),
        ) as cur:
            rows = []
            async for row in cur:
                d = dict(row)
                if d["data"]:
                    d["data"] = json.loads(d["data"])
                rows.append(d)
            return rows
