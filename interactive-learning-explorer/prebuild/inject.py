#!/usr/bin/env python3
"""
Injects structure.json and content.json into the pre-built explorer HTML shell.

Usage:
  python3 inject.py <shell.html> <structure.json> <content.json> <output.html>

The shell HTML contains placeholder markers:
  %%STRUCTURE_DATA%% — replaced with the structure JSON object
  %%CONTENT_DATA%%   — replaced with the content JSON object

The result is a fully self-contained HTML file that opens in any browser.
"""

import sys
import json

def main():
    if len(sys.argv) != 5:
        print(f"Usage: {sys.argv[0]} <shell.html> <structure.json> <content.json> <output.html>")
        sys.exit(1)

    shell_path, structure_path, content_path, output_path = sys.argv[1:]

    # Read inputs
    with open(shell_path, 'r', encoding='utf-8') as f:
        html = f.read()

    with open(structure_path, 'r', encoding='utf-8') as f:
        structure = json.load(f)

    with open(content_path, 'r', encoding='utf-8') as f:
        content = json.load(f)

    # Validate placeholders exist
    if '%%STRUCTURE_DATA%%' not in html:
        print("ERROR: %%STRUCTURE_DATA%% placeholder not found in shell HTML")
        sys.exit(1)
    if '%%CONTENT_DATA%%' not in html:
        print("ERROR: %%CONTENT_DATA%% placeholder not found in shell HTML")
        sys.exit(1)

    # Inject — replace the placeholder strings with actual JSON objects
    # The shell has: window.__STRUCTURE_DATA__ = "%%STRUCTURE_DATA%%"
    # We replace "%%STRUCTURE_DATA%%" (including quotes) with the JSON object
    html = html.replace('"%%STRUCTURE_DATA%%"', json.dumps(structure, ensure_ascii=False))
    html = html.replace('"%%CONTENT_DATA%%"', json.dumps(content, ensure_ascii=False))

    # Update page title from structure
    topic = structure.get('topic', 'Learning Explorer')
    html = html.replace(
        '<title>Interactive Learning Explorer</title>',
        f'<title>{topic} — Interactive Learning Explorer</title>'
    )

    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"✓ Injected into {output_path}")
    print(f"  Sections: {len(structure.get('sections', []))}")
    print(f"  Content entries: {len(content.get('sections', []))}")
    print(f"  Output size: {len(html):,} bytes")

if __name__ == '__main__':
    main()
