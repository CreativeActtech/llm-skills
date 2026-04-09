---
name: data-cleanup
description: >
  Clean, normalize, and restructure raw or messy tabular data. Use when the user
  provides CSV, TSV, JSON arrays, or pasted table data that contains issues like
  inconsistent formatting, duplicate rows, missing values, mixed data types, or
  malformed headers. Also use when asked to standardize date formats, normalize
  casing, strip whitespace, or coerce columns to consistent types.
  Do NOT use for database query writing, statistical analysis, chart generation,
  or cleaning unstructured prose or log files.
version: "1.0"
tags: [data, cleaning, normalization, csv, tabular]
context_priority: high
---

# Data Cleanup

This skill guides structured cleaning and normalization of raw tabular data.
The user provides messy data (CSV, TSV, JSON array, or a pasted table) and
optionally describes the target schema or cleaning goals. Apply the workflow
below, then return the cleaned data alongside a change log.

## 🎯 When to Use

- User pastes or uploads CSV, TSV, JSON arrays, or markdown tables containing
  visible data quality issues
- User asks to "clean", "fix", "normalize", "deduplicate", or "standardize" data
- Data contains mixed formats: `2024/01/15` alongside `Jan 15, 2024`, or
  `TRUE` alongside `1` alongside `yes`
- Column headers are missing, duplicated, or inconsistently named
- **Do NOT use** when the user wants statistical summaries, SQL queries, charts,
  or analysis of clean data — refer them to an appropriate analysis workflow
- **Do NOT use** for unstructured text (logs, paragraphs, prose) — this skill
  targets tabular, row-column structured data only

## 🧠 Core Workflow

**Step 1 — Ingest & Identify**
Parse the input and detect its format (CSV, TSV, JSON, markdown table). Identify
the delimiter, quoting character, and encoding issues. Report the detected shape:
row count, column count, header row presence.

**Step 2 — Profile Each Column**
For every column, determine:
- Inferred data type (string, integer, float, boolean, date, mixed)
- Null / empty rate (count and percentage)
- Unique value count
- Presence of leading/trailing whitespace, inconsistent casing, or special characters

**Step 3 — Apply Cleaning Rules**
Execute the following in order. Log every change made.

1. **Headers** — Normalize to `snake_case`. Remove special characters. Deduplicate
   by appending `_2`, `_3`, etc. If no headers exist, generate `col_1`, `col_2`, …
2. **Whitespace** — Strip leading/trailing whitespace from all string values.
   Collapse internal multi-space sequences to a single space.
3. **Casing** — Apply consistent casing per column type: `UPPER` for country/state
   codes, `Title Case` for proper names, `lower` for categorical flags unless
   the user specifies otherwise.
4. **Duplicates** — Remove exact duplicate rows. Flag near-duplicates (rows
   identical except for casing or whitespace) with a `⚠️ near-duplicate` warning
   rather than silently deleting them.
5. **Booleans** — Normalize `yes/no`, `true/false`, `1/0`, `Y/N` to `true`/`false`
   within columns where all non-null values resolve to a boolean.
6. **Dates** — Detect and normalize date strings to ISO 8601 (`YYYY-MM-DD`).
   If a date is ambiguous (e.g., `04/05/06`), flag it and preserve the original
   in a companion `_raw` column rather than guessing.
7. **Nulls** — Standardize `N/A`, `n/a`, `NULL`, `none`, `-`, `""` to a true
   empty cell. Do not impute missing values unless the user explicitly requests it.
8. **Type Coercion** — For columns where ≥95% of non-null values parse cleanly
   as a numeric type, coerce the column and flag the outlier rows.

**Step 4 — Validate**
After cleaning, re-profile the data and check that:
- All column types are now consistent
- No headers are duplicated
- Row count delta (removed duplicates) is accounted for in the change log

**Step 5 — Return Output**
Provide the cleaned data in the same format as the input (CSV → CSV, JSON → JSON,
etc.) unless the user requests a different format. Always include the change log.

## 📋 Output Format

Return two sections:

**Section 1 — Cleaned Data**
The cleaned dataset in the original format, enclosed in a fenced code block.

**Section 2 — Change Log**

```json
{
  "status": "success | partial | error",
  "summary": {
    "rows_input": 0,
    "rows_output": 0,
    "duplicates_removed": 0,
    "near_duplicates_flagged": 0,
    "columns_renamed": [],
    "columns_type_coerced": []
  },
  "changes": [
    {
      "column": "column_name | __row__ | __global__",
      "rule": "whitespace | casing | boolean | date | null | duplicate | header | coercion",
      "detail": "Human-readable description of what changed and why"
    }
  ],
  "warnings": [
    {
      "column": "column_name",
      "issue": "Description of ambiguity or data quality concern requiring human review",
      "rows_affected": []
    }
  ]
}
```

## ⚠️ Fallback Behavior

If the input cannot be parsed as tabular data, respond with:

```json
{
  "status": "error",
  "message": "Input does not appear to be tabular data. Expected CSV, TSV, JSON array, or markdown table.",
  "suggestion": "Please paste your data directly or describe its format."
}
```

If the user's cleaning goal is ambiguous (e.g., "fix the dates" when multiple
date formats are present), ask one targeted clarifying question before proceeding.
Never silently choose an interpretation that could result in data loss.
