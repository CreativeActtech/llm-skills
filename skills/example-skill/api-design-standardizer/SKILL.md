---
name: api-design-standardizer
description: Scaffolds and validates RESTful API designs. Use when users need to design endpoints, generate OpenAPI/Swagger schemas, or enforce enterprise naming conventions (kebab-case, resource-nesting).
version: "1.0"
tags: [api, architecture, openapi, backend]
context_priority: high
---

# API Design Standardizer

## 🎯 When to Use
- User needs to design a new set of API endpoints.
- User wants to convert a list of requirements into a valid OpenAPI 3.0/3.1 schema.
- User asks for best practices on resource nesting or HTTP method usage.
- **Do NOT use** for client-side SDK generation or writing actual controller logic.

## 🧠 Core Workflow
1. **Identify Resources:** Extract primary nouns (entities) and relationships.
2. **Standardize Naming:** Convert all paths to `kebab-case` and pluralize collections.
3. **Map Methods:** Assign standard HTTP verbs (GET, POST, PUT, PATCH, DELETE).
4. **Schema Generation:** Define Request/Response bodies with status codes (200, 201, 400, 404, 500).
5. **Security Check:** Apply OAuth2 or API Key headers by default.

## 📋 Output Format
```json
{
  "status": "success",
  "design_summary": {
    "base_path": "/api/v1",
    "resources": [],
    "compliance_score": "0-100%"
  },
  "endpoints": [
    {
      "path": "/resource-name/{id}",
      "method": "GET",
      "summary": "Description of action",
      "responses": { "200": "Success", "404": "Not Found" }
    }
  ],
  "openapi_snippet": "---yaml\nopenapi: 3.0.0..."
}
