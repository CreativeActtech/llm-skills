---
name: "user-story-generator"
description: "Transforms product requirements, feature requests, bug reports, or high-level ideas into well-structured user stories with acceptance criteria, prioritization, and implementation guidance following Agile/Scrum best practices."
version: "1.0.0"
tags: ["agile", "user-stories", "product-management", "requirements", "scrum", "backlog"]
context_priority: "medium"
---

# User Story Generator

## When to Use This Skill

**Use this skill when:**
- You need to convert product requirements into actionable user stories for development teams
- You want to break down epic features into smaller, estimable story units
- You need to write clear acceptance criteria for testing and validation
- You are building or refining a product backlog
- You want to ensure user stories follow INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- You need to generate story estimates or complexity scores

**Do NOT use this skill when:**
- You need detailed technical specifications or architecture diagrams
- You require actual effort estimation from the development team
- The requirements are too vague to form coherent stories
- You need stakeholder approval or business case justification

## Core Workflow

### Step 1: Requirement Analysis
Parse and understand the input:
- Product requirements documents (PRDs)
- Feature requests from stakeholders or users
- Bug reports or improvement suggestions
- High-level epics or themes
- Customer feedback or support tickets
- Competitive analysis or market research

Identify:
- Target users and personas
- Business value and objectives
- Functional and non-functional requirements
- Dependencies and constraints
- Success metrics and KPIs

### Step 2: Story Decomposition
Break down requirements into individual user stories:
- Apply the standard format: "As a [type of user], I want [goal/desire] so that [benefit/value]"
- Ensure each story is small enough to complete in a single sprint
- Identify independent story units that can be developed separately
- Group related stories into logical themes or epics
- Flag dependencies between stories

### Step 3: Acceptance Criteria Definition
For each user story, define clear acceptance criteria:
- Use Given/When/Then (Gherkin) format where applicable
- Cover happy path scenarios
- Include edge cases and error conditions
- Specify performance or quality requirements
- Define what "done" means for the story
- Ensure criteria are testable and unambiguous

### Step 4: Prioritization & Estimation Support
Provide guidance on:
- **Priority Level:** Must-have, Should-have, Could-have, Won't-have (MoSCoW)
- **Business Value Score:** 1-10 rating based on impact
- **Complexity Indicator:** T-shirt sizing (XS, S, M, L, XL) or story point range
- **Risk Factors:** Technical uncertainty, dependencies, external factors
- **Sequencing:** Recommended order of implementation

### Step 5: Story Enrichment
Add supporting details for development readiness:
- **Technical Notes:** Implementation hints, architectural considerations
- **UX/UI Requirements:** Wireframe references, design system components
- **Data Requirements:** Schema changes, migration needs, API contracts
- **Testing Strategy:** Unit tests, integration tests, E2E scenarios
- **Definition of Ready:** Prerequisites before development can start

## Output Format

```json
{
  "epic_summary": {
    "title": "string - epic or feature name",
    "description": "high-level overview of the feature",
    "business_objective": "what problem this solves",
    "target_users": ["list of user personas"],
    "success_metrics": ["KPIs or success criteria"]
  },
  "user_stories": [
    {
      "id": "US-001",
      "title": "short descriptive title",
      "story": "As a [user type], I want [goal] so that [benefit]",
      "priority": "must-have|should-have|could-have|wont-have",
      "business_value": "number (1-10)",
      "complexity": "XS|S|M|L|XL",
      "estimated_points": "number or range (e.g., '3-5')",
      "acceptance_criteria": [
        {
          "scenario": "description of the scenario",
          "given": "preconditions",
          "when": "action taken",
          "then": "expected outcome"
        }
      ],
      "dependencies": ["IDs of dependent stories or external systems"],
      "technical_notes": ["implementation hints or considerations"],
      "ux_requirements": ["design or UX specifications"],
      "data_requirements": ["database or data model changes"],
      "testing_strategy": {
        "unit_tests": ["key functions to test"],
        "integration_tests": ["interfaces to validate"],
        "e2e_scenarios": ["end-to-end flows to verify"]
      },
      "definition_of_ready": [
        "prerequisites that must be met before development"
      ],
      "risks": ["potential blockers or uncertainties"]
    }
  ],
  "implementation_roadmap": {
    "recommended_sequence": ["ordered list of story IDs"],
    "sprint_grouping": [
      {
        "sprint": "Sprint 1",
        "stories": ["US-001", "US-002"],
        "theme": "foundation/setup",
        "capacity_used": "estimated points"
      }
    ],
    "critical_path": ["stories that block others"],
    "quick_wins": ["low-effort, high-value stories"]
  },
  "open_questions": [
    {
      "question": "clarification needed",
      "impact": "which stories are affected",
      "recommended_action": "how to resolve"
    }
  ]
}
```

## Fallback Behavior

**If requirements are vague or incomplete:**
- List specific information needed to write effective stories
- Propose assumptions and ask for validation
- Create placeholder stories marked as "needs refinement"
- Suggest stakeholder interviews or discovery sessions

**If the scope is too large:**
- Recommend breaking the epic into multiple phases
- Identify MVP (Minimum Viable Product) stories
- Propose a phased rollout strategy
- Highlight which stories deliver core value vs. nice-to-haves

**If user personas are unclear:**
- Suggest common personas for the domain
- Recommend user research or persona definition workshops
- Write stories with generic "user" and flag for refinement

**If technical feasibility is uncertain:**
- Mark stories with "spike needed" flag
- Suggest time-boxed research stories
- Provide alternative implementation approaches to investigate

## Examples

### Example Input:
"We need a password reset feature for our web app. Users should be able to request a reset link via email, click the link, and set a new password. We also want to enforce password strength rules."

### Example Output Stories:

**US-001: Request Password Reset**
- *Story:* As a registered user who forgot their password, I want to request a password reset link via email so that I can regain access to my account.
- *Acceptance Criteria:*
  - Given I am on the login page, when I click "Forgot Password", then I see an email input field
  - Given I entered a valid email, when I submit the form, then I receive a confirmation message
  - Given I entered an invalid email, when I submit the form, then I see a generic success message (security best practice)

**US-002: Reset Password via Link**
- *Story:* As a user with a valid reset link, I want to set a new password so that I can access my account with updated credentials.
- *Acceptance Criteria:*
  - Given I clicked a valid reset link, when I land on the reset page, then I see two password fields (new password + confirm)
  - Given the reset link is expired (>24 hours), when I try to use it, then I see an error and option to request a new link
  - Given I entered mismatched passwords, when I submit, then I see a validation error

**US-003: Password Strength Validation**
- *Story:* As a security-conscious user, I want the system to enforce strong password rules so that my account is protected from brute-force attacks.
- *Acceptance Criteria:*
  - Given I enter a weak password, when I submit, then I see specific feedback on what's missing
  - Given my password meets all criteria (8+ chars, uppercase, lowercase, number, special char), when I submit, then the password is accepted
  - Given I'm setting a new password, when it matches any of my last 5 passwords, then I'm required to choose a different one
