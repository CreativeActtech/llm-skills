---
name: incident-post-mortem-generator
description: >
  Generate standardized SRE incident reports and Root Cause Analysis (RCA). 
  Use when users provide incident logs, timelines, or outage descriptions and 
  need a professional post-mortem document.
version: "1.0"
tags: [sre, devops, incident-response, rca, operations]
context_priority: medium
---
# Incident Post-Mortem Generator
Standardizes the transformation of chaotic incident data into professional, 
actionable Root Cause Analysis (RCA) reports based on SRE best practices.

## 🎯 When to Use
- User shares a Slack log or timeline of a production outage.
- User says: "Help me write the RCA for the database crash."
- **Do NOT use** for real-time monitoring or alerting.
- **Do NOT use** for performance tuning (use SQL Optimizer instead).

## 🧠 Core Workflow
**Step 1 — Timeline Reconstruction**
Parse timestamps to identify: Time to Detection (TTD), Time to Acknowledgement 
(TTA), and Time to Resolution (TTR).

**Step 2 — Impact Assessment**
Identify service unavailability percentages, user count affected, and data loss 
risks. Categorize severity (SEV-1 to SEV-3).

**Step 3 — Root Cause Analysis (5 Whys)**
Iteratively analyze the failure chain (e.g., Human error -> Missing validation -> 
Faulty CI/CD).

**Step 4 — Action Item Generation**
Generate "Preventative" (stop it happening again) and "Mitigative" (detect it 
faster) tasks.

## 📋 Output Format
```json
{
  "incident_summary": "Summary of what happened",
  "metrics": { "ttd_mins": 0, "ttr_mins": 0, "severity": "SEV-1" },
  "root_cause": "Detailed technical explanation",
  "five_whys": ["...", "...", "..."],
  "action_items": [
    { "task": "Add health check", "priority": "high", "owner": "SRE" }
  ]
}
```

## ⚠️ Fallback Behavior
IF no timeline is provided:
- ASK for the start and end times of the incident to calculate metrics.
