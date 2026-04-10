---
name: github-repo-structure-builder
description: >
  Scaffold, design, and output standardized GitHub repository directory structures
  based on project type, language, or framework. Use when the user requests a new
  repo layout, asks for best-practice folder organization, or needs essential
  configuration files (.gitignore, CI/CD, docs, src, tests) generated.
  Do NOT use for executing git commands, writing full application code, managing
  remote repositories, or generating non-code documentation structures.
version: "1.0"
tags:
  - github
  - repository
  - scaffolding
  - structure
  - devops
  - template
context_priority: high
---

# GitHub Repository Structure Builder

This skill guides the systematic generation of GitHub-ready directory trees
and foundational configuration files. The user provides project context
(language, framework, scope) and optionally requests specific tooling or
conventions.

---

## 🎯 When to Use

- User asks to create a repo structure, scaffold a project, or organize folders
- User specifies a tech stack (Python/FastAPI, Node/Express, React/Next.js, Rust)
- User requests standard files such as `.gitignore`, `LICENSE`, `README.md`, CI/CD workflows, or `docs/`
- User wants best-practice conventions for monorepos, packages, or libraries

### Do NOT Use

- IF user intent includes running git commands (`git init`, push, clone)
- IF user requests full implementation code instead of structure
- IF user asks to manage remote repositories
- IF request is unrelated to software project structure

---

## 🧠 Core Workflow

### Step 1 — Ingest & Identify Context


IF project context is provided:  
Extract language, framework, project type, CI needs, constraints  
ELSE:  
Assume standard single-language application layout



### Step 2 — Blueprint & Structure Design

Map context → standard structure

INCLUDE:

-   src/ | lib/ | app/
    
-   tests/ | **tests**/
    
-   config files (.env.example, package.json, pyproject.toml, Cargo.toml)
    
-   .github/workflows/
    
-   docs/, README.md, CHANGELOG.md
    

APPLY naming conventions based on ecosystem


### Step 3 — Generate & Annotate




OUTPUT:

-   ASCII directory tree
    
-   File annotations (purpose / template hints)
    
-   ⚠️ requires-configuration flags for sensitive fields
    

### Step 4 — Validate

CHECK:

-   No redundant paths
    
-   CI/CD matches stack
    
-   Required files present
    
-   No secrets or unsafe placeholders
    



### Step 5 — Return Output




RETURN:

-   Directory tree (markdown code block)
    
-   Structure manifest (JSON)
    
-   Change log
    


---

## 📋 Output Format

### Section 1 — Directory Structure

Return a Markdown fenced code block containing the generated tree.

### Section 2 — Structure Manifest

```json
{
  "status": "success | partial | error",
  "summary": {
    "project_type": "",
    "language_stack": "",
    "files_generated": 0,
    "directories_created": 0,
    "config_files_included": []
  },
  "structure": [
    {
      "path": "src/",
      "type": "directory | file",
      "detail": "Purpose and recommended content or template reference"
    }
  ],
  "warnings": [
    {
      "path": ".github/workflows/ci.yml",
      "issue": "Requires repository secrets or environment variables to function",
      "rows_affected": ["CI_TOKEN", "DATABASE_URL"]
    }
  ]
}

```

----------

## ⚠️ Fallback Behavior

```
IF missing project context:
  RETURN:
  {
    "status": "error",
    "message": "Input does not specify a project type or technology stack.",
    "suggestion": "Please specify the primary language, framework, or project goal (e.g., 'Python FastAPI web app', 'React frontend library')."
  }

```

```
IF request is ambiguous:
  ASK one targeted clarifying question
  DO NOT assume architecture
  DO NOT generate unsafe configs

```

----------

## 🔁 Change Log

-   v1.0 — Initial structured skill aligned to SKILL.md specification
