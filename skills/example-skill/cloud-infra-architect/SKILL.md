---
name: cloud-infrastructure-architect
description: >
  Design cloud architectures and generate Terraform/HCL blueprints. Use when 
  users need to scaffold AWS/Azure/GCP environments, VPCs, or Kubernetes 
  clusters with security best practices.
version: "1.1"
tags: [devops, terraform, cloud, aws, iac]
context_priority: high
---
# Cloud Infrastructure Architect
Translates high-level system requirements into secure, scalable Cloud 
Infrastructure-as-Code (IaC) blueprints using Terraform/HCL.

## 🎯 When to Use
- User requests a multi-tier architecture (e.g., "Web + App + DB").
- User needs to scaffold a landing zone or VPC with specific subnets.
- User asks for "Security Group" rules for a specific service.
- **Do NOT use** for executing Terraform commands or managing live secrets.
- **Do NOT use** for application-level code (e.g., Python/Java logic).

## 🧠 Core Workflow
**Step 1 — Contextualize Environment**
Identify Cloud Provider (AWS/Azure/GCP), Region, and Scalability requirements.

**Step 2 — Profile Architecture**
- **Networking:** Define VPC CIDRs, Public vs. Private subnets.
- **Compute/Storage:** Select appropriate instance types or serverless options.
- **Security:** Map IAM roles and least-privilege SG rules.

**Step 3 — Apply IaC Rules**
1. **Security First** — Default to "Private" subnets; flag any 0.0.0.0/0 ingress.
2. **State Management** — Include placeholders for S3/DynamoDB backends.
3. **Tagging** — Enforce enterprise tagging (Environment, Owner, Project).

**Step 4 — Validate**
Ensure no "Circular Dependencies" exist in the proposed HCL. Check for 
high-cost services (e.g., NAT Gateways) and suggest alternatives.

**Step 5 — Return Output**
Provide an Architecture Manifest (JSON) and a Terraform code block.

## 📋 Output Format
**Section 1 — Architecture Manifest**
```json
{
  "provider": "aws",
  "topology": "Multi-AZ",
  "resources": ["aws_vpc", "aws_subnet", "aws_eks_cluster"],
  "security_posture": "Strict - No public DB access",
  "estimated_complexity": "Medium"
}
```

## Section 2 — HCL Blueprint
Provide the Terraform/HCL code with inline comments.

## ⚠️ Fallback Behavior
IF provider is not specified:
- DEFAULT to AWS.
  
IF architecture is ambiguous:
- ASK: "Is this for a production or development environment?"
