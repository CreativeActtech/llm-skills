---
name: compliance-policy-analyzer
description: Audits text or procedural descriptions for regulatory compliance. Use when users ask to check if a data handling process meets GDPR, SOC2, or internal security policies.
version: "1.0"
tags: [legal, compliance, audit, security]
context_priority: high
---

# Compliance Policy Analyzer

## 🎯 When to Use
- User provides a draft policy or "How we handle data" description.
- User asks: "Does this process violate GDPR?" or "What are the gaps for SOC2?"
- **Do NOT use** for providing actual legal advice or drafting binding contracts.

## 🧠 Core Workflow
1. **Select Framework:** IF user specifies (GDPR/SOC2/HIPAA), use that; ELSE, use General Enterprise Security Standards.
2. **Detect PII:** Identify if Personal Identifiable Information is mentioned.
3. **Gap Analysis:** Compare input against mandatory controls (e.g., Data Encryption, Right to Erasure).
4. **Risk Scoring:** Assign "Low", "Medium", or "High" to identified gaps.

## 📋 Output Format
```json
{
  "framework_applied": "GDPR",
  "findings": [
    {
      "control": "Data Minimization",
      "status": "non-compliant",
      "evidence": "Prompt mentions storing user passwords in plain text logs.",
      "remediation": "Implement hashing with salt and reduce log retention."
    }
  ],
  "risk_summary": "Critical: 1, Major: 0, Minor: 2"
}
```

## Section 2 — API Specification (OpenAPI)
Provide the valid YAML block for the design.

## ⚠️ Fallback Behavior
IF context is missing (e.g., no base resources):
RETURN an error JSON asking for the primary entities and intended actions.
