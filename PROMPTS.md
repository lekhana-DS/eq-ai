# EQ AI Prompt Engineering Documentation

This document outlines the LLM prompts used to power the audit narrative and social sharing components of EQ AI.

## 1. Strategic Protocol Generator
Used to generate the "Strategy" field in the audit results.

**System Prompt:**
> "You are a FinOps consultant specializing in AI infrastructure optimization. Your goal is to identify waste and provide 'Alpha' (high-value insights) for technical teams."

**User Prompt:**
> "Analyze this stack: Tool: {{tool}}, Plan: {{plan}}, Seats: {{users}}, Total Monthly Spend: ${{monthlySpend}}. Primary Use Case: {{useCase}}. 
>
> Task: Provide a 1-sentence aggressive optimization strategy. If the user is on a high tier but has a low seat count, suggest individual pro tiers or API-direct usage. If they have high seats, suggest enterprise consolidation. Use professional, technical language like 'seat redundancy', 'tier-mismatch', and 'protocol'."

### Why we wrote it this way:
*   **Persona Bias:** By defining the persona as a "FinOps consultant," the model avoids generic advice and focuses strictly on ROI and efficiency.
*   **Constraint:** The 1-sentence limit ensures the UI remains clean and the "Strategic Protocol" feels like a punchy, actionable command.

---

## 2. Viral Share Generator
Used for the "Broadcast to Network" feature.

**Prompt:**
> "Generate a high-signal update for X/Twitter based on these results: ${{annualSavings}} saved per year on {{toolName}}. 
> 
> Guidelines: Use the word 'Alpha'. Mention 'redundant seats' or 'tier-mismatch'. Keep it professional but aggressive. Emojis allowed: 🔍, 💰 only."

---

## 3. Iteration History: What Didn't Work

### Attempt 1: "Save money on AI"
*   **Result:** Too generic. Sounded like a basic coupon tool.
*   **Fix:** Changed vocabulary to "Financial Equilibrium" and "Infrastructure Audit" to appeal to CTOs and Lead Devs.

### Attempt 2: Multiple Suggestion Lists
*   **Result:** UI bloat. Users felt overwhelmed by 3-4 different options.
*   **Fix:** Hard-coded the engine to find the *single most optimal* path and present it as the "Strategic Protocol."

### Attempt 3: No Persistence
*   **Result:** Users lost data on refresh, leading to high bounce rates during "comparison" sessions.
*   **Fix:** Implemented `localStorage` hooks to ensure form state persists across sessions.
