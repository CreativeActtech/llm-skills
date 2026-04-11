---  
name: kaggle-notebook-generator  
description: >  
  Generates a complete Kaggle Notebook (`*.ipynb`) from a natural‑language user query.  
  Use when the user asks for a Kaggle notebook, a Kaggle “kernel”, or a reproducible notebook for a competition/ dataset.  
  Do **NOT** use for generic scripts that are not intended to run on Kaggle, for HTML‑only notebooks, or when the user explicitly wants only a code snippet without notebook metadata.  
version: "1.0.0"  
tags: [kaggle, notebook, ipynb, data‑science, automation]  
context_priority: high  
metadata:  
  author: "J.A.G. CreativeAct Technologies"  
  last_updated: "2026-04-11"  
---  

# Kaggle Notebook Generator  

Create ready‑to‑run Kaggle notebooks (Kernels) that include the necessary metadata, markdown explanations, and code cells based on the user’s request.

## 🎯 When to Use  

- **Positive triggers**  
  - User says “create a Kaggle notebook that …”, “I need a kernel for …”, or “Generate an IPython notebook for this task”.  
  - The request includes a dataset name, competition, or a clear analysis goal (e.g., “visualize Titanic data”).  

- **Negative triggers**  
  - The user only wants a plain Python script or a Jupyter notebook that will **not** run on Kaggle (e.g., requires local file‑system access).  
  - The user asks for a notebook in another platform’s format (Google Colab `.ipynb` with specific magic commands).  
  - The query is ambiguous to the point where the intended notebook purpose cannot be inferred (e.g., “make something cool”).  

## 🧠 Core Workflow  

1. **Parse User Intent**  
   - Detect keywords: `kaggle`, `kernel`, `notebook`, `competition`, `dataset`.  
   - IF a Kaggle competition or dataset is mentioned → store `kaggle_ref`.  
   - ELSE IF only a generic analysis request → proceed with a generic notebook template.  

2. **Construct Notebook Skeleton** (uses the standard Jupyter JSON schema).  

   - **Metadata block** (required by Kaggle):  
     ```json
     {
       "kernelspec": {
         "name": "python3",
         "display_name": "Python 3"
       },
       "language_info": {
         "name": "python",
         "version": "3.9"
       },
       "title": "<Generated Title>",
       "id": "<UUID>",
       "slug": "<kaggle‑slug-if‑available>"
     }
     ```  

   - **Cell Generation**  
     - **IF** the user provides a high‑level outline → create ordered markdown cells matching that outline.  
     - **ELSE** generate a default structure:  
       1. Title & description (markdown).  
       2. Imports (code).  
       3. Data loading (code).  
       4. Exploratory analysis (code + markdown).  
       5. Modeling / evaluation (code).  
       6. Conclusions (markdown).  

3. **Populate Code Cells**  
   - Use heuristic inference to add typical snippets:  
     - `import pandas as pd` when a dataset is mentioned.  
     - `import matplotlib.pyplot as plt` for visualization requests.  
     - `from sklearn.model_selection import train_test_split` for modeling tasks.  
   - **IF** the user supplies a specific algorithm (e.g., “random forest”) → inject the corresponding scikit‑learn import and model boiler‑plate.  

4. **Insert Kaggle‑Specific Helpers** (optional).  
   - `!pip install -q kaggle` (only if the user asks for additional packages).  
   - `from kaggle.api.kaggle_api_extended import KaggleApi` block for dataset download when `kaggle_ref` is present.  

5. **Validate Notebook JSON**  
   - Run a lightweight JSON schema check.  
   - **IF** validation fails → add a `# TODO: Fix notebook JSON` comment in the output report.  

6. **Provide Diff / Summary**  
   - Summarize generated sections, list added imports, and note any assumptions made.

## 📋 Output Format  

### 1️⃣ Notebook Generation Report  

```json
{
  "status": "success",
  "notebook_name": "my_kaggle_notebook.ipynb",
  "title": "Exploratory Analysis of Titanic Dataset",
  "cells_created": 8,
  "imports_added": ["pandas", "matplotlib.pyplot", "sklearn.model_selection"],
  "kaggle_metadata": {
    "competition": "titanic",
    "dataset": "alexanderlindberg/titanic"
  },
  "confidence_issues": []
}
```

### 2️⃣ Notebook JSON (truncated for readability)  

```json
{
  "metadata": {
    "kernelspec": { "name": "python3", "display_name": "Python 3" },
    "language_info": { "name": "python", "version": "3.9" },
    "title": "Exploratory Analysis of Titanic Dataset",
    "id": "d3f1c9e2-8b4a-4f6e-9a2b-7c1e5f4a6b8c",
    "slug": "titanic-exploratory-analysis"
  },
  "nbformat": 4,
  "nbformat_minor": 5,
  "cells": [
    { "cell_type": "markdown", "source": ["# Exploratory Analysis of Titanic Dataset\\n", "Using the Kaggle Titanic competition data."] },
    { "cell_type": "code", "source": ["import pandas as pd\\n", "import matplotlib.pyplot as plt\\n", "from sklearn.model_selection import train_test_split"] },
    { "cell_type": "code", "source": ["df = pd.read_csv('/kaggle/input/titanic/train.csv')\\n", "df.head()"] },
    { "cell_type": "markdown", "source": ["## Data Overview"] },
    { "cell_type": "code", "source": ["df.describe()"] },
    { "cell_type": "markdown", "source": ["## Modeling"] },
    { "cell_type": "code", "source": ["X = df.drop('Survived', axis=1)\\n", "y = df['Survived']\\n", "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)"] },
    { "cell_type": "code", "source": ["# TODO: Insert model training code"] }
  ]
}
```

### 3️⃣ Next‑Step Recommendation  

```bash
# Save the JSON above to a file
echo '<PASTE_JSON>' > my_kaggle_notebook.ipynb

# Verify on Kaggle
kaggle kernels push -p .
```

## ⚠️ Fallback Behavior  

- **All required components already exist** (e.g., the user provides a complete notebook):  

```json
{
  "status": "partial",
  "message": "Provided input already contains a valid Kaggle notebook. No changes made.",
  "suggestion": "You may still add Kaggle metadata using the `metadata` field in the notebook JSON."
}
```

- **Unclear intent or missing essential details** (e.g., no dataset/competition is referenced and no analysis goal is stated):  

```json
{
  "status": "error",
  "message": "Unable to determine notebook purpose. Please specify the dataset, competition, or analysis objective."
}
```
