# Authoring Guide: Writing Effective Single-File Skills

## 1. Start with User Intent

The `description` field determines activation. Frame it as: `"Use when [user goal], even if they don't explicitly say [keyword]."`

## 2. Design Coherent Workflows

- Keep steps sequential and numbered.
- Use explicit branching: `IF X → do A. IF Y → do B.`
- Avoid open-ended instructions like "consider options" or "choose the best approach."

## 3. Enforce Output Structure

- Provide a concrete template. LLMs pattern-match better than they follow prose.
- Use JSON for machine-readable output, Markdown tables for human-readable.
- Add: `You MUST wrap your response in ```json ... ``` blocks.`

## 4. Anticipate Failure Modes

- List exactly what the LLM will get wrong without your guidance.
- Include regex, schema constraints, or validation steps.
- Example: `⚠️ Dates in MM/DD vs DD/MM: ALWAYS validate with ^\d{2}/\d{2}/\d{4}$ before conversion.`

## 5. Keep It Lean

- Remove generic knowledge the model already has.
- Focus on project-specific conventions, non-obvious edge cases, and exact API/tool sequences.
- Test: "Would the LLM fail this step without my instruction?" If no, delete it.
