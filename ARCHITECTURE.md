## System Architecture: EQ AI  

### Tech Stack  
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (useState/useReducer)
- **Deployment:** Vercel (planned)

### Core Components
1. **Audit Engine:** A deterministic logic layer that maps user input against a verified pricing database.
2. **AI Summary:** Integration with Anthropic/OpenAI API to generate a qualitative executive summary of the audit.
3. **Lead Gen Bridge:** A direct call-to-action for Credex credit optimization.
================================================================================
# System Architecture Update (Day 2)

## Logic Layer
- **Pricing Database (`lib/pricing-data.ts`):** A centralized, type-safe dictionary of all AI tool tiers, seat costs, and plan metadata.
- **Audit Engine (`lib/audit-engine.ts`):** The "Brain" of the application. It evaluates `currentPlan` vs. `availablePlans` and applies business rules to recommend the "Best" path, not just the cheapest.

## UI Layer
- **Client-Side Forms:** Uses React `useState` and `useEffect` to manage real-time audit calculations without page reloads.
- **Validation:** Implements type-safe parsing of user seat counts to ensure calculation integrity.
==========================================================================================
# System Architecture Update (Day 3)

### C. Viral Loop Handler (`handleShare`)
A client-side utility that generates URI-encoded sharing strings for X (Twitter).
*   **Privacy Constraint:** Following assignment requirements, the handler strips all Personally Identifiable Information (PII) before generating public share links.

## 4. Infrastructure & Deployment
*   **CI/CD Pipeline:** Integrated with GitHub; every push to `main` triggers an automated production build on Vercel.
*   