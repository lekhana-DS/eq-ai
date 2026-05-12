# LLM Prompt Engineering & Optimization Blueprint

This document specifies the exact large language model integration strategy, persona definitions, and iteration history implemented inside the `app/api/summary/route.ts` pipeline.

---

## 1. Production Prompt Specification

The production application routes masked engineering configurations to the `claude-3-5-sonnet-20241022` engine utilizing this dynamically compiled prompt:

```text
Write an executive infrastructure audit summary paragraph for a startup founder:
- Profile: Team size ${teamSize}, Use Case: ${useCase}
- Metrics: Spending $${currentSpend}/mo, savings potential: $${monthlySavings}/mo.
- Primary Component Stack: ${topOverspendTool}

Constraints: Maximum 100 words. Maintain a professional, data-driven financial tone. Highlight the structural overspend leak.
```

---

## 2. Design Rationale: Why It Was Written This Way

The template was engineered with four strict constraints to guarantee immediate conversion value for the Credex B2B funnel:

*   **Role-Targeted Persona Anchor:** Explicitly directing the model to write *"for a startup founder"* forces it to drop dense technical jargon and use high-impact financial messaging. This positions the audit as an urgent runway optimization tool.
*   **Isolated Parametric Variable Matrix:** Injecting structured data parameters (`${teamSize}`, `${currentSpend}`, etc.) ensures the model works only with verified, pre-calculated integers from our mathematical engine, preventing mathematical errors.
*   **Enforced Word Count Boundary:** Capping the length at a *"Maximum 100 words"* prevents long-winded paragraphs. This fits cleanly inside mobile views without breaking user interface layouts.
*   **Strategic Overspend Highlighting:** Forcing the AI to *"Highlight the structural overspend leak"* acts as a psychological hook. It drives founders to share their email addresses to unlock the detailed breakdown.

---

## 3. Engineering Iteration History: What Didn't Work

Before landing on the current production layout, two previous prompt iterations were tested and rejected:

### The Naive First Prompt (Failed)
```text
Review these audit details: ${JSON.stringify(body)} and give me an audit summary.
```
*   **Why it failed:** Passing raw JSON objects directly caused the model to hallucinate billing intervals, frequently confusing monthly and annualized savings. The output exceeded 250 words and sounded like standard boilerplate text instead of an executive summary.

### The Over-Constrained Second Prompt (Failed)
```text
Act as a B2B SaaS accountant. Write a 3-sentence summary with exactly 1 bullet point explaining why this team is losing money. Use words like runway.
```
*   **Why it failed:** Adding contradictory structural rules (e.g., matching sentence counts against bullet point mandates) caused the model to truncate important numbers. It often forgot to print the actual dollar amounts when trying to maintain strict line boundaries.

---

## 4. Operational Resilience & Fallback Coverage

To insulate the platform against API downtime, token limit blocks, or networking delays, the handler is wrapped inside a safe try/catch architecture:

1. **Local Parameter Tracking:** If the third-party network drops the connection or flags a timeout error, the runtime logic catches the exception immediately.
2. **Deterministic String Injections:** The system bypasses generative text pathways and instantly serves a pre-formatted fallback template:
   `"Based on your audited profile with ${teamSize} active seats... your organization can recapture approximately $${monthlySavings}/mo..."`
3. **Seamless UX Continuity:** The user receives a clean, data-driven report without realizing an upstream API error occurred, protecting conversion rates under heavy traffic.
