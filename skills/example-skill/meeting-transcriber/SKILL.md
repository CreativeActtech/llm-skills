---
name: meeting-transcriber
description: >
  Transform raw meeting transcripts, voice-to-text outputs, or conversation notes
  into structured summaries with action items, decisions, and key discussion points.
  Use when the user provides a transcript dump, Zoom/Teams export, or rough notes
  and requests "summarize this meeting", "extract action items", or "what did we decide?".
  Do NOT use for generating meeting agendas from scratch, scheduling meetings,
  transcribing audio files directly, or analyzing non-meeting conversations
  (e.g., customer support chats, interviews, depositions).
version: "1.0"
tags: [meetings, transcription, summarization, action-items, productivity]
context_priority: high
---

# Meeting Transcriber

This skill guides transformation of raw meeting transcripts into structured,
actionable summaries. The user provides unstructured text from a meeting
(transcript, voice-to-text output, or rough notes) and optionally specifies
focus areas (decisions only, action items, full summary). Apply the workflow
below, then return a structured summary with clear ownership and deadlines.

## 🎯 When to Use

- User pastes a meeting transcript, Zoom/Teams/Google Meet export, or voice-to-text output
- User shares rough meeting notes and requests "clean this up" or "what did we decide?"
- User asks to extract action items, decisions, or key discussion points from a conversation
- Transcript contains multiple speakers, timestamps, or disorganized dialogue
- **Do NOT use** when the user wants to generate a meeting agenda from scratch,
  schedule meetings, or transcribe raw audio/video files — refer them to appropriate
  transcription or scheduling tools
- **Do NOT use** for non-meeting conversations (customer support logs, job interviews,
  legal depositions, therapy sessions) — these require domain-specific workflows
- **Do NOT use** when the input is already a clean, structured summary — no processing needed

## 🧠 Core Workflow

**Step 1 — Ingest & Parse**
Detect the input format: raw transcript (speaker labels + timestamps), voice-to-text
(no speaker separation), or bullet notes. Identify:
- Number of speakers (detect patterns like "Speaker 1:", "[John]:", etc.)
- Presence of timestamps and their format
- Meeting metadata if available (date, title, attendees list)
If speaker labels are missing or inconsistent, normalize to `Speaker 1`, `Speaker 2`, etc.
and flag this limitation in warnings.

**Step 2 — Segment by Topic**
Group dialogue into thematic clusters using keyword detection and conversation flow:
- Detect topic shifts via phrases like "moving on to", "next item", "let's discuss"
- Cluster related exchanges even if interrupted by tangents
- Label each segment with a descriptive heading (e.g., "Q3 Budget Review", "API Redesign Discussion")
If the transcript lacks clear topic boundaries, segment by time intervals (every 5-10 min)
and infer topics post-hoc from content analysis.

**Step 3 — Extract Structured Elements**
For each segment, identify and categorize:

1. **Decisions** — Look for explicit agreement markers:
   - "Let's do X", "We agreed on Y", "Decision: Z", "Okay, we'll go with..."
   - Capture the decision, who proposed it, who approved it, and any dissenting opinions
   - Flag ambiguous outcomes ("we'll think about it") as `⚠️ pending` rather than decisions

2. **Action Items** — Extract tasks with the following schema:
   - **Owner**: Who is responsible (detect "I'll...", "[Name] will...", "assign this to...")
   - **Task**: What needs to be done (verb-first description)
   - **Deadline**: When it's due (explicit dates, "by EOW", "before next meeting")
   - **Priority**: Infer from urgency language ("ASAP", "blocker", "nice-to-have")
   If owner/deadline is missing, flag as `⚠️ incomplete action item` and suggest follow-up

3. **Key Discussion Points** — Summarize substantive exchanges:
   - Capture arguments for/against proposals with attribution
   - Note data points, metrics, or evidence cited
   - Flag unresolved debates or open questions requiring future discussion

4. **Risks & Blockers** — Identify impediments mentioned:
   - Dependencies on other teams, technical constraints, resource gaps
   - Capture severity and proposed mitigation if discussed

**Step 4 — Validate & Cross-Check**
Review extracted elements against the original transcript:
- Verify action item owners are actual participants (not misattributed)
- Confirm deadlines are realistic and explicitly stated (not inferred unless obvious)
- Check that decisions reflect consensus, not unilateral statements
- Flag any contradictions (e.g., two conflicting decisions in same meeting)
If confidence is low on any extraction, include it with a `⚠️ low-confidence` warning
rather than silently omitting or fabricating details.

**Step 5 — Return Output**
Provide structured JSON report followed by optional human-readable executive summary.
Always include attendee inference, meeting duration (if timestamps available), and
completeness score (% of action items with clear owner + deadline).

