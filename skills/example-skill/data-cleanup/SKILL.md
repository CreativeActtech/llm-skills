
---

### 📄 `skills/data-cleanup/SKILL.md`
```markdown
---
name: data-cleanup
description: Clean, normalize, and validate tabular data (CSV, TSV, Excel). Use when users mention messy data, missing values, column renaming, or format standardization.
version: "1.0"
tags: [data, csv, cleaning, validation]
context_priority: high
---

# Data Cleanup Skill

## 🎯 When to Use
- User provides or references a CSV/TSV/Excel file with inconsistent formatting, missing values, or non-standard columns.
- User asks to standardize dates, deduplicate rows, fix casing, or validate against a schema.
- **Do NOT use** for statistical analysis, machine learning, or database migration.

## 🧠 Core Workflow
1. Identify input format & delimiter.
2. Detect anomalies: missing values, inconsistent casing, date formats, duplicates.
3. Apply transformations in this exact order:
   - Standardize column names (snake_case, lowercase)
   - Handle missing values (drop if >50% missing, else impute with median/mode)
   - Normalize dates to ISO 8601 (`YYYY-MM-DD`)
   - Deduplicate rows
4. Validate output against expected schema.
5. Return cleaned data + transformation log.

## 📋 Output Format
```json
{
  "status": "success",
  "records_processed": 0,
  "transformations_applied": ["standardized_columns", "imputed_missing", "normalized_dates"],
  "cleaned_data_preview": "first 5 rows as CSV",
  "warnings": ["Column 'email' had 12 missing values, imputed with 'unknown'"]
}