---
name: web-research
description: >
  Formulate targeted search queries, evaluate source credibility, and synthesize
  findings with proper citations. Use when the user requests fact-checking,
  market research, literature reviews, competitive analysis, or verification of
  claims against external sources. Do NOT use for generating original code,
  creative writing, internal knowledge queries, or answering questions that
  require real-time data beyond the model's knowledge cutoff without explicit
  user authorization to search.
version: "1.0"
tags: [research, search, citations, synthesis, fact-checking, credibility]
context_priority: high
---
# Web Research
This skill guides systematic investigation and synthesis of information from
external web sources. The user poses a research question and optionally specifies
scope constraints (date range, domain preferences, citation format). Apply the
workflow below, then return synthesized findings alongside a credibility audit log.

## 🎯 When to Use
- User asks to find, verify, compare, or summarize information from external sources
- User requests citations, fact-checking, competitive analysis, or literature reviews
- Query involves time-sensitive data, emerging topics, or claims requiring external validation
- **Do NOT use** when the user wants to generate original code, creative content,
  or hypothetical scenarios — refer them to appropriate generation workflows
- **Do NOT use** for questions answerable from internal knowledge alone without
  external verification needs — avoid unnecessary search overhead
- **Do NOT use** for queries requiring authenticated/paywalled content access,
  private databases, or real-time APIs unless the user explicitly provides
  credentials and authorizes external tool use

## 🧠 Core Workflow
**Step 1 — Clarify & Scope**
Parse the research question to identify:
- Core claim or information need (factual verification, trend analysis, comparison)
- Temporal constraints (e.g., "last 12 months", "post-2020 studies")
- Domain preferences or exclusions (e.g., "peer-reviewed only", "exclude blogs")
- Output format requirements (APA, MLA, inline URLs, bullet summary)
If scope is ambiguous (e.g., "tell me about AI"), ask one targeted clarifying
question before proceeding. Never silently assume breadth or depth preferences.

**Step 2 — Query Strategy & Source Discovery**
Generate 3-5 targeted search queries using advanced operators:
- `site:` for domain restriction (e.g., `site:.gov`, `site:arxiv.org`)
- `filetype:` for document type filtering (e.g., `filetype:pdf` for reports)
- `intitle:`/`inurl:` for precision targeting
- Date-range filters where supported
Execute searches and collect top 10-15 candidate sources per query. Deduplicate
by URL canonicalization and content hashing.

**Step 3 — Credibility Assessment & Extraction Rules**
Evaluate each source using a weighted rubric. Log scores and rationale.
1. **Authority** — Prefer .gov, .edu, peer-reviewed journals, established news
   outlets with editorial standards. Flag personal blogs, anonymous sources,
   or domains with known misinformation histories with `⚠️ low-authority`.
2. **Recency** — Prioritize sources within user-specified timeframe. For
   time-sensitive topics (tech, medicine, policy), flag sources >2 years old
   unless seminal/historical context is requested.
3. **Bias & Transparency** — Assess political/commercial bias using domain
   reputation databases. Prefer sources with clear methodology, funding
   disclosures, and correction policies. Flag opinion pieces as `opinion` not `fact`.
4. **Corroboration** — Cross-check key claims across ≥2 independent high-credibility
   sources. Flag singleton claims (only one source) with `⚠️ uncorroborated`.
5. **Extraction** — Pull direct quotes, statistics, or conclusions with precise
   attribution (author, publication date, URL, access date). Never paraphrase
   in a way that alters original meaning or certainty level.

**Step 4 — Synthesis & Gap Analysis**
Group findings by theme or claim. Resolve conflicts by weighting source credibility.
- If sources agree: synthesize consensus with representative citations
- If sources conflict: present both positions with credibility context, avoid
  false equivalence
- Identify gaps: missing perspectives, outdated data, or unanswered sub-questions
Document all synthesis decisions to enable auditability.

**Step 5 — Return Output**
Provide structured JSON report followed by optional human-readable summary.
Always include credibility indicators, citation metadata, and warnings for
low-confidence findings. Never present unverified claims as established fact.

## 📋 Output Format
Return two sections:
**Section 1 — Research Report**
```json
{
  "status": "success | partial | error",
  "metadata": {
    "research_question": "string",
    "queries_executed": ["query1", "query2"],
    "sources_evaluated": 0,
    "sources_cited": 0,
    "time_range_covered": "YYYY-MM-DD to YYYY-MM-DD",
    "domains_covered": [".gov", ".org"]
  },
  "findings": [
    {
      "claim": "Concise statement of finding",
      "confidence": "high | medium | low",
      "corroboration_count": 2,
      "sources": [
        {
          "title": "Article Title",
          "author": "Author Name or Organization",
          "url": "https://...",
          "published_date": "YYYY-MM-DD",
          "accessed_date": "YYYY-MM-DD",
          "credibility_score": 0.92,
          "credibility_factors": ["peer_reviewed", "recent", "transparent_methodology"],
          "bias_flag": "none | left | right | commercial | opinion",
          "excerpt": "Direct quote or precise paraphrase with page/section"
        }
      ]
    }
  ],
  "summary": "Executive synthesis: X high-confidence findings, Y contested claims. Key consensus: ...",
  "warnings": [
    {
      "claim": "string",
      "issue": "Description of credibility concern, data gap, or conflicting evidence",
      "sources_involved": ["url1", "url2"],
      "suggestion": "Manual verification recommended; consider consulting [alternative source type]"
    }
  ],
  "gaps": [
    "Unanswered sub-question or missing perspective requiring further research"
  ]
}
```

**Section 2 — Human-Readable Summary (Optional)**
If requested, provide a markdown-formatted summary with inline citations.
Use `[Author, Year]` or `[URL]` format per user preference. Add `> ⚠️` callouts
for low-confidence findings or contested claims.

## ⚠️ Fallback Behavior
If the research question is too broad, ambiguous, or lacks actionable scope, respond with:
```json
{
  "status": "error",
  "message": "Research query requires clarification to execute effectively.",
  "suggestion": "Please specify: (1) the exact claim or topic to investigate, (2) preferred date range, and (3) any domain preferences (e.g., academic, government, news)."
}
```
If no credible sources are found after exhaustive search, return:
```json
{
  "status": "partial",
  "message": "No high-credibility sources found matching query constraints.",
  "attempted_queries": ["..."],
  "suggestion": "Consider broadening date range, relaxing domain filters, or rephrasing the research question."
}
```
Never silently present low-credibility sources as authoritative. If the user
requests real-time data beyond the model's knowledge cutoff, explicitly flag
this limitation and request authorization to use live search tools before proceeding.
```