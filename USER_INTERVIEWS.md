# User Research & Discovery Logs

This document logs the tactical feedback, structural friction points, and operational insights captured during three 15-minute user discovery interviews.

---

## Interview 1: Abhishek — Startup Founder (Seed Stage SaaS Startup, 12 People)

### 💬 Direct Core Quotes:
*   *"We are paying for separate OpenAI Pro seats while half the engineering team is already expensing standalone Cursor Business licenses that use the exact same underlying models."*
*   *"When I look at our financials, I look strictly at our monthly total burn rate rather than itemizing the specific cost of individual development tools."*
*   *"If a tool highlights a clear redundancy, I can immediately kill the duplicate tier to expand our operational runway."*

### 🧠 The Most Surprising Insight:
The user evaluates department expenses holistically by monitoring their monthly aggregate cash burn velocity rather than evaluating individual tool licensing lines independently.

### 🛠️ Resulting Architectural Design Shift:
This insight directly led to the implementation of a dedicated **"Redundancy Check" submodule** inside the local calculation module (`src/engine/`). The engine actively checks for overlapping functional categories—flagging if a single team is running overlapping web packages like both ChatGPT Team and Cursor Business simultaneously—and calculates the combined waste.

---

## Interview 2: Mehul Chandak — Independent Developer & Technical Founder (Bootstrapped Side Project)

### 💬 Direct Core Quotes:
*   *"I was forced to jump tiers from an Individual plan into a costly Team tier purely because I kept hitting the restrictive hourly message limits on the web app."*
*   *"I want an option that clearly calculates whether switching over to raw, pay-as-you-go API consumption is cheaper than paying a flat monthly subscription rate."*
*   *"If an optimization tool can accurately estimate my monthly token volume against subscription costs, I'll use it every single month."*

### 🧠 The Most Surprising Insight:
SaaS tier-jumping into expensive enterprise team packages is regularly driven by developers seeking higher contextual limits rather than multi-seat administrative coordination tools.

### 🛠️ Resulting Architectural Design Shift:
I refactored the computational engine to support a **"Subscription vs. Raw API Consumption" comparison matrix**. The tool now evaluates a user's active prompt volume against static vendor API price tiers mapped in `PRICING_DATA.md`, displaying alternative API integration savings vectors.

---

## Interview 3: Kavya — Engineering Manager (Series A Growth Stage Team, 22 Devs)

### 💬 Direct Core Quotes:
*   *"Tracking down fragmented invoices across fifteen individual engineer expense reports every single month creates massive operational overhead for our accounting team."*
*   *"I would happily pay a slight premium for centralized corporate billing simply to eliminate the receipt-chasing headache."*
*   *"We routinely leave inactive seats running on team plans just because the administrative process to remove them takes too much time."*

### 🧠 The Most Surprising Insight:
Administrative overhead and receipt fragmentation are more painful for managers than minor differences in the base price of licensing tiers.

### 🛠️ Resulting Architectural Design Shift:
I integrated an automated **"Operational Simplification Rule"** into the logic array. When the user sets the seat count parameter to greater than 5 (`seats > 5`), the system automatically suggests consolidated Team Plans over fragmented Solo Individual plans. It emphasizes structural receipt consolidation benefits alongside financial savings.
