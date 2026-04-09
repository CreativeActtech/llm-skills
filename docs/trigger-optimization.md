# Trigger Optimization for Browser LLMs

## How Triggering Works
Browser LLMs scan the `description` field against the user prompt. If semantic similarity is high, the skill activates.

## Writing High-Accuracy Descriptions
- Use imperative phrasing: `"Use this when..."` instead of `"This skill does..."`
- Include synonyms & related intents: `"data cleaning", "fix formatting", "standardize columns"`
- Explicitly state negatives: `"Do NOT use for ML, stats, or database migration."`

## Testing Loop
1. Write 5 prompts that SHOULD trigger
2. Write 5 prompts that should NOT trigger
3. Paste skill + prompt into browser LLM
4. Grade: Did it activate the workflow? PASS/FAIL
5. Revise description based on failures. Repeat until 90%+ accuracy.

## Common Mistakes
- ❌ Too narrow: `"Process CSV files"` → Misses TSV, Excel, messy data
- ❌ Too broad: `"Help with data"` → Triggers on ML, DB, viz requests
- ✅ Balanced: `"Clean, normalize, and validate tabular data (CSV/TSV/Excel). Use when users mention messy data, missing values, or column standardization. Do NOT use for analysis or ML."`