---
name: python-type-hinter
description: >
  Adds PEP 484 type hints to existing Python code.
  Use when requesting "add type hints", "annotate this function", or "improve typing coverage".
  Do NOT use for runtime type checking, generating stubs for C extensions, or converting to static types (e.g., mypyc).
version: "1.1"
tags: [python, typing, pep484, mypy, static-analysis]
context_priority: medium
---

# Python Type Hinter

Intelligent inference and insertion of type annotations based on variable usage, return statements, and common library types.

## 🎯 When to Use

- User provides untyped Python code and asks to "add type hints" or "make it mypy‑ready"
- Code uses complex data structures (dict, list, custom classes) where types are ambiguous
- User wants to improve IDE autocompletion or documentation
- Do NOT use when the user explicitly wants to keep dynamic typing or is targeting Python < 3.5
- Do NOT use for generating `.pyi` stub files or runtime `isinstance` checks

## 🧠 Core Workflow

**Step 1 — Analyze Code Context**
Parse AST to identify functions, variables, and return statements. Detect patterns:
- `if isinstance(x, int):` → narrow type to `int`
- `return []` → `List[Any]` or attempt to infer element type
- `self.attr = value` → infer instance attribute type

**Step 2 — Infer Types Heuristically**
- IF variable is assigned a literal (`42`, `"text"`, `[1,2]`) → use literal type.
- IF function always returns same type → annotate return type.
- IF function may return `None` or another type → use `Optional[Type]` or `Union`.
- IF parameter has default value → infer from default.
- IF external library call (e.g., `requests.get()`) → use common known return types (`Response`).

**Step 3 — Add Imports**
Insert `from typing import List, Dict, Optional, Union, ...` as needed. Avoid over‑importing.

**Step 4 — Annotate in Place**
Produce the same code with inline type hints added. Preserve original runtime behavior. Use comments for complex cases (e.g., `# type: ignore` when inference is uncertain).

**Step 5 — Validation Recommendation**
Suggest running `mypy --strict` on the annotated code and provide a diff of changes.

## 📋 Output Format

# Section 1 — Type Hint Report
```json
{
  "status": "success",
  "functions_annotated": 4,
  "variables_annotated": 12,
  "imports_added": ["List", "Optional"],
  "confidence_issues": ["Return type ambiguous in `process_data` → Any"]
}
```

Section 2 — Annotated Code

```python
from typing import List, Optional

def greet(name: str) -> str:
    return f"Hello, {name}"

def process_items(items: List[int], factor: Optional[float] = None) -> List[float]:
    if factor is None:
        factor = 1.0
    return [i * factor for i in items]
```

Section 3 — Suggested mypy Command

```bash
mypy --strict annotated_module.py
```

⚠️ Fallback Behavior

If the code already has complete type hints, respond with:

```json
{
  "status": "partial",
  "message": "All functions and variables already have PEP 484 annotations. No changes made.",
  "suggestion": "Consider enabling `disallow_untyped_defs = True` in mypy config for stricter enforcement."
}
```

If type inference fails for a specific block, insert # TODO: Type hint - unknown structure and note in the report.