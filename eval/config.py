"""Load and validate model configuration YAML files."""
import yaml
from pathlib import Path


class ConfigError(Exception):
    pass


VALID_MODELS = {"opus", "sonnet", "haiku"}
REQUIRED_WAVES = {"wave0", "wave1", "wave2", "wave3"}


def load_config(name: str, configs_dir: Path) -> dict:
    """Load a model config by name from the configs directory."""
    path = configs_dir / f"{name}.yaml"
    if not path.exists():
        raise ConfigError(f"Config '{name}' not found at {path}")

    with open(path) as f:
        cfg = yaml.safe_load(f)

    if not isinstance(cfg, dict) or "name" not in cfg or "models" not in cfg:
        raise ConfigError(f"Config '{name}' must have 'name' and 'models' keys")

    models = cfg["models"]
    for wave in REQUIRED_WAVES:
        if wave not in models:
            raise ConfigError(f"Config '{name}' missing '{wave}' in models")
        if models[wave] not in VALID_MODELS:
            raise ConfigError(f"Config '{name}' has invalid model '{models[wave]}' for {wave}")

    return cfg
