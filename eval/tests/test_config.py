import pytest
from pathlib import Path

from config import load_config, ConfigError

CONFIGS_DIR = Path(__file__).parent.parent / "configs"


def test_load_valid_config():
    cfg = load_config("all-sonnet", CONFIGS_DIR)
    assert cfg["name"] == "all-sonnet"
    assert cfg["models"]["wave0"] == "sonnet"
    assert cfg["models"]["wave1"] == "sonnet"
    assert cfg["models"]["wave2"] == "sonnet"
    assert cfg["models"]["wave3"] == "sonnet"


def test_load_missing_config():
    with pytest.raises(ConfigError, match="not found"):
        load_config("nonexistent", CONFIGS_DIR)


def test_all_configs_valid():
    """Every YAML file in configs/ must load successfully."""
    for path in CONFIGS_DIR.glob("*.yaml"):
        cfg = load_config(path.stem, CONFIGS_DIR)
        assert "name" in cfg
        assert "models" in cfg
        for wave in ["wave0", "wave1", "wave2", "wave3"]:
            assert wave in cfg["models"], f"{path.name} missing {wave}"
            assert cfg["models"][wave] in ("opus", "sonnet", "haiku"), \
                f"{path.name} has invalid model for {wave}: {cfg['models'][wave]}"
