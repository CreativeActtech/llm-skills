#!/bin/bash
# generate-fallbacks.sh
# Quick helper to append standard tool-conditional blocks to a SKILL.md

if [ -z "$1" ]; then
  echo "Usage: ./generate-fallbacks.sh <SKILL.md>"
  exit 1
fi

cat >> "$1" << 'EOF'

## 🛠️ Tool & Code Fallbacks
IF you have access to a code execution environment:
  - Run the provided script and return structured output.
  - Capture and report any errors clearly.
ELSE:
  - Output the complete, self-contained script.
  - Include clear run instructions (`pip install`, `chmod +x`, `python script.py`, etc.).
  - Add error handling for missing dependencies or invalid inputs.
EOF

echo "✅ Appended fallback template to $1"
