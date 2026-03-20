"""OpenRouter LLM client with per-call model selection."""
import json
import os

from openai import AsyncOpenAI


# Map short names to OpenRouter model IDs
MODEL_MAP = {
    "opus": "anthropic/claude-opus-4",
    "sonnet": "anthropic/claude-sonnet-4",
    "haiku": "anthropic/claude-haiku-4.5",
}


def _get_client() -> AsyncOpenAI:
    return AsyncOpenAI(
        base_url=os.getenv("LLM_BASE_URL", "https://openrouter.ai/api/v1"),
        api_key=os.getenv("LLM_API_KEY", os.getenv("OPENROUTER_API_KEY", "")),
    )


async def call_llm(system: str, prompt: str, model: str = "sonnet") -> tuple[str, dict]:
    """Call LLM with a specific model. Returns (text, token_usage)."""
    client = _get_client()
    model_id = MODEL_MAP.get(model, model)
    response = await client.chat.completions.create(
        model=model_id,
        max_tokens=8192,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    usage = response.usage
    tokens = {
        "input": usage.prompt_tokens if usage else 0,
        "output": usage.completion_tokens if usage else 0,
    }
    return response.choices[0].message.content or "", tokens


def _extract_json(text: str) -> dict:
    """Extract the first valid JSON object from text, ignoring trailing content."""
    text = text.strip()
    # Strip markdown code fences
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines[1:] if l.strip() != "```"]
        text = "\n".join(lines).strip()
    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Find the first { and try incremental parsing
    start = text.find("{")
    if start == -1:
        raise json.JSONDecodeError("No JSON object found", text, 0)
    decoder = json.JSONDecoder()
    obj, _ = decoder.raw_decode(text, start)
    return obj


async def call_llm_json(system: str, prompt: str, model: str = "sonnet", max_retries: int = 3) -> tuple[dict, dict]:
    """Call LLM and parse JSON from response. Retries on malformed JSON."""
    total_tokens = {"input": 0, "output": 0}
    last_error = None
    for attempt in range(max_retries):
        text, tokens = await call_llm(system, prompt, model)
        total_tokens["input"] += tokens["input"]
        total_tokens["output"] += tokens["output"]
        try:
            return _extract_json(text), total_tokens
        except (json.JSONDecodeError, ValueError) as e:
            last_error = e
            if attempt < max_retries - 1:
                print(f"    [retry {attempt + 1}/{max_retries}] JSON parse failed: {e}")
    raise last_error
