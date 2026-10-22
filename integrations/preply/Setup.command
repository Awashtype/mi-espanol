#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Run this setup on your Mac."
  exit 1
fi
if ! command -v python3 >/dev/null; then
  echo "Install Python 3 from python.org, then run this again."
  exit 1
fi
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python lesson_sync.py init
.venv/bin/python lesson_sync.py setup
echo "Next: follow the test steps in integrations/preply/README.md."
read -r -p "Press Enter to close. "
