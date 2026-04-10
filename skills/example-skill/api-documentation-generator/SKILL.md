---
name: api-documentation-generator
description: >
  Generate comprehensive API documentation from code, OpenAPI/Swagger specs,
  or endpoint descriptions. Use when the user provides function signatures,
  route definitions, Postman collections, or raw API code and requests
  "document this API", "generate usage examples", or "create a reference guide".
  Do NOT use for writing API design proposals, generating mock servers,
  testing API endpoints, or documenting non-API code (libraries, CLIs, UI components).
version: "1.0"
tags: [api, documentation, openapi, rest, graphql, sdk]
context_priority: high
---

# API Documentation Generator

This skill guides creation of clear, comprehensive API documentation from
various input sources (code, specs, or descriptions). The user provides
endpoint definitions, function signatures, or existing API code and optionally
specifies output format (Markdown, OpenAPI, HTML, SDK docs). Apply the workflow
below, then return structured documentation with examples, error codes, and
usage guidelines.

## 🎯 When to Use

- User shares API route definitions, controller code, or function signatures
- User provides an OpenAPI/Swagger spec and requests improvements or format conversion
- User asks to "document this endpoint", "generate API reference", or "write usage examples"
- Input includes Postman collections, Insomnia exports, or curl command lists
- **Do NOT use** when the user wants to design a new API from scratch without
  existing code — refer them to API design workflows first
- **Do NOT use** for generating mock servers, test suites, or API gateway configs —
  these are separate tooling concerns
- **Do NOT use** for documenting non-API code (utility libraries, CLI tools,
  React components) unless they expose HTTP/GraphQL/gRPC endpoints

## 🧠 Core Workflow

**Step 1 — Ingest & Detect Format**
Parse the input to identify its type and extract relevant metadata:
- **Code-first**: Controller files (Express, Flask, FastAPI, Spring), route definitions
- **Spec-first**: OpenAPI YAML/JSON, Swagger 2.0, RAML, API Blueprint
- **Collection-based**: Postman JSON, Insomnia exports, curl/wget commands
- **Ad-hoc**: Informal descriptions, markdown tables, or verbal endpoint descriptions

Detect:
- API style: REST, GraphQL, gRPC, WebSocket, RPC
- Authentication method: API keys, OAuth2, JWT, Basic Auth, mTLS
- Data formats: JSON, XML, Protocol Buffers, form-data
- Framework conventions: Express middleware, Flask decorators, FastAPI annotations

If the format is ambiguous or incomplete, ask one targeted clarifying question
before proceeding (e.g., "Is this a REST API or GraphQL schema?").

**Step 2 — Extract Endpoint Metadata**
For each endpoint, catalog:

1. **Route Information**
   - HTTP method(s): GET, POST, PUT, PATCH, DELETE, OPTIONS
   - Path pattern with parameters: `/users/{id}/posts/{postId}`
   - Query parameters with types and defaults: `?limit=10&offset=0`
   - Path parameters with constraints: `{id}` must be integer > 0

2. **Request Schema**
   - Headers required/optional: `Authorization`, `Content-Type`, custom headers
   - Body schema (for POST/PUT/PATCH): JSON structure, validation rules, examples
   - Form data fields (for multipart/form-data): field names, file upload support

3. **Response Schema**
   - Success responses by status code: 200, 201, 204
   - Error responses: 400, 401, 403, 404, 409, 422, 500
   - Response body structure with types and nested objects
   - Pagination format if applicable: cursor-based, offset-based, page-based

4. **Side Effects & Behavior**
   - Idempotency: Is repeated execution safe?
   - Rate limiting: Requests per minute/hour, burst allowances
   - Caching behavior: Cache headers, ETag support, invalidation rules
   - Async operations: Does it return immediately or require polling/webhook?

**Step 3 — Enrich with Usage Context**
Add practical guidance that raw specs often omit:

1. **Authentication Examples**
   - Show exactly how to authenticate for each supported method
   - Include token acquisition flow if relevant (OAuth2 grant types)
   - Demonstrate header/certificate placement for each auth type

