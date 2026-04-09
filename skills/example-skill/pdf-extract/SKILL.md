---
name: pdf-extract
description: >
  Extract text, tables, form fields, and structural metadata from PDF documents.
  Use when the user uploads PDFs and requests text conversion, table parsing,
  form field mapping, or layout analysis. Supports both digital (text-based)
  and scanned (image-based) PDFs with OCR fallback. Do NOT use for PDF generation,
  editing, merging, or extracting from password-protected/encrypted documents
  without explicit user authorization.
version: "1.0"
tags: [pdf, extraction, ocr, parsing, document-intelligence]
context_priority: high
---
# PDF Extraction
This skill guides systematic extraction and structuring of content from PDF documents.
The user provides a PDF file (uploaded or URL) and optionally specifies extraction
targets (e.g., "tables only", "form fields", "full text"). Apply the workflow below,
then return structured output alongside an extraction audit log.

## 🎯 When to Use
- User uploads a PDF and requests text extraction, table conversion, or form field mapping
- User mentions scanned documents, OCR, layout parsing, or "convert PDF to JSON/CSV"
- Document contains mixed content: digital text + embedded images + form fields
- **Do NOT use** when the user wants to generate, edit, merge, or compress PDFs —
  refer them to appropriate document manipulation workflows
- **Do NOT use** for password-protected, encrypted, or digitally signed PDFs unless
  the user explicitly provides decryption credentials and authorizes processing
- **Do NOT use** for non-PDF inputs (Word docs, images, HTML) — this skill targets
  PDF format only; refer other formats to conversion workflows first

## 🧠 Core Workflow
**Step 1 — Ingest & Classify**
Parse the PDF metadata and detect document characteristics:
- Text layer presence: digital text vs. scanned/image-based pages
- Page count, dimensions, and orientation consistency
- Form field detection (AcroForm, XFA) and interactive element inventory
- Security flags: encryption, printing restrictions, copy protection
Report detected structure and note any processing constraints (e.g., "Pages 5-7 are scanned images requiring OCR").

**Step 2 — Profile Content Types**
For each page or region, categorize extractable elements:
- Text blocks: font metadata, reading order, column layout detection
- Tables: border detection, cell alignment, merged cell handling
- Form fields: field names, types (text, checkbox, dropdown), current values
- Images/figures: alt text presence, caption association, OCR eligibility
- Headers/footers: repeating patterns that may require deduplication

**Step 3 — Apply Extraction Rules**
Execute extraction in order of reliability. Log every operation and confidence level.
1. **Digital Text Priority** — For pages with selectable text, extract using
   `pdfplumber` (preferred) or `PyPDF2`. Preserve reading order and logical
   paragraph breaks. Never split words across lines unless original layout demands it.
2. **OCR Fallback** — For scanned/image-based pages, use `pytesseract` + `pdf2image`
   with language auto-detection. Apply deskewing and contrast enhancement if text
   confidence <90%. Flag low-confidence extractions with `⚠️ OCR-uncertain` marker.
3. **Table Structuring** — Detect table boundaries via border analysis or whitespace
   clustering. Output as nested JSON arrays with header row identification. For
   complex/multi-page tables, add `table_id` and `continues_on_page` metadata.
4. **Form Field Mapping** — Extract field names, types, and values. For unchecked
   checkboxes or empty fields, include `value: null` rather than omitting the field.
   Preserve field hierarchy (e.g., grouped radio buttons).
5. **Layout Cleanup** — Remove repeating headers/footers if detected across ≥3 pages.
   Fix hyphenated line breaks. Normalize whitespace without collapsing intentional
   indentation (e.g., code snippets, poetry).
6. **Encoding & Special Characters** — Detect and preserve Unicode characters.
   Flag any substitution artifacts (e.g., `` replacement characters) in warnings.

**Step 4 — Validate & Synthesize**
Cross-check extraction completeness:
- Text length sanity check vs. visual page content (flag unusually short extractions)
- Table row/column consistency across pages
- Form field count matches AcroForm dictionary
- OCR confidence averages reported per page
Group findings by page and extraction type. Verify all line references and coordinates
map to the original PDF coordinate system when applicable.

**Step 5 — Return Output**
Provide structured JSON output followed by optional human-readable formats.
Always include extraction metadata, confidence indicators, and warnings for
low-fidelity regions. Never silently drop content due to parsing complexity —
flag it explicitly for human review.

## 📋 Output Format
Return two sections:
**Section 1 — Extraction Report**
```json
{
  "status": "success | partial | error",
  "metadata": {
    "page_count": 0,
    "extraction_method": "pdfplumber | pytesseract | hybrid",
    "processing_time_seconds": 0.0,
    "ocr_languages_detected": ["eng"],
    "security_flags": ["encrypted", "copy_restricted"]
  },
  "text_blocks": [
    {
      "page": 1,
      "bbox": [x1, y1, x2, y2],
      "content": "Extracted text content",
      "confidence": 0.98,
      "font_info": {"name": "Arial", "size": 12}
    }
  ],
  "tables": [
    {
      "page": 2,
      "table_id": "tbl_001",
      "headers": ["Name", "Date", "Amount"],
      "rows": [["Alice", "2024-01-15", "100.00"]],
      "bbox": [x1, y1, x2, y2],
      "confidence": 0.95,
      "continues_on_page": 3
    }
  ],
  "form_fields": [
    {
      "name": "applicant_name",
      "type": "text",
      "value": "John Doe",
      "page": 1,
      "required": true
    }
  ],
  "summary": "Extracted 3 pages: 2 digital, 1 OCR. 2 tables, 5 form fields. OCR confidence avg: 92%.",
  "warnings": [
    {
      "page": 3,
      "element_type": "text_block | table | form_field",
      "issue": "Description of extraction limitation (e.g., 'Low OCR confidence due to image quality')",
      "bbox": [x1, y1, x2, y2],
      "suggestion": "Manual review recommended for this region"
    }
  ]
}
```

**Section 2 — Optional Human-Readable Output**
If requested, provide cleaned text in Markdown, CSV for tables, or key-value pairs
for form fields. Only include this section if explicitly requested by the user.
Add `<!-- EXTRACTION_NOTE: ... -->` comments highlighting low-confidence regions.

## ⚠️ Fallback Behavior
If the input cannot be parsed as a valid PDF, respond with:
```json
{
  "status": "error",
  "message": "Input does not appear to be a valid PDF document. File may be corrupted, password-protected, or non-PDF format.",
  "suggestion": "Please verify the file is a standard PDF and not encrypted. If scanned, ensure image quality is sufficient for OCR."
}
```
If the user's extraction goal is ambiguous (e.g., "get the data" without specifying
tables vs. text vs. forms), ask one targeted clarifying question before proceeding.
Never silently choose an interpretation that could omit critical content or misrepresent
document structure. For password-protected PDFs, request explicit authorization
before attempting any decryption or processing.
```