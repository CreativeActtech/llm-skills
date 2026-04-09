---
name: code-review
description: >
  Perform structured, expert-level code review focusing on security, performance,
  maintainability, and ecosystem best practices. Use when the user shares code
  snippets, pull request diffs, or scripts and requests feedback, optimization,
  or security auditing. Do NOT use for writing new features from scratch,
  explaining basic programming syntax, or generating boilerplate without review context.
version: "1.0"
tags: [code, security, review, refactoring, quality, static-analysis]
context_priority: high
---
# Code Review
This skill guides systematic analysis and improvement of user-provided executable code.
The user shares code and optionally specifies review focus areas (e.g., security, 
performance, readability). Apply the workflow below, then return actionable findings 
alongside a structured report and optional refactored snippet.

## 🎯 When to Use
- User shares code snippets, diffs, or scripts and requests feedback or optimization
- User asks "Is this safe?", "How can I improve this?", or "Review my PR."
- Code exhibits visible anti-patterns, potential vulnerabilities, or inconsistent style
- **Do NOT use** when the user wants to generate new features from scratch, explain
  basic syntax, or run static analysis on entire repositories without context — refer
  them to appropriate generation or tooling workflows
- **Do NOT use** for non-code inputs (markdown prose, configuration files without
  executable logic, or data dumps) — this skill targets executable source code only

## 🧠 Core Workflow
**Step 1 — Ingest & Contextualize**
Parse the input to detect language, framework, and runtime environment. Identify
scope (snippet, module, or diff). Report detected structure and note any missing
context (e.g., absent imports, undefined dependencies, or implicit assumptions).

**Step 2 — Profile & Categorize**
For each relevant code section, evaluate:
- Security posture (injection, secrets, auth, unsafe deserialization, dependency risks)
- Performance characteristics (time/space complexity, I/O patterns, concurrency safety)
- Maintainability & architecture (naming, DRY, error handling, type safety, coupling)
- Readability & documentation (intent clarity, docstrings, magic numbers)

**Step 3 — Apply Review Rules**
Execute findings in order of severity. Log every issue with precise line references.
1. **Security First** — Flag critical vulnerabilities immediately. Provide concrete
   mitigation steps. Never suggest workarounds that reduce security posture.
2. **Performance Optimization** — Identify anti-patterns (N+1 queries, unbounded
   loops, redundant computations, missing caching/indexes). Suggest algorithmic or
   structural fixes that preserve original behavior.
3. **Maintainability & Best Practices** — Enforce consistent naming, proper error
   handling, type safety, and separation of concerns. Flag over-engineering or tight
   coupling. Recommend patterns aligned with the detected language ecosystem.
4. **Documentation & Readability** — Flag missing docstrings, unclear logic, or
   undocumented side effects. Recommend inline comments only where intent isn't
   self-evident from the code itself.
5. **Refactoring Safety** — If providing rewritten code, ensure zero breaking changes
   to public interfaces unless explicitly requested. Preserve original variable names
   where possible; note all behavioral deltas.

**Step 4 — Validate & Synthesize**
Cross-check findings for false positives or out-of-scope recommendations. Ensure
suggested fixes preserve original business logic and intent. Group findings by
severity (critical → info) and verify line references match the original input.

**Step 5 — Return Output**
Provide a structured JSON report followed by an optional refactored code block.
Always include explicit severity ratings, actionable recommendations, and a clear
summary. Never silently rewrite logic or introduce new dependencies without warning.

## 📋 Output Format
Return two sections:
**Section 1 — Review Report**
```json
{
  "status": "success | partial | error",
  "metadata": {
    "language": "string",
    "framework": "string | null",
    "lines_analyzed": 0,
    "scope": "snippet | module | diff"
  },
  "findings": [
    {
      "severity": "critical | high | medium | low | info",
      "category": "security | performance | maintainability | style",
      "line_start": 0,
      "line_end": 0,
      "issue": "Human-readable description of the problem",
      "impact": "Why this matters (e.g., 'exposes credentials', 'O(n^2) bottleneck')",
      "recommendation": "Actionable fix or pattern to adopt",
      "code_context": "Exact lines triggering the finding"
    }
  ],
  "summary": "Concise executive summary: X critical, Y high, Z low. Refactor before deployment.",
  "warnings": [
    {
      "context": "string",
      "issue": "Description of ambiguity, missing context, or architectural concern requiring human review",
      "suggestion": "string"
    }
  ]
}
```

**Section 2 — Refactored Code (Optional)**
Provide the improved code in a fenced block matching the original language.
Only include this section if changes are safe, non-breaking, and directly address
the identified findings. Add inline comments (`// REVIEW:` or `# REVIEW:`)
highlighting modified sections.

## ⚠️ Fallback Behavior
If the input cannot be parsed as executable code, respond with:
```json
{
  "status": "error",
  "message": "Input does not appear to be executable source code. Expected Python, JavaScript, Rust, SQL, or similar.",
  "suggestion": "Please paste the code directly or specify the language and framework."
}
```
If the user's review goal is ambiguous (e.g., "make it faster" without context,
or multiple conflicting optimization paths), ask one targeted clarifying question
before proceeding. Never silently choose an interpretation that could introduce
breaking changes, alter security posture, or modify business logic without explicit consent.
```