2. **Common Usage Patterns**
   - Typical request/response cycles for primary use cases
   - Chaining multiple endpoints for complex workflows
   - Handling pagination for list endpoints
   - Batch operations if supported

3. **Error Handling Guide**
   - Map error codes to human-readable explanations
   - Provide retry strategies (exponential backoff, circuit breaker)
   - Distinguish client errors (fix your request) from server errors (retry later)
   - Include troubleshooting tips for common failure modes

4. **Edge Cases & Gotchas**
   - Rate limit exhaustion behavior
   - Partial failure handling in batch operations
   - Timeouts and long-running operation patterns
   - Versioning strategy and deprecation timeline

**Step 4 — Generate Documentation Structure**
Organize content following industry-standard API doc conventions:

```
1. Overview
   - API purpose and scope
   - Base URL and environment variants (prod, staging, sandbox)
   - Authentication summary
   - Versioning scheme

2. Quick Start
   - First API call example (copy-paste ready)
   - Authentication setup walkthrough
   - Common integration patterns

3. Authentication
   - Supported methods with detailed setup
   - Token lifecycle and refresh flows
   - Security best practices

4. Endpoints (grouped by resource/domain)
   - Per-endpoint sections with full request/response details

5. Error Handling
   - Error code reference table
   - Retry guidelines
   - Debugging tips

6. Rate Limiting
   - Limits by endpoint or tier
   - Headers for monitoring quota
   - Upgrade paths for higher limits

7. Webhooks (if applicable)
   - Event types and payloads
   - Subscription management
   - Signature verification

8. SDKs & Code Examples
   - Official/community library links
   - Multi-language snippets (curl, Python, JS, Java, Go)

9. Changelog
   - Version history with breaking change highlights
```

**Step 5 — Validate & Return Output**
Cross-check generated docs against source material:
- Verify all endpoints from input are documented
- Confirm request/response schemas match exactly (no invented fields)
- Test code examples for syntax accuracy (language-specific validation)
- Ensure authentication flow is complete and actionable

Provide structured JSON index followed by full Markdown documentation.

## 📋 Output Format

Return two sections:

**Section 1 — Documentation Index (JSON)**

```json
{
  "status": "success | partial | error",
  "metadata": {
    "api_name": "Inferred or provided name",
    "api_version": "v1, 2.0, etc.",
    "base_url": "https://api.example.com",
    "api_style": "rest | graphql | grpc | websocket",
    "auth_methods": ["bearer_token", "api_key"],
    "endpoints_count": 12,
    "input_format": "openapi | code | postman | ad-hoc"
  },
  "endpoints": [
    {
      "id": "EP1",
      "method": "GET",
      "path": "/users/{id}",
      "summary": "Retrieve a user by ID",
      "operation_id": "getUserById",
      "tags": ["Users"],
      "authenticated": true,
      "rate_limited": true,
      "deprecated": false,
      "has_request_body": false,
      "response_codes": [200, 404, 401],
      "pagination": null
    }
  ],
  "authentication": {
    "methods": [
      {
        "type": "bearer_token",
        "header": "Authorization",
        "format": "Bearer <token>",
        "acquisition": "POST /oauth/token with client credentials"
      }
    ]
  },
  "errors_documented": [
    {"code": 400, "meaning": "Bad Request"},
    {"code": 401, "meaning": "Unauthorized"},
    {"code": 404, "meaning": "Not Found"},
    {"code": 429, "meaning": "Rate Limit Exceeded"}
  ],
  "warnings": [
    {
      "type": "missing_info | ambiguous_schema | incomplete_auth_flow",
      "detail": "Description of what was unclear or missing from input",
      "suggestion": "How to resolve (e.g., 'Provide response schema for 409 Conflict')"
    }
  ]
}
```

**Section 2 — Full Documentation (Markdown)**

Generate complete Markdown documentation with the following structure:

```markdown
# API Reference: [API Name]

**Version:** v1  
**Base URL:** `https://api.example.com/v1`  
**Auth:** Bearer Token, API Key

---

## Quick Start

Make your first API call:

