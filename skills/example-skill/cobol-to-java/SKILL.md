---  
name: cobol-to-java-refactor  
description: >  
  Transforms legacy COBOL source code into an equivalent Java implementation.  
  Use when the user supplies COBOL modules and asks for Java refactoring, migration, or “convert this COBOL to Java”.  
  Do **NOT** use for simple syntax highlighting, for generating only pseudocode, or when the user explicitly wants to keep the code in COBOL.  
version: "1.0.0"  
tags: [cobol, java, migration, legacy‑code, refactor]  
context_priority: high  
metadata:  
  author: "AI Engineer <ai@example.com>"  
  last_updated: "2026-04-11"  
---  

# COBOL → Java Refactor Skill  

Creates a clean, compilable Java class (or set of classes) that mirrors the logic of the supplied COBOL program while preserving business rules and data structures.

## 🎯 When to Use  

- **Positive triggers**  
  - User says “convert this COBOL program to Java”, “refactor COBOL code into a Java class”, or “migrate legacy COBOL to modern Java”.  
  - The request includes raw COBOL source (e.g., `IDENTIFICATION DIVISION.` block) and an expectation of a Java output.  

- **Negative triggers**  
  - The user only wants a line‑by‑line comment translation or a high‑level description without actual code generation.  
  - The user asks for a COBOL‑only solution (e.g., “debug this COBOL program”).  
  - The request is for a language other than Java (e.g., “convert to C#”).  

## 🧠 Core Workflow  

1. **Detect Input Intent**  
   - IF the text contains `IDENTIFICATION DIVISION` *or* typical COBOL hierarchy (`DATA DIVISION`, `PROCEDURE DIVISION`) → proceed.  
   - ELSE → return an error JSON (see fallback).  

2. **Parse COBOL Source**  
   - Use a lightweight COBOL AST parser (or regex‑based stage‑wise extraction) to obtain:  
     - Program name (`IDENTIFICATION DIVISION` → `PROGRAM-ID`).  
     - Data structures (`WORKING-STORAGE SECTION`, `01` level items).  
     - Procedure paragraphs and `PERFORM` calls.  
   - Record any `COPY` statements for external includes (note them in the report).  

3. **Map COBOL Constructs to Java Equivalents**  

   | COBOL Element | Java Mapping | Remarks |
   |---------------|--------------|---------|
   | `01` level data items (numeric, alphanumeric) | `int`, `long`, `double`, `String` (use `java.math.BigDecimal` for packed decimals) | Preserve picture clause semantics. |
   | `TABLE`s (`OCCURS`) | `List<T>` or `T[]` | Size‑constant tables become arrays; variable‑size become `ArrayList`. |
   | `PERFORM …` (inline) | Direct method call | Inline code is in‑lined; separate paragraphs become private methods. |
   | `PERFORM … THRU …` | Call chain of generated private methods. |
   | `IF … ELSE …` | `if (…) { … } else { … }` | Preserve condition evaluation order. |
   | `EVALUATE` | `switch` (or nested `if`) | Map literal/value comparisons. |
   | `STOP RUN` | `return;` or end of `main` method. |
   | `DISPLAY` | `System.out.println` | Handles string conversion. |
   | `ACCEPT` | `Scanner` or method parameter (depends on context). |
   | `READ/WRITE` on file | `java.io` streams or `java.nio` (file‑specific handling noted). |
   | `CALL` (subprogram) | Separate Java class or static method call. |

4. **Generate Java Boilerplate**  

   - **Package & Imports** (added as needed):  
     ```java
     import java.util.*;
     import java.math.BigDecimal;
     // Additional imports for file I/O, date handling, etc.
     ```  
   - **Class Declaration** – name derived from `PROGRAM-ID` (PascalCase).  
   - **Fields** – one for each COBOL data item, respecting visibility (`private`).  
   - **Constructor** – initializes fields with default values (derived from `VALUE` clause).  
   - **Method(s)** – one for each COBOL paragraph; the main paragraph becomes `public static void main(String[] args)`.  

5. **Insert TODO / Warning Annotations**  

   - IF a COBOL construct has no direct Java equivalent (e.g., `EXEC CICS`, `CALL` to external C programs) → add a comment `// TODO: Manual migration required for <construct>`.  

6. **Validate Java Syntax (lightweight)**  

   - Run `javac -Xlint` on the generated string (optional, not executed here).  
   - **IF** syntax errors are detected → list them in `confidence_issues`.  

7. **Produce Diff‑Ready Report**  

   - Summarize: number of COBOL paragraphs → Java methods, data items → fields, imports added, and any unmapped constructs.  

## 📋 Output Format  

### 1️⃣ Refactor Report (JSON)  

```json
{
  "status": "success",
  "cobol_program_id": "PAYROLLPROC",
  "java_class_name": "PayrollProc",
  "fields_generated": 14,
  "methods_generated": 7,
  "imports_added": ["java.util.*", "java.math.BigDecimal"],
  "unmapped_constructs": ["EXEC CICS SEND MAP"],
  "confidence_issues": [
    "Packed‑decimal (PIC S9(7)V99) mapped to BigDecimal – verify scale handling",
    "File I/O using COBOL SELECT statements requires manual review"
  ]
}
```

### 2️⃣ Generated Java Source (truncated for brevity)  

```java
package com.example.migration;

import java.util.*;
import java.math.BigDecimal;

public class PayrollProc {

    // === Fields (from COBOL WORKING‑STORAGE) ===
    private String employeeId;
    private BigDecimal grossPay;
    private BigDecimal taxWithheld;
    private int hoursWorked;
    // ... other fields ...

    public PayrollProc() {
        // Default initialization (if VALUE clauses exist)
        this.employeeId = "";
        this.grossPay = BigDecimal.ZERO;
        this.taxWithheld = BigDecimal.ZERO;
        this.hoursWorked = 0;
    }

    public static void main(String[] args) {
        PayrollProc proc = new PayrollProc();
        proc.initialize();
        proc.calculatePay();
        proc.printReport();
    }

    private void initialize() {
        // Equivalent of COBOL INITIALIZE paragraph
        // TODO: Populate fields from input source (e.g., file, DB)
    }

    private void calculatePay() {
        // Translated from COBOL CALC‑PAY paragraph
        this.grossPay = BigDecimal.valueOf(this.hoursWorked)
                         .multiply(BigDecimal.valueOf(20.0));
        // ... other calculations ...
    }

    private void printReport() {
        System.out.println("Employee: " + employeeId);
        System.out.println("Gross Pay: " + grossPay);
        System.out.println("Tax Withheld: " + taxWithheld);
    }

    // === Additional methods generated from other COBOL paragraphs ===
    // TODO: Manual migration required for EXEC CICS SEND MAP
}
```

### 3️⃣ Suggested Post‑Processing Commands  

```bash
# Save the generated source
cat > PayrollProc.java <<'EOF'
<PASTE_JAVA_CODE_ABOVE>
EOF

# Compile to verify syntax
javac PayrollProc.java

# Run (if a main method is present)
java com.example.migration.PayrollProc
```

## ⚠️ Fallback Behavior  

- **Already Java‑Ready** (user mistakenly provides Java code):  

```json
{
  "status": "partial",
  "message": "Input appears to be Java code, not COBOL. No transformation performed.",
  "suggestion": "If you need a Java‑to‑Java refactor, use a dedicated Java‑formatter skill."
}
```

- **Unrecognizable Input** (no COBOL structure detected):  

```json
{
  "status": "error",
  "message": "Unable to locate COBOL program structure (IDENTIFICATION DIVISION missing). Please provide valid COBOL source."
}
```

- **Critical Mapping Gaps** (e.g., proprietary CICS commands):  

```json
{
  "status": "warning",
  "message": "Several COBOL constructs could not be automatically mapped.",
  "unmapped_constructs": ["EXEC CICS SEND MAP", "CALL 'EXTERNAL.CBL'"],
  "next_steps": "Review the generated TODO comments and implement platform‑specific logic manually."
}
```

---  
