---
name: refactor-simplify
description: >
  Reduce complexity, eliminate anti-patterns, and improve structural clarity in existing code.
  Use when requesting "clean up this", "make it more readable", or "reduce cyclomatic complexity".
  Do NOT use for feature additions, security hardening, or performance profiling without explicit refactoring scope.
version: "1.0"
tags: [refactoring, clean-code, complexity, maintainability]
context_priority: high
---

# Refactor & Simplify

Focused transformation workflow targeting readability, modularity, and long-term maintainability.

## 🎯 When to Use

- User shares deeply nested, overly long, or highly coupled code
- User asks to "simplify this", "extract methods", or "improve readability"
- Code exhibits duplicated logic, magic numbers, or inconsistent naming
- Do NOT use for adding new business logic, fixing runtime bugs, or optimizing performance without structural cleanup
- Do NOT use when the user explicitly requests "keep it as-is, just add comments"

## 🧠 Core Workflow

**Step 1 — Measure Complexity**
Identify high-complexity areas: functions > 30 lines, nesting > 3 levels, cyclomatic complexity > 10, or tightly coupled classes. Log exact metrics.

**Step 2 — Apply Structural Simplification**
- IF deep nesting → extract guard clauses, early returns, or strategy patterns.
- IF duplicated logic → extract reusable functions or utility modules.
- IF large functions → decompose into single-responsibility units.
- IF implicit state → make dependencies explicit via parameters or DI.

**Step 3 — Enforce Consistency**
Standardize naming (variables, functions, classes), align formatting, remove dead code, and replace magic numbers/strings with named constants or enums.

**Step 4 — Validate Behavioral Equivalence**
Ensure refactored code produces identical outputs for identical inputs. IF public interfaces must change → wrap in compatibility layer and explicitly mark `@deprecated`.

**Step 5 — Output & Diff**
Return before/after comparison, list of applied transformations, and any required follow-up actions (e.g., updating call sites).

## 📋 Output Format

# Section 1 — Refactor Report
```json
{
  "status": "success | partial | error",
  "complexity_before": {"lines": 0, "nesting_depth": 0, "functions_extracted": 0},
  "complexity_after": {"lines": 0, "nesting_depth": 0, "functions_extracted": 0},
  "changes_applied": ["early_returns", "extract_method", "remove_duplication"],
  "breaking_changes": false
}
```

Section 2 — Refactored Code
Provide the cleaned code block. Add // `REFACTOR`: or `# REFACTOR`: comments above modified sections. Keep structure flat and intent explicit.

⚠️ Fallback Behavior
If the code is already well-structured and no meaningful simplification exists, respond with:

```json
{
  "status": "partial",
  "message": "Code already meets modern readability standards. No structural refactoring required.",
  "suggestion": "Consider adding type annotations, documentation, or test coverage instead."
}
```

If the user's request conflicts with framework conventions (e.g., forcing procedural style in OOP), warn: 
`"⚠️ Proposed simplification conflicts with detected framework paradigms. Proceed only if intentional."`
