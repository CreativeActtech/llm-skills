---
name: python-structure-generator
description: >
  Analyze user-provided Python code and generate a standardized, production-ready project directory structure. Use when sharing scripts, modules, or package code and requesting "organize this", "create project layout", or "setup repository tree". Do NOT use for non-Python languages, dependency installation troubleshooting, or generating boilerplate without analyzing existing code context.
version: "1.0"
tags: [python, project-structure, scaffolding, layout, organization]
context_priority: high
---

# Python Structure Generator

Systematically converts raw or flat Python code into a standardized, scalable directory layout following modern packaging conventions.

## 🎯 When to Use

- User shares Python scripts, modules, or fragmented files and requests organization
- User asks "create project structure", "organize this repository", or "standardize layout"
- Code contains multiple imports, mixed concerns, or lacks clear package boundaries
- Do NOT use for non-Python languages, virtual environment setup, or generating new code without analyzing existing files
- Do NOT use when the user explicitly wants to keep a flat, single-file structure

## 🧠 Core Workflow

**Step 1 — Parse Entry Points & Imports**
Scan code for `if __name__ == "__main__":` blocks, top-level imports, and relative references. IF entry point exists → designate as `cli/` or `__main__.py`. IF sibling/parent imports exist → enforce `src/<package>/` layout. IF no imports → treat as standalone utility.

**Step 2 — Classify & Group Components**
Categorize detected logic into standard zones:
- Core modules → `src/<project_name>/`
- Test suites → `tests/` (mirror `src/` structure)
- Configuration & CI → `.github/`, `configs/`, or root-level `pyproject.toml`
- Artifacts & Ignored → `dist/`, `.venv/`, `__pycache__/`

**Step 3 — Resolve Package Boundaries**
Map import paths to physical directories. Create `__init__.py` files for every package directory. IF circular imports or tightly coupled modules are detected → propose logical splits and flag in warnings.

**Step 4 — Generate Tree & Setup Artifacts**
Construct a clean ASCII directory tree. Produce shell commands to recreate it. Generate minimal `pyproject.toml` and `.gitignore` if missing, aligned with detected dependencies and build tools.

**Step 5 — Validate & Package**
Cross-check against PEP 517/518 and modern `src/` layout standards. Ensure test discoverability, clean namespace isolation, and zero hardcoded absolute paths. Return structured output.

## 📋 Output Format

Section 1 — Structure Report
```json
{
  "status": "success | partial | error",
  "project_name": "string",
  "layout_type": "src_layout | flat_layout | hybrid",
  "files_categorized": 0,
  "warnings": ["circular_imports_detected", "missing_test_coverage", "mixed_responsibilities"]
}
```

# Section 2 — Directory Tree & Initialization Commands
Provide the complete tree in a fenced block. Follow with executable shell commands (`mkdir -p`, `touch`) to recreate it locally. Include a minimal `pyproject.toml` and `.gitignore` snippet if applicable.

⚠️ Fallback Behavior
If the input lacks Python code or contains only configuration/data files, respond with:

```json
{
  "status": "error",
  "message": "No executable Python code detected for structural analysis.",
  "suggestion": "Please provide Python scripts, modules, or import statements to generate an accurate project layout."
}
```

If the codebase is trivial (e.g., single script with no external imports or tests), respond with:

```json
{
  "status": "partial",
  "message": "Input represents a standalone script. Standard project scaffolding is unnecessary.",
  "suggestion": "Keep the file in the repository root or wrap it in a minimal src/ layout only if future expansion is planned."
}
```
