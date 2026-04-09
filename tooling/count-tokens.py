#!/usr/bin/env python3
import sys
import re

def estimate_tokens(text):
    # Rough estimate: ~4 chars/token for English, adjusted for markdown/code
    chars = len(text)
    code_blocks = len(re.findall(r'```', text)) * 2
    return max(1, int((chars / 4) + (code_blocks * 10)))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python count-tokens.py <SKILL.md>")
        sys.exit(1)
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        content = f.read()
    tokens = estimate_tokens(content)
    limit = 4000
    status = "✅" if tokens <= limit else "⚠️"
    print(f"{status} {sys.argv[1]}: ~{tokens} tokens (limit: {limit})")
    if tokens > limit:
        print("   Trim reference data, shorten gotchas, or split into focused sub-skills.")