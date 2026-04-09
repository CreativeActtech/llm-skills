
---

### 📄 `skills/code-review/SKILL.md`
```markdown
---
name: code-review
description: Perform structured code review focusing on security, performance, and maintainability. Use when users ask for code review, security audit, or refactoring advice.
version: "1.0"
tags: [code, security, review, refactoring]
context_priority: medium
---

# Code Review Skill

## 🎯 When to Use
- User shares code snippets and requests feedback, optimization, or security checks.
- User asks "Is this safe?", "How can I improve this?", or "Review my PR."
- **Do NOT use** for writing new code from scratch or explaining basic syntax.

## 🧠 Core Workflow
1. Parse language & framework from context.
2. Check security vulnerabilities (SQLi, XSS, hardcoded secrets, unsafe deserialization).
3. Check performance anti-patterns (N+1 queries, unbounded loops, missing indexes).
4. Check maintainability (naming, DRY, error handling, type safety).
5. Return structured review with severity levels.

## 📋 Output Format
```json
{
  "language": "python",
  "findings": [
    {"severity": "critical", "line": 12, "issue": "Hardcoded API key", "fix": "Use environment variable"},
    {"severity": "warning", "line": 45, "issue": "Unbounded loop", "fix": "Add pagination or limit"}
  ],
  "summary": "2 critical, 1 warning. Refactor before deployment.",
  "refactored_snippet": "..."
}