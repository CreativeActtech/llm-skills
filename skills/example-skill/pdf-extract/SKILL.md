
---

### 📄 `skills/pdf-extract/SKILL.md`
```markdown
---
name: pdf-extract
description: Extract text, tables, and form fields from PDFs. Use when users need to parse PDF documents, convert to text/JSON, or analyze scanned pages.
version: "1.0"
tags: [pdf, extraction, ocr, parsing]
context_priority: high
---

# PDF Extraction Skill

## 🎯 When to Use
- User uploads a PDF and asks for text extraction, table conversion, or form field mapping.
- User mentions scanned documents, OCR, or layout parsing.
- **Do NOT use** for PDF generation, editing, or merging.

## 🧠 Core Workflow
1. Determine PDF type: digital text vs scanned image.
2. For digital: extract using `pdfplumber` or `PyPDF2`.
3. For scanned: fallback to `pytesseract` + `pdf2image`.
4. Clean extracted text (remove headers/footers, fix line breaks).
5. Structure output as requested (JSON, Markdown, CSV).

## 📋 Output Format
```json
{
  "page_count": 3,
  "extraction_method": "pdfplumber",
  "text_blocks": [{"page": 1, "content": "..."}],
  "tables": [{"page": 2, "rows": 12, "preview": "..."}],
  "warnings": ["Page 3 contained scanned images, OCR quality may vary"]
}