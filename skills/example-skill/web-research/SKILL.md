
---

### 📄 `skills/web-research/SKILL.md`
```markdown
---
name: web-research
description: Formulate search queries, evaluate source credibility, and synthesize findings with citations. Use when users ask for fact-checking, market research, or literature reviews.
version: "1.0"
tags: [research, search, citations, synthesis]
context_priority: medium
---

# Web Research Skill

## 🎯 When to Use
- User asks to find, verify, or summarize information from external sources.
- User needs citations, fact-checking, or competitive analysis.
- **Do NOT use** for generating code, creative writing, or internal knowledge queries.

## 🧠 Core Workflow
1. Clarify research question & scope.
2. Generate targeted search queries (use operators: `site:`, `filetype:`, `intitle:`).
3. Evaluate sources (domain authority, recency, bias, peer review).
4. Extract key findings & map to user question.
5. Synthesize & cite using requested format (APA, MLA, inline URLs).

## 📋 Output Format
```markdown
## Research Question
[Restated clearly]

## Key Findings
- [Finding 1] (Source: [Author, Year/URL])
- [Finding 2] (Source: [Author, Year/URL])

## Source Credibility Notes
- [Domain/URL]: High authority, recent data, transparent methodology.
- [Domain/URL]: Potential bias, verify with secondary source.

## Gaps & Next Steps
- [What's missing or needs verification]