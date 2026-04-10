---
name: unit-test-generator
description: >
  Generate comprehensive, isolated unit and integration tests for user-provided code.
  Use when sharing functions, classes, or modules and requesting test coverage, edge-case
  validation, or mock setups. Do NOT use for writing end-to-end UI tests, performance
  benchmarking suites, or generating test data without code context.
version: "1.0"
tags: [testing, qa, tdd, mocks, coverage]
context_priority: high
---

# Unit Test Generator

Systematically creates production-ready test suites for executable code, prioritizing isolation, coverage, and maintainability.

## 🎯 When to Use

- User shares functions, classes, or modules and asks for tests
- User requests "increase coverage", "write edge cases", or "add mocks"
- Code lacks automated validation or exhibits untested branches
- Do NOT use for E2E/UI testing, load/performance benchmarking, or writing test data generators without target code
- Do NOT use for documentation-only workflows or code that cannot be logically isolated

## 🧠 Core Workflow

**Step 1 — Analyze Contracts & Dependencies**
Extract function signatures, expected return types, input constraints, and external calls (DB, HTTP, FS). Identify pure vs impure functions.

**Step 2 — Map Test Scenarios**
Generate test cases using the following matrix:
- Happy path → standard inputs matching documented behavior
- Edge cases → empty strings, nulls, boundary integers, max array lengths
- Error paths → invalid types, network failures, missing permissions
- Branch coverage → IF/ELSE, switch cases, early returns

**Step 3 — Design Isolation Strategy**
- IF external service calls exist → inject mocks/spies using the language's standard testing framework.
- IF stateful logic exists → setup/teardown hooks to reset state between tests.
- NEVER use real network/disk I/O in unit tests unless explicitly marked as integration.

**Step 4 — Generate Test Code**
Write assertions first, then setup/teardown. Follow AAA (Arrange, Act, Assert) pattern. Use descriptive test names that state expected behavior, not implementation details.

**Step 5 — Validate & Package**
Ensure 100% of generated tests pass syntactically. Verify mocks are scoped to specific tests. Return structured coverage matrix alongside test code.

## 📋 Output Format

Section 1 — Coverage & Strategy Report

```json
{
  "status": "success | partial | error",
  "language": "string",
  "framework": "string",
  "functions_tested": 0,
  "coverage_target": "0-100%",
  "test_cases": [
    {
      "target": "function_or_method_name",
      "scenario": "happy_path | edge_case | error_path",
      "mocks_used": ["dep1", "dep2"],
      "assertions_count": 0
    }
  ]
}
```

# Section 2 — Test Suite

Provide the complete test file in a fenced code block. Use framework-conventional naming (e.g., describe/it/test, def test_). Include necessary imports and mock configurations.

⚠️ Fallback Behavior
If the input lacks executable logic (e.g., configuration files, markdown, or incomplete snippets), respond with:
```json
{
  "status": "error",
  "message": "Input does not contain testable executable code. Expected functions, methods, or classes.",
  "suggestion": "Paste the source code block you want tested, or specify the entry points."
}
```

If the framework or language is unsupported by standard testing conventions, ask:
`"Which testing framework should I target? (e.g., Jest, Pytest, JUnit, Go testing, Vitest)"`
Never assume a framework if it cannot be inferred from imports or package manifests.