## 📋 Output Format

Return two sections:

**Section 1 — Meeting Summary Report**

```json
{
  "status": "success | partial | error",
  "metadata": {
    "meeting_title": "Inferred or provided title",
    "meeting_date": "YYYY-MM-DD or null",
    "duration_minutes": 0,
    "attendees_inferred": ["Alice", "Bob", "Charlie"],
    "attendees_provided": [],
    "speakers_detected": 3,
    "segments_identified": 5
  },
  "decisions": [
    {
      "id": "D1",
      "topic": "Segment name where decision was made",
      "decision": "Clear statement of what was decided",
      "proposed_by": "Name or null",
      "approved_by": ["Name1", "Name2"],
      "dissenting_opinions": ["Name expressed concern about X"],
      "confidence": "high | medium | low",
      "timestamp": "HH:MM:SS or null"
    }
  ],
  "action_items": [
    {
      "id": "A1",
      "owner": "Name or ⚠️ unassigned",
      "task": "Verb-first task description",
      "deadline": "YYYY-MM-DD or relative (EOW, next meeting) or ⚠️ unspecified",
      "priority": "critical | high | medium | low",
      "related_decision_id": "D1 or null",
      "status": "new | in_progress | blocked",
      "notes": "Additional context or dependencies mentioned"
    }
  ],
  "discussion_summary": [
    {
      "topic": "Descriptive heading",
      "summary": "2-3 sentence synthesis of key points",
      "key_contributors": ["Name1", "Name2"],
      "outcome": "decision_made | deferred | ongoing_discussion",
      "related_decision_ids": ["D1"],
      "related_action_item_ids": ["A1", "A2"]
    }
  ],
  "risks_blockers": [
    {
      "description": "Clear statement of the blocker",
      "severity": "critical | high | medium | low",
      "owner": "Name responsible for resolving or null",
      "mitigation_proposed": "What was suggested or null",
      "dependencies": ["Team X", "External vendor", "Budget approval"]
    }
  ],
  "open_questions": [
    "Question that requires follow-up or research before next meeting"
  ],
  "warnings": [
    {
      "type": "missing_speaker_labels | ambiguous_decision | incomplete_action_item | low_confidence",
      "detail": "Description of the issue and its impact on reliability",
      "suggestion": "How to resolve or verify (e.g., 'Confirm with Alice if she owns A3')"
    }
  ],
  "completeness_score": 0.85
}
```

**Section 2 — Executive Summary (Optional)**

If requested, provide a markdown-formatted one-pager:

```markdown
## Meeting Summary: [Title]
**Date:** YYYY-MM-DD | **Duration:** X min | **Attendees:** Alice, Bob, Charlie

### 🔑 Key Decisions
- **D1:** [Decision statement] — Approved by [Names]

### ✅ Action Items
| ID | Owner | Task | Deadline | Priority |
|----|-------|------|----------|----------|
| A1 | Alice | Deploy v2.3 | 2026-05-01 | High |

### ⚠️ Blockers
- [Blocker description] — Owner: [Name], Severity: High

### ❓ Open Questions
- [Question requiring follow-up]
```

## ⚠️ Fallback Behavior

If the input cannot be identified as a meeting transcript (no dialogue structure,
no action items, no decisions), respond with:

```json
{
  "status": "error",
  "message": "Input does not appear to be a meeting transcript. Expected dialogue with multiple speakers, action items, or decision discussions.",
  "suggestion": "Please paste the transcript directly or clarify if this is a different type of document (e.g., monologue, article, chat log)."
}
```

If the transcript is severely garbled (voice-to-text errors >30%, missing context),
return a partial extraction with explicit warnings:

```json
{
  "status": "partial",
  "message": "Transcript quality is low; some extractions may be inaccurate.",
  "warnings": [
    {
      "type": "low_transcript_quality",
      "detail": "Voice-to-text errors detected; speaker attribution unreliable",
      "suggestion": "Manual review recommended before distributing summary"
    }
  ],
  "extractions_attempted": {...}
}
```

If action items or decisions are completely absent (e.g., brainstorming session
with no conclusions), explicitly state this rather than fabricating structure:

```json
{
  "status": "success",
  "metadata": {...},
  "decisions": [],
  "action_items": [],
  "discussion_summary": [...],
  "warnings": [
    {
      "type": "no_decisions_or_actions",
      "detail": "Meeting was exploratory; no concrete decisions or action items identified",
      "suggestion": "Consider scheduling a follow-up to finalize next steps"
    }
  ]
}
```

Never invent action items, assign owners without evidence, or fabricate deadlines.
If the user requests a specific output format (e.g., Jira tickets, Asana tasks,
email draft), adapt Section 2 accordingly while preserving the JSON report in Section 1.
