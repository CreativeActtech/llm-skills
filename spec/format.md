# SKILL.md Format Specification

## Structure
Every skill is a single Markdown file containing YAML frontmatter followed by Markdown body content.

## YAML Frontmatter Constraints
| Field | Type | Constraints |
|-------|------|-------------|
| `name` | string | 1-64 chars. Lowercase alphanumeric + hyphens only. No leading/trailing/consecutive hyphens. |
| `description` | string | 1-1024 chars. Must describe user intent & activation triggers. Include negative cases. |
| `version` | string | Optional. Semantic versioning (e.g., `"1.0"`, `"1.2.1"`). |
| `tags` | array | Optional. Strings for UI filtering or LLM routing hints. |
| `context_priority` | enum | Optional. `high`, `medium`, `low`. Guides attention allocation. |
| `metadata` | object | Optional. Arbitrary key-value pairs for version control or authorship. |

## Markdown Body Guidelines
- Keep total file ≤ 4,000 tokens (~3,000 words) for browser context limits.
- Use explicit section headers (`## 🎯 When to Use`, `## 🧠 Core Workflow`, etc.) for deterministic routing.
- Provide inline code blocks with clear conditional execution paths (`IF/ELSE`).
- Enforce output schemas using concrete JSON/Markdown templates.
- Avoid vendor-specific syntax (`<antThinking>`, OpenAI function schemas, etc.).