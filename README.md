
# EQ AI — Defensible AI Infrastructure Audits

A free, production-ready lead-generation web application built for **Credex** that audits, benchmarks, and optimizes startup AI infrastructure tool spend. It provides immediate actionable savings insights to founders and engineering managers while filtering high-value leads for Credex optimization consultations.

## 🚀 Live Links
- **Live Deployed App:** [https://vercel.app][(https://vercel.app)](https://vercel.com/lekhana-d-s-s-projects
)

---
<img width="634" height="389" alt="image" src="https://github.com/user-attachments/assets/6e2a1ea9-c7ba-4f73-9c04-262eae430186" />
<img width="604" height="401" alt="image" src="https://github.com/user-attachments/assets/c652da30-bb64-486e-ab5c-4d55dc1d1a7d" />
<img width="573" height="412" alt="image" src="https://github.com/user-attachments/assets/da62d40e-da88-4eec-a08d-6fca5f68a39f" />
<img width="651" height="417" alt="image" src="https://github.com/user-attachments/assets/80953f95-fc50-4f01-aa92-19c9061ae3ff" />
<img width="636" height="334" alt="image" src="https://github.com/user-attachments/assets/55d48b7f-2290-4469-a831-ede40d014c63" />
<img width="617" height="375" alt="image" src="https://github.com/user-attachments/assets/f1e8399d-474c-4389-ae9a-d3a7dd5577a5" />
<img width="678" height="147" alt="image" src="https://github.com/user-attachments/assets/fe7d0efb-1cff-4e01-a8bf-15ea79e8ac6d" />
<img width="697" height="300" alt="image" src="https://github.com/user-attachments/assets/f1ab8144-eba5-47ce-a38a-e0bce4a87c07" />
<img width="706" height="130" alt="image" src="https://github.com/user-attachments/assets/6eec23e8-97ee-4125-8814-9aae32605762" />


---

## 🛠️ Quick Start

### 1. Prerequisites
Ensure you have Node.js (v18 or higher) and npm/pnpm/yarn installed on your local machine.

### 2. Installation
Clone the repository and install the project dependencies:
```bash
git clone github.com
cd eq-ai
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and configure your keys:
```env
NEXT_PUBLIC_SUPABASE_URL="supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_secret_service_role_key"
RESEND_API_KEY="re_your_resend_key"
UPSTASH_REDIS_REST_URL="upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
VITE_ANTHROPIC_API_KEY="your_anthropic_api_key_here"
```

### 4. Run Locally
Start the local development server:
```bash
npm run dev
```

### 5. Run Automated Tests
Execute the comprehensive audit engine validation suite:
```bash
npm run test
```

---

## ⚖️ Engineering Decisions & Trade-offs

During this 7-day build sprint, five structural trade-offs were made to prioritize functional depth and user conversion over non-essential architecture:

1. **Lazy Initialization of Database Clients (Runtime over Top-Level)**
   - *Context:* Instantiating Supabase clients at the top level crashes Next.js compilation phases if keys are missing in the build sandbox environment.
   - *Decision:* Moved `createClient` inside the runtime `POST` body wrapper.
   - *Trade-off:* Adds a negligible microsecond runtime overhead during cold requests, but ensures smooth compilation pipelines without breaking continuous deployment servers.

2. **State Persistence Strategy (LocalStorage over Session/DB State)**
   - *Context:* The form must persist across accidental reloads.
   - *Decision:* Used a structured React state synced directly to `localStorage`.
   - *Trade-off:* Avoided premature database traffic on incomplete inputs, moving heavy DB transaction costs strictly to the email-gated lead capture workflow.

3. **Strict Deterministic Audit Math over Generative Logic**
   - *Context:* Generating dollar values via LLM causes calculation drift and hallucinatory pricing rules.
   - *Decision:* Hardcoded strict conditional logic based on official static data mapped in `PRICING_DATA.md`.
   - *Trade-off:* Kept AI capabilities strictly confined to narrative summary generation, ensuring a finance-literate person can trace every dollar saved cleanly.

4. **Graceful Fallback Handlers for LLM Token Timeout/Failures**
   - *Context:* Third-party LLM network limits can instantly break user experiences or lead-generation flows.
   - *Decision:* Isolated the Anthropic endpoint call with an implicit timeout trap that switches to a deterministic template summary if the request crashes.
   - *Trade-off:* Sacrificed hyper-personalized prose during network dropouts to ensure a 100% conversion availability rate.

5. **Public Shareable State Strategy (URL Encoding vs Server Queries)**
   - *Context:* Users need unique, shareable public audit URLs with proper Open Graph previews.
   - *Decision:* Stripped sensitive corporate data locally and generated deterministic Base64 configuration hashes directly inside the shareable slug.
   - *Trade-off:* Removes structural read burdens from the production backend database for public traffic while safely enforcing full user anonymity.
