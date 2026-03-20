#!/usr/bin/env python3
"""CLI tool to compare model configurations for learning website generation."""
import argparse
import asyncio
import sys
import tempfile
from datetime import date
from pathlib import Path

from dotenv import load_dotenv

# Load .env from eval/ dir, then fall back to repo root api/.env
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / "api" / ".env")

from config import load_config, ConfigError
from generate import generate
from judge import judge
from report import generate_report

CONFIGS_DIR = Path(__file__).parent / "configs"
RESULTS_DIR = Path(__file__).parent / "results"


async def run_comparison(topic: str, config_a_name: str, config_b_name: str):
    """Generate with both configs, judge, and write report."""
    config_a = load_config(config_a_name, CONFIGS_DIR)
    config_b = load_config(config_b_name, CONFIGS_DIR)

    print(f"Topic: {topic}")
    print(f"Config A: {config_a['name']} — {config_a.get('description', '')}")
    print(f"Config B: {config_b['name']} — {config_b.get('description', '')}")
    print()

    work_dir_a = Path(tempfile.mkdtemp(prefix=f"eval-{config_a_name}-"))
    print(f"Generating with {config_a_name}...")
    stats_a = await generate(topic, config_a, work_dir_a)
    print()

    work_dir_b = Path(tempfile.mkdtemp(prefix=f"eval-{config_b_name}-"))
    print(f"Generating with {config_b_name}...")
    stats_b = await generate(topic, config_b, work_dir_b)
    print()

    print("Running LLM-as-judge (Opus)...")
    judge_results = await judge(work_dir_a, work_dir_b, config_a_name, config_b_name)
    print()

    report = generate_report(topic, judge_results, stats_a, stats_b)

    RESULTS_DIR.mkdir(exist_ok=True)
    slug = topic.lower().replace(" ", "-")[:30]
    filename = f"{date.today().isoformat()}-{slug}-{config_a_name}-vs-{config_b_name}.md"
    report_path = RESULTS_DIR / filename
    report_path.write_text(report)

    print(f"Report saved to: {report_path}")
    print()
    for line in report.split("\n")[:25]:
        print(line)


def main():
    parser = argparse.ArgumentParser(description="Compare model configurations for learning website generation")
    parser.add_argument("topic", help="Topic to generate (or arXiv URL for paper-explainer)")
    parser.add_argument("--config-a", required=True, help="First model config name (without .yaml)")
    parser.add_argument("--config-b", required=True, help="Second model config name (without .yaml)")
    args = parser.parse_args()

    try:
        asyncio.run(run_comparison(args.topic, args.config_a, args.config_b))
    except ConfigError as e:
        print(f"Config error: {e}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nAborted.")
        sys.exit(1)


if __name__ == "__main__":
    main()
