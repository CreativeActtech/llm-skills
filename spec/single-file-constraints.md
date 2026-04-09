# Single-File Constraints & Browser Optimization

## Context Economy
- Browser LLMs load the entire `SKILL.md` at once. There is no progressive disclosure.
- Prioritize high-signal instructions at the top. Move reference tables, schemas, or edge cases to the bottom.
- Use explicit routing instructions: `If task is X, skip to Section Y. If Z, ignore Section W.`

## Self-Containment Rules
- No external file paths (`references/`, `scripts/`, `assets/` are flattened or inlined).
- All examples, schemas, regex patterns, and small datasets must reside within the file.
- Large lookup tables (>500 lines) should be summarized or replaced with generation logic.

## Token Budgeting
- Recommended max: 4,000 tokens
- Frontmatter + When-to-Use: ~150 tokens
- Core Workflow: ~800 tokens
- Output Format + Examples: ~400 tokens
- Gotchas + Fallbacks: ~600 tokens
- Reference/Checklist: ~1,000 tokens
- Buffer: ~1,050 tokens for system prompt & conversation history

## Deterministic Execution
- Replace open-ended suggestions with explicit branching (`IF/ELSE`, `CASE/DEFAULT`).
- Provide exact validation steps the LLM must run before finalizing output.
- Avoid ambiguous terms like "consider", "optionally", or "if appropriate".