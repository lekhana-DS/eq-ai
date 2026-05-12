# Audit Engine Automated Verification Suite

This document logs the automated unit testing architecture guarding the **EQ AI Spend Audit Engine**. Each test isolates mathematical formulas and code boundary lines to guarantee optimization outputs without logic regression gaps.

## 🧪 Executed Automated Test Index

### 1. `src/engine/__tests__/cursor.test.ts`
*   **What it covers:** Verifies processing behavior for the Cursor engine. Checks that multi-user seat configurations under the Business tier ($40/user/month) multiply accurately over 12-month billing periods and correctly evaluates potential cost reductions against Solo Pro tiers ($20/user/month).
*   **How to run it:** `npm run test src/engine/__tests__/cursor.test.ts`

### 2. `src/engine/__tests__/copilot.test.ts`
*   **What it covers:** Validates GitHub Copilot plan tier translations. Tests inputs representing structural changes across Individual ($10/mo), Business ($19/mo), and Enterprise ($39/mo) plans, ensuring developer licensing pools scale downward cleanly.
*   **How to run it:** `npm run test src/engine/__tests__/copilot.test.ts`

### 3. `src/engine/__tests__/overforecasting.test.ts`
*   **What it covers:** Tests edge values where user configurations are already 100% efficient. Assures the code logic engine yields exactly $0 in annual savings instead of inventing false metrics, maintaining customer data credibility.
*   **How to run it:** `npm run test src/engine/__tests__/overforecasting.test.ts`

### 4. `src/engine/__tests__/billing_normalization.test.ts`
*   **What it covers:** Evaluates billing interval transformations. Inputs mixed tool bundles consisting of conflicting monthly and annual vendor commitments, validating that the logic normalizes them into a unified annual calculation.
*   **How to run it:** `npm run test src/engine/__tests__/billing_normalization.test.ts`

### 5. `src/engine/__tests__/fallback_handler.test.ts`
*   **What it covers:** Checks exception boundary security when third-party text generator networks time out. Confirms that structural route catches prevent browser crashes, outputting deterministic baseline templates cleanly.
*   **How to run it:** `npm run test src/engine/__tests__/fallback_handler.test.ts`

---

## 💻 Running the Test Suite Locally

Execute this terminal chain inside your project root to trigger the test runner engine locally:

```bash
# Clean install verified dependency locks
npm ci

# Execute the local unit verification scripts
npm run test
```
