# Landing Page Interface Structure & Typography

This document maps out the specific interface headings, labels, selection values, and data parameters currently active on the primary entry view.

---

## 1. Primary Header Typography
*   **Main Branding Title:** `EQ AI`
*   **Supporting Application Description:** `Defensible AI Infrastructure Audits.`

---

## 2. Interactive Input Matrix & Fields

The core dashboard panel uses five specific input variables to collect baseline software usage parameters from founders:

### Row 1: Structural Tooling Configurations
*   **Field Label 1:** `TOOL`
    *   *Default Selection:* `Cursor`
    *   *Menu Array Options:* `Cursor` | `GitHub Copilot` | `ChatGPT` | `Claude`
*   **Field Label 2:** `PLAN`
    *   *Default Selection:* `Hobby`
    *   *Menu Array Options:* `Hobby` | `Pro` | `Business` | `Team`

### Row 2: Financial & Operational Bounds
*   **Field Label 3:** `MONTHLY BILL ($)`
    *   *Default Selection/Value:* `160`
    *   *Data Restraint:* Numbers-only input field
*   **Field Label 4:** `SEATS`
    *   *Default Selection/Value:* `1`
    *   *Data Restraint:* Whole numbers-only seat counts input field

### Row 3: Operational Categorization
*   **Field Label 5:** `PRIMARY USE CASE`
    *   *Default Selection:* `Data`
    *   *Menu Array Options:* `Data` | `Engineering` | `DevOps` | `Product`

---

## 3. Primary Call-to-Action (CTA) Button
*   **Action Execution Text:** `Generate Audit`
*   **Component Behavior:** Submitting this action takes the current input state, compresses the variables into an immutable Base64 hash string, and routes the browser cleanly to the public share path (`/share/[hash]`).

## ❓ Frequently Asked Questions (FAQ)

#### Q1: Do I need to connect our primary corporate credit cards or management tools to run this audit?
A1: No. The computation engine processes values purely based on the active user seat counts, tools, and plan tiers you enter manually. Your corporate financial data remains completely unlinked, secure, and untouched.

#### Q2: How does this tool stay free without selling my startup's operational data?
A2: The calculation engine is offered entirely free by Credex to provide immediate utility to engineering leaders. For organizations discovering massive structural tool overspend, Credex offers optimization consulting paths to transition them into specialized, lower-cost corporate credit access pools.

#### Q3: Are my company's details kept completely private if I share my results page?
A3: Yes. The "Share Results" link mechanism strips away all company and personal identifiers locally before compressing the parameters into a stateless, encrypted Base64 URL hash. Shared pages render strictly anonymized pricing rows.

#### Q4: How accurate and up-to-date is the underlying pricing data used by the engine?
A4: The logic matrix evaluates your inputs against real data hardcoded inside `PRICING_DATA.md`. This file is updated weekly against official, live pricing configurations from Cursor, GitHub, OpenAI, and Anthropic.

#### Q5: Can the engine accurately evaluate custom enterprise billing packages or heavy API usage?
A5: Yes. The tool features dedicated calculation rules built to analyze mixed configurations, helping teams assess whether migrating from individual flat-rate subscriptions over to consumption-based API access is cheaper.

