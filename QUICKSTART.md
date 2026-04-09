# 🚀 Quickstart: Create & Use Your First Skill

Get started in under 5 minutes. This guide walks you through creating a single-file `SKILL.md`, testing it in any browser-based LLM, and optimizing it for reliable, cross-model performance.

## 📦 Prerequisites

- A web browser with access to any LLM interface (ChatGPT, Claude, Gemini, Mistral, local UIs, etc.)
- A text editor (VS Code, Cursor, Notepad++, etc.)
- **No CLI, no dependencies, no setup required.**

## 1️⃣ Create Your Skill

Create a folder and add a single `SKILL.md` file:

```bash
mkdir csv-cleanup && cd csv-cleanup
touch SKILL.md
```

Open `SKILL.md` and paste this minimal working template:

````markdown
---
name: csv-cleanup
description: >
  Clean, normalize, and validate tabular data (CSV/TSV). Use when users share messy spreadsheets, missing values, or inconsistent formatting. Do NOT use for statistical analysis or ML modeling.
---

# CSV Cleanup Skill

## 🎯 When to Use
- User provides CSV/TSV data with missing values, inconsistent dates, or messy columns
- User asks to standardize, deduplicate, or format tabular data
- **Do NOT use** for data analysis, chart generation, or database queries

## 🧠 Core Workflow
1. Identify delimiter and column headers
2. Strip whitespace, standardize casing (snake_case)
3. Handle missing values: drop if >50% missing, else flag for manual review
4. Normalize dates to `YYYY-MM-DD`
5. Return cleaned preview + transformation log

## 📋 Output Format
```json
{
  "status": "success",
  "rows_processed": 0,
  "transformations": [],
  "cleaned_preview": "first 3 rows as CSV",
  "warnings": []
}
```

## ⚠️ Gotchas
- Dates in `MM/DD` vs `DD/MM`: validate with `^\d{2}/\d{2}/\d{4}$` before converting
- Never invent missing values. Flag them explicitly.
- Leading/trailing whitespace breaks joins → `strip()` all strings first

## ✅ Validation Checklist
- [ ] Output matches JSON schema exactly
- [ ] No hallucinated data or invented values
- [ ] All dates normalized or flagged
````

> 📌 **Naming Rule:** The `name` field must be `1-64` lowercase alphanumeric characters + hyphens, matching the folder name. No leading/trailing/consecutive hyphens.

## 2️⃣ Test in Your Browser LLM

Browser LLMs load the entire file at once. Follow this exact workflow:

1. **Open** your preferred web-based AI chat
2. **Copy** the entire contents of `SKILL.md`
3. **Paste** it into the prompt box
4. **Add a separator and task**:

   ```
   ---
   TASK: Clean this messy CSV data:
   Name, Date_Joined, Email, Region
   john doe, 12/05/2024, john@example.com , US
   jane_smith, 05/13/2024,,UK
   bob ,13/05/2024, bob@co.uk , EU
   ```

5. **Send** and observe the output

### What Happens Behind the Scenes

1. The LLM parses the `description` field and matches it to your request
2. It loads the `Core Workflow` and `Output Format` into its reasoning chain
3. It executes step-by-step, runs the `Validation Checklist`, and returns structured JSON
4. If tools are unavailable, it falls back to text/code generation per the instructions

## 3️⃣ Iterate & Optimize

First drafts rarely work perfectly. Use this **browser-native validation loop**:

### Step A: Test Trigger Accuracy

Try 3 prompts that *should* activate the skill, and 2 that *shouldn't*:

- ✅ `"Fix the formatting in this spreadsheet data"`
- ✅ `"I have a TSV with mixed date formats, can you standardize it?"`
- ❌ `"Analyze this CSV for sales trends and make a chart"`
- ❌ `"Write a Python script to read a CSV"`

If the skill triggers incorrectly, refine the `description` field. Focus on **user intent**, not implementation. Keep it under `1024` characters.

### Step B: Grade & Refine

After running, use this grading prompt:

```
Evaluate your previous response against these criteria:
1. Did you follow the exact JSON output format?
2. Did you handle missing values without inventing data?
3. Did you flag ambiguous dates instead of guessing?
Return PASS/FAIL for each with specific evidence from your output.
```

### Step C: Update the Skill

- If it fails a check → Add the correction to `⚠️ Gotchas` or `🧠 Core Workflow`
- If it's too verbose → Trim generic instructions, enforce stricter schema delimiters
- If trigger rate is low → Broaden `description` with intent-based keywords
- Repeat until consistent across all test prompts.

## 💡 Pro Tips for Browser LLMs

| Challenge | Solution |
|-----------|----------|
| **Context overload** | Keep skills ≤ 4,000 tokens. Put high-signal instructions first. |
| **Schema drift** | Add `You MUST wrap output in ```json ... ``` blocks.` |
| **Tool assumptions** | Always use `IF execution available → run, ELSE → output standalone code` |
| **False triggers** | Use explicit negative cases: `Do NOT use when...` |
| **Hallucination** | Add `NEVER invent missing values. Flag them explicitly.` |

## 📚 Next Steps

- 📖 Read the [Authoring Best Practices](docs/authoring-guide.md) for advanced instruction patterns
- 🎯 Learn how to [Optimize Skill Descriptions](docs/trigger-optimization.md) for reliable activation
- 🛠️ Use `tooling/validate-skill.js` to lint frontmatter and `tooling/count-tokens.py` to stay within context limits
- 🌐 Browse the [`skills/`](skills/) directory for production-ready examples

> ✨ **Remember:** A skill is only as good as its instructions. Ground it in real workflows, test it with realistic prompts, and iterate based on actual LLM behavior—not theoretical ideals.

```
