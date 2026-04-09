# Multi-Model Behavior Comparison

The same `SKILL.md` behaves differently across models. Use this guide to calibrate expectations.

| Model Family | Strengths | Weaknesses | Recommended Adjustments |
|--------------|-----------|------------|-------------------------|
| **Claude** | Excellent at following complex workflows & JSON schemas | Occasionally verbose; may over-explain | Add `Be concise. Output only the requested JSON.` |
| **ChatGPT (GPT-4o)** | Strong reasoning & fallback code generation | Struggles with strict schema adherence | Use explicit delimiters: `Wrap response in ```json\n...\n``` ONLY` |
| **Gemini** | Fast context processing, good table handling | May skip validation steps | Add `⚠️ You MUST run the Validation Checklist before responding.` |
| **Mistral/Llama (local UIs)** | Highly deterministic with tight prompts | Lower schema compliance, limited tool awareness | Simplify workflow to 3 steps max; provide exact code fallbacks |

## Cross-Model Testing Template

Run this prompt after pasting any `SKILL.md`:

```text
Test Case 1: Straightforward match
[Insert clear, direct request matching description]
Test Case 2: Ambiguous/Edge case
[Insert vague request with hidden constraints]
Test Case 3: Negative trigger
[Insert request that explicitly falls under "Do NOT use"]

Evaluate your responses against these criteria:
1. Did you follow the exact output format?
2. Did you run the validation checklist?
3. Did you avoid using the skill when inappropriate?

Return a PASS/FAIL matrix.
```
