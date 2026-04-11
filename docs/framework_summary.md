
# llm-skills: Single-File Browser Framework

**@ CreativeAct Technologies, 2026**

---

*   **Purpose:** A **model-agnostic** framework using a `SKILL.md` file to extend the capabilities of **browser-based LLMs** (like ChatGPT, Claude, or Gemini) 

*   **Why Single-File?** Browser interfaces lack file system access, so all logic, output schemas, and workflows must be self-contained in one file for easy copy-pasting.
*   **Best Practices:** 
    *   **Efficiency:** Keep skills under **4,000 tokens**.
    *   **Structure:** Use "LEGO-like" building blocks to define structured workflows and fallback logic.
    
    *   **Activation:** Simply paste the file into a chat to instantly activate the specialized tool.