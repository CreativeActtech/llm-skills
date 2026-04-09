#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) { console.error('Usage: node validate-skill.js <SKILL.md>'); process.exit(1); }

const content = fs.readFileSync(file, 'utf8');
const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
if (!frontmatterMatch) { console.error('❌ Missing YAML frontmatter'); process.exit(1); }

const yaml = frontmatterMatch[1];
const nameMatch = yaml.match(/name:\s*(.+)/);
const descMatch = yaml.match(/description:\s*([\s\S]+?)(?:\n[a-zA-Z]+:|$)/);

if (!nameMatch || !descMatch) { console.error('❌ Missing name or description'); process.exit(1); }

const name = nameMatch[1].trim().replace(/^["']|["']$/g, '');
const desc = descMatch[1].trim().replace(/^["']|["']$/g, '');

const errors = [];
if (!/^[a-z0-9-]+$/.test(name)) errors.push('Name must be lowercase alphanumeric + hyphens only');
if (name.length < 1 || name.length > 64) errors.push('Name must be 1-64 chars');
if (/^-/.test(name) || /-$/.test(name) || /--/.test(name)) errors.push('No leading/trailing/consecutive hyphens');
if (desc.length < 1 || desc.length > 1024) errors.push('Description must be 1-1024 chars');

if (errors.length) {
  console.error('❌ Validation failed:\n' + errors.map(e => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✅ ${file} is valid. Name: "${name}", Description: ${desc.length} chars`);