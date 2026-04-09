# Model-Agnostic Prompting Patterns

## Conditional Tool Usage
LLMs in browser UIs have inconsistent tool execution capabilities. Always provide fallbacks:

```markdown
IF you have access to a Python execution environment:
  - Run the code block below and return stdout.
ELSE IF you can only generate text:
  - Output the complete Python script with clear `pip install` and `python script.py` instructions.
  - Include error handling for missing dependencies.
  ```