# SKILL.md Specification

**Version:** 1.0  
**Last Updated:** 2026  

This document defines the formal specification for `SKILL.md` files — single-file, model-agnostic skill definitions for browser-based LLMs.

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Frontmatter Schema](#frontmatter-schema)
4. [Content Sections](#content-sections)
5. [Validation Rules](#validation-rules)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## Overview

### Purpose

`SKILL.md` provides a standardized format for encoding specialized workflows, output schemas, and fallback logic that can be activated in any browser-based LLM interface through copy-paste or file upload.

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Single-File** | Everything must be self-contained; no external dependencies or multi-file structures |
| **Model-Agnostic** | Works with Claude, ChatGPT, Gemini, Mistral, and any web-based LLM interface |
| **Context-Efficient** | Optimized for ≤4,000 tokens; high-signal instructions first, reference data last |
| **Zero-Setup** | Copy → Paste → Activate; no installation, configuration, or tooling required |

### Use Cases

- Data cleaning and normalization workflows
- Code review and refactoring protocols
- Research synthesis and summarization
- Incident post-mortem generation
- Database performance auditing
- Custom output formatting and schema enforcement

---

## File Structure

A valid `SKILL.md` consists of two parts:

```markdown
---
name: skill-identifier
description: Clear trigger + when-to-use guidance
version: "1.0"
tags: [domain, workflow]
context_priority: high
---

# Skill Title

[Skill content: workflow, output format, fallback behavior]
```

### Required Elements

| Element | Location | Required |
|---------|----------|----------|
| YAML frontmatter | Top of file (between `---` delimiters) | ✅ Yes |
| `name` field | Inside frontmatter | ✅ Yes |
| `description` field | Inside frontmatter | ✅ Yes |
| Content body | After frontmatter | ✅ Yes |

### Optional Elements

| Element | Location | Required |
|---------|----------|----------|
| `version` | Inside frontmatter | ❌ No |
| `tags` | Inside frontmatter | ❌ No |
| `context_priority` | Inside frontmatter | ❌ No |

---

## Frontmatter Schema

### `name` (Required)

**Type:** String  
**Constraints:**
- Lowercase alphanumeric characters and hyphens only: `^[a-z0-9-]+$`
- Length: 1–64 characters
- No leading, trailing, or consecutive hyphens

**Examples:**
```yaml
name: data-cleanup              # ✅ Valid
name: code-review               # ✅ Valid
name: Data-Cleanup              # ❌ Invalid: uppercase
name: data_cleanup              # ❌ Invalid: underscore
name: -data-cleanup             # ❌ Invalid: leading hyphen
name: data--cleanup             # ❌ Invalid: consecutive hyphens
```

### `description` (Required)

**Type:** String  
**Constraints:**
- Length: 1–1024 characters
- Must clearly state:
  1. **Trigger conditions**: When the skill should activate
  2. **User intent patterns**: Natural language requests that map to this skill
  3. **Exclusions**: When NOT to use this skill

**Format Recommendation:**
```yaml
description: >
  Use when the user [provides X / asks for Y]. Also use when they mention
  [related keywords] even if they don't explicitly say [skill name].
  Do NOT use for [unrelated use case A] or [unrelated use case B].
```

**Example:**
```yaml
description: >
  Clean, normalize, and restructure raw or messy tabular data. Use when the user
  provides CSV, TSV, JSON arrays, or pasted table data that contains issues like
  inconsistent formatting, duplicate rows, missing values, mixed data types, or
  malformed headers.
  Do NOT use for database query writing, statistical analysis, chart generation,
  or cleaning unstructured prose or log files.
```

### `version` (Optional)

**Type:** String  
**Format:** Semantic versioning recommended (`"1.0"`, `"1.2.3"`)

```yaml
version: "1.0"
```

### `tags` (Optional)

**Type:** Array of strings  
**Purpose:** Categorization for discovery and filtering

```yaml
tags: [data, cleaning, normalization, csv, tabular]
```

### `context_priority` (Optional)

**Type:** String  
**Allowed Values:** `high`, `medium`, `low`  
**Purpose:** Hint for token allocation when context window is constrained

```yaml
context_priority: high    # Keep this skill in context even under pressure
context_priority: low     # Can be trimmed if space is needed
```

---

## Content Sections

While the body content is flexible, the following structure is recommended for maximum clarity and LLM compliance:

### 1. Title (H1)

```markdown
# Skill Name

Brief one-sentence overview of what this skill does.
```

### 2. When to Use (H2)

```markdown
## 🎯 When to Use

- Bullet list of activation triggers
- Include both explicit and implicit user intents
- Clearly state exclusion criteria
```

### 3. Core Workflow (H2)

```markdown
## 🧠 Core Workflow

**Step 1 — [Action]**
Description of step 1.

**Step 2 — [Action]**
Description of step 2.

[Continue for all steps...]
```

**Guidelines:**
- Number steps sequentially
- Use explicit branching: `IF X → do A. IF Y → do B.`
- Avoid open-ended instructions like "consider options"

### 4. Output Format (H2)

```markdown
## 📋 Output Format

Describe the exact structure the LLM should produce. Use code blocks for templates.

**Section 1 — [Output Type]**
The cleaned/processed data in the requested format.

**Section 2 — [Metadata]**
```json
{
  "status": "success",
  "summary": { ... }
}
```
```

### 5. Fallback Behavior (H2)

```markdown
## ⚠️ Fallback Behavior

Define responses for edge cases:

If [error condition], respond with:
```json
{
  "status": "error",
  "message": "...",
  "suggestion": "..."
}
```
```

---

## Validation Rules

Use the provided validator to check your `SKILL.md`:

```bash
node tooling/validate-skill.js skills/your-skill/SKILL.md
```

### Automated Checks

| Check | Rule | Error Message |
|-------|------|---------------|
| Frontmatter presence | File must start with `---\n...\n---` | `❌ Missing YAML frontmatter` |
| Name presence | `name:` field required | `❌ Missing name or description` |
| Description presence | `description:` field required | `❌ Missing name or description` |
| Name format | `^[a-z0-9-]+$` | `Name must be lowercase alphanumeric + hyphens only` |
| Name length | 1–64 characters | `Name must be 1-64 chars` |
| Name hyphens | No leading/trailing/consecutive | `No leading/trailing/consecutive hyphens` |
| Description length | 1–1024 characters | `Description must be 1-1024 chars` |

### Manual Checks (Recommended)

- [ ] Token count ≤ 4,000 (use `python tooling/count-tokens.py`)
- [ ] Workflow steps are sequential and unambiguous
- [ ] Output format includes concrete template
- [ ] Fallback behavior covers at least 2 error scenarios
- [ ] Exclusion criteria prevent false activations

---

## Best Practices

### 1. Start with User Intent

Frame the `description` as activation logic:

```yaml
# ❌ Weak
description: "A skill for reviewing code."

# ✅ Strong
description: >
  Use when the user shares code snippets, pull request diffs, or asks for
  "feedback", "issues", "bugs", or "improvements". Also use when they mention
  "code quality", "best practices", or "refactoring".
  Do NOT use for explaining how code works or writing new code from scratch.
```

### 2. Design Coherent Workflows

- Keep steps sequential and numbered
- Use explicit branching logic
- Avoid vague instructions

```markdown
# ❌ Unclear
"Consider the best approach and apply it."

# ✅ Explicit
"IF the function exceeds 50 lines → extract helper functions.
 IF nested conditionals exceed 3 levels → refactor with early returns."
```

### 3. Enforce Output Structure

Provide concrete templates. LLMs pattern-match better than they follow prose:

```markdown
# ❌ Vague
"Return a summary of your findings."

# ✅ Structured
"You MUST wrap your response in ```json ... ``` blocks using this schema:
{
  \"status\": \"success | partial | error\",
  \"findings\": [...],
  \"recommendations\": [...]
}"
```

### 4. Anticipate Failure Modes

List exactly what the LLM will get wrong without guidance:

```markdown
⚠️ Dates in MM/DD vs DD/MM: ALWAYS validate with ^\d{2}/\d{2}/\d{4}$ before conversion.
If ambiguous, preserve original in a companion `_raw` column.
```

### 5. Keep It Lean

Remove generic knowledge the model already has. Focus on:
- Project-specific conventions
- Non-obvious edge cases
- Exact API/tool sequences

**Test:** "Would the LLM fail this step without my instruction?" If no, delete it.

---

## Examples

### Example 1: Data Cleanup

See [`skills/example-skill/data-cleanup/SKILL.md`](../../skills/example-skill/data-cleanup/SKILL.md)

### Example 2: Code Review

See [`skills/example-skill/code-review/SKILL.md`](../../skills/example-skill/code-review/SKILL.md)

### Example 3: Web Research

See [`skills/example-skill/web-research/SKILL.md`](../../skills/example-skill/web-research/SKILL.md)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026 | Initial specification |

---

## License

MIT — Use, modify, and distribute freely. Designed for open, interoperable AI workflows.
