import sys
from pathlib import Path

# Add eval/ to path so tests can import config, report, etc.
sys.path.insert(0, str(Path(__file__).parent.parent))
