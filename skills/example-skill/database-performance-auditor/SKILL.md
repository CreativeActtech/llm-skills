---
name: database-performance-auditor
description: >
  Audit SQL queries for performance anti-patterns and indexing needs. Use when 
  users share slow queries, query plans (EXPLAIN), or schema DDLs and need 
  optimization advice.
version: "1.0"
tags: [sql, database, optimization, performance, dba]
context_priority: high
---
# Database Performance Auditor
Provides expert-level analysis of SQL queries to reduce execution time, 
resource consumption, and locking contention in enterprise databases.

## 🎯 When to Use
- User shares a SQL query and reports "It's slow."
- User provides a `DESCRIBE` or `EXPLAIN` output for analysis.
- User needs to refactor legacy SQL for modern performance (e.g., CTEs).
- **Do NOT use** for basic SQL syntax training or data visualization.
- **Do NOT use** for NoSQL databases (MongoDB/DynamoDB) unless specifically requested.

## 🧠 Core Workflow
**Step 1 — Ingest & Dialect Detection**
Detect SQL flavor (PostgreSQL, MySQL, T-SQL, Oracle). Identify primary tables.

**Step 2 — Profile Anti-Patterns**
Check for: `SELECT *`, non-SARGABLE `WHERE` clauses (e.g., `WHERE YEAR(date)`), 
Cartesian products, and N+1 patterns.

**Step 3 — Indexing & Refactoring Rules**
1. **SARGability** — Rewrite functions in `WHERE` to allow index seeks.
2. **Join Optimization** — Ensure joins are on indexed keys.
3. **Modernization** — Suggest Window Functions or CTEs to replace subqueries.

**Step 4 — Validation**
Verify that refactored SQL produces the same result set as the original. 

**Step 5 — Return Output**
Provide a structured Findings Report (JSON) and the Optimized SQL.

## 📋 Output Format
**Section 1 — Performance Report**
```json
{
  "dialect": "string",
  "critical_bottlenecks": [
    { "issue": "Full Table Scan", "impact": "High", "fix": "Add index on [column]" }
  ],
  "estimated_improvement": "e.g., 50% reduction in IO",
  "warnings": ["Potential lock contention on table X"]
}
Section 2 — Optimized SQL
Provide the rewritten query with # OPTIMIZED: comments.
```

## ⚠️ Fallback Behavior
IF the schema (table structure) is missing:
- WARN that optimization is limited without knowing existing indexes.
- SUGGEST: "Please provide the CREATE TABLE statement for better accuracy."