```bash
curl -X GET "https://api.example.com/v1/users/me" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

Response:
```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "created_at": "2026-01-15T10:30:00Z"
}
```

---

## Authentication

### Bearer Token

Include the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Obtaining a Token

```bash
curl -X POST "https://api.example.com/oauth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET"
  }'
```

---

## Endpoints

### Users

#### GET `/users/{id}`

Retrieve a user by their unique identifier.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | string | Yes | User ID (prefix `usr_`) |

**Response:** `200 OK`

```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "Jane Doe",
  "created_at": "2026-01-15T10:30:00Z"
}
```

**Errors:**

| Code | Meaning | Description |
|------|---------|-------------|
| 404 | Not Found | User with given ID does not exist |
| 401 | Unauthorized | Missing or invalid authentication token |

**Example:**

```python
import requests

response = requests.get(
    "https://api.example.com/v1/users/usr_123",
    headers={"Authorization": "Bearer YOUR_TOKEN"}
)
print(response.json())
```

[Continue for all endpoints...]

---

## Error Handling

### Error Response Format

All errors follow this schema:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User usr_999 does not exist",
    "details": {...}
  }
}
```

### Common Errors

| HTTP Code | Error Code | Description | Resolution |
|-----------|------------|-------------|------------|
| 400 | INVALID_REQUEST | Request body fails validation | Check schema and retry |
| 401 | UNAUTHORIZED | Missing or expired token | Refresh token and retry |
| 429 | RATE_LIMITED | Too many requests | Wait and implement backoff |

### Retry Strategy

For 429 and 5xx errors, implement exponential backoff:

```python
import time

def retry_with_backoff(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except RateLimitError:
            wait_time = (2 ** i) + random.uniform(0, 1)
            time.sleep(wait_time)
    raise MaxRetriesExceeded()
```

---

## Rate Limiting

| Tier | Requests/min | Requests/day |
|------|--------------|--------------|
| Free | 60 | 1,000 |
| Pro | 600 | 50,000 |
| Enterprise | Custom | Custom |

Monitor your quota via response headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1647352800
```

---

## Changelog

### v1.2.0 (2026-03-01)
- Added: `PATCH /users/{id}` for partial updates
- Deprecated: `PUT /users/{id}` (remove by v2.0)

### v1.1.0 (2026-01-15)
- Added: Pagination for list endpoints
- Fixed: Date format inconsistency in responses
```

## ⚠️ Fallback Behavior

If the input cannot be parsed as API definitions (no routes, no endpoints,
no recognizable spec format), respond with:

```json
{
  "status": "error",
  "message": "Input does not appear to be API definitions. Expected OpenAPI spec, route handlers, Postman collection, or endpoint descriptions.",
  "suggestion": "Please provide your API code, spec file, or describe your endpoints with methods and paths."
}
```

If critical information is missing (e.g., response schemas, authentication method),
return partial documentation with explicit warnings:

```json
{
  "status": "partial",
  "message": "Documentation generated but some sections are incomplete due to missing input data.",
  "warnings": [
    {
      "type": "missing_response_schema",
      "detail": "No response schema provided for POST /users; inferred from request body",
      "suggestion": "Provide explicit response examples for accurate documentation"
    },
    {
      "type": "unknown_auth_method",
      "detail": "Authentication method not specified; documented common patterns generically",
      "suggestion": "Specify auth type (bearer, api_key, oauth2) for tailored guidance"
    }
  ],
  "documentation_generated": true
}
```

If the API appears incomplete or inconsistent (e.g., referenced resources without
corresponding endpoints, circular dependencies in schemas), flag these issues:

```json
{
  "status": "partial",
  "warnings": [
    {
      "type": "inconsistent_api_design",
      "detail": "Endpoint DELETE /users/{id}/posts references 'posts' resource with no dedicated endpoints",
      "suggestion": "Consider adding CRUD endpoints for posts or clarify relationship semantics"
    }
  ]
}
```

Never invent endpoints, fabricate response schemas, or assume authentication
flows without evidence. If uncertain, document what is known and explicitly
flag gaps for human review.
