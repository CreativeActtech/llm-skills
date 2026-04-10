---
name: api-design-standardizer
description: >
  Scaffold and audit RESTful API designs against enterprise standards. Use when 
  the user needs to design endpoints, generate OpenAPI/Swagger schemas, or 
  ensure naming consistency (kebab-case, resource-nesting).
version: "1.1"
tags: [api, architecture, openapi, backend, standards]
context_priority: high
---
# API Design Standardizer
Guides the systematic creation and validation of RESTful interfaces. This skill 
enforces industry-standard constraints (OpenAPI 3.1) and enterprise naming 
conventions to ensure interoperability and security.

## 🎯 When to Use
- User needs to convert business requirements into a technical API contract.
- User asks for a review of existing endpoint structures or URI paths.
- User requests an OpenAPI/Swagger YAML or JSON definition from a list of features.
- **Do NOT use** for generating client-side frontend code or implementation logic.
- **Do NOT use** for SOAP, GraphQL, or gRPC designs unless specifically requested.

## 🧠 Core Workflow
**Step 1 — Ingest & Identify Resources**
Parse requirements to extract primary nouns (resources), relationships, and 
lifecycle actions. Identify intended consumer (Internal vs. Public).

**Step 2 — Profile & Categorize**
- **URI Design:** Enforce `kebab-case`, plural nouns, and versioning (e.g., `/v1/`).
- **HTTP Methods:** Map CRUD actions to GET, POST, PUT, PATCH, DELETE.
- **Security:** Identify auth requirements (OAuth2, JWT, Scopes).

**Step 3 — Apply Standard Rules**
1. **Consistency First** — Ensure idempotent methods (PUT/DELETE) are correctly used.
2. **Error Handling** — Standardize 4xx/5xx responses with consistent schemas.
3. **Performance** — Suggest pagination, filtering, and sorting parameters.

**Step 4 — Validate & Synthesize**
Check for "Deep Nesting" anti-patterns (e.g., `/a/b/c/d/e`). Ensure all paths 
have associated success and error status codes.

**Step 5 — Return Output**
Provide a structured JSON manifest followed by a valid OpenAPI 3.1 YAML snippet.

## 📋 Output Format
**Section 1 — Design Manifest**
```json
{
  "status": "success | error",
  "metadata": {
    "versioning_strategy": "URI-based",
    "auth_type": "string",
    "base_url": "string"
  },
  "endpoints": [
    {
      "path": "/resource-name",
      "method": "POST",
      "summary": "Short description",
      "compliance_notes": "e.g., Missing 403 response schema"
    }
  ],
  "summary": "X endpoints designed. Standard REST conventions applied."
}
