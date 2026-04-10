# 🌐 llm-skills

**@ CreativeAct Technologies, 2026**

<div align="center">
  <img src="https://github.com/CreativeActtech/llm-skills/blob/main/assets/LLM-SKILLS.png" height=300 width=400>
</div>
---

A **model-agnostic, single-file framework** for extending browser-based LLMs with specialized capabilities. Upload or paste one `SKILL.md` into any web-based AI interface to instantly activate structured workflows, output schemas, and fallback logic.

> ✨ **Zero dependencies. Zero setup. Just Markdown.**

## 🎯 Why Single-File?

Traditional agent skill systems rely on multi-file directories, progressive disclosure, and CLI-based execution. Browser LLMs operate differently:

- 📥 **No file system access**: Everything must be self-contained in one `SKILL.md`
- 🧠 **Single-context loading**: The entire prompt enters the context window at once
- 🔌 **Model-agnostic**: Works with Claude, ChatGPT, Gemini, Mistral, open-weight UIs, and local web frontends
- ⚡ **Zero setup**: Copy → Paste → Activate

This framework adapts the [Agent Skills specification](https://agentskills.io) for **direct browser upload**, enforcing context efficiency and cross-model compatibility.

## 📐 SKILL.md Structure (Single-File Optimized)

```yaml
---
name: skill-identifier          # lowercase, hyphens only, ≤64 chars
description: Clear trigger + when-to-use guidance, ≤1024 chars
version: "1.0"                  # optional
tags: [domain, workflow]        # optional
context_priority: high          # optional: high|medium|low
---
```

## 🛠️ Quickstart

1. Copy any `skills/*/SKILL.md` file
2. Paste into your browser LLM chat (Claude, ChatGPT, Gemini, etc.)
3. Prompt naturally: The LLM matches your request to the skill's description
4. Receive structured output per the skill's Output Format

>💡 Tip: Keep skills ≤ 4,000 tokens. Put high-signal instructions first, reference data last

<br> 

## ✅ Validation

Use the browser-compatible validator:

```bash
# In terminal (Node.js)
node tooling/validate-skill.js skills/data-cleanup/SKILL.md

# Or paste into browser console (if running locally)
```

Or use the token counter to stay within context limits:

```bash
python tooling/count-tokens.py skills/data-cleanup/SKILL.md
# Output: 3,842 tokens ✓ (under 4,000 limit)
```

<br>

## 🤝 Contributing

1. Fork the repo
2. Create `skills/<your-skill>/SKILL.md` following the template
3. Keep it ≤ 4,000 tokens and fully self-contained
4. Submit a PR with 2 test prompts that activate it

<br>

## License

MIT — Use, modify, and distribute freely. Designed for open, interoperable AI workflows.
