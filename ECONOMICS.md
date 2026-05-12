# Unit Economics & Conversion Modeling

This framework outlines the financial model, customer lifetime value (LTV), acquisition cost thresholds, and conversion pathways required to scale this audit engine into a \$1M ARR pipeline for Credex.

---

## 1. Customer Value Architecture (LTV Calculation)

Credex generates revenue by offering optimized software credit pools and cross-selling corporate spend cards. 

### Core Revenue Assumptions:
*   **Average Startup Software Spend:** A 25-person startup spends roughly \$8,000/month (\$96,000/year) on AI tools, APIs, and infrastructure.
*   **Credex Monetization Rate:** Credex captures a 2.5% net margin through transaction volume fees, software vendor kickbacks, and cross-sold financial services.
*   **Annual Revenue Per Account (ARPU):** \$96,000 × 2.5% = **\$2,400 / year**.
*   **Customer Lifetime (Retention):** Average startup lifecycle retention on a financial stack is 4 years.

\[\text{Gross Lifetime Value (LTV)} = \$2,400 \times 4 \text{ years} = \mathbf{\$9,600}\]

---

## 2. Customer Acquisition Cost (CAC) Matrix By Channel

Based on the 30-day playbook detailed in `GTM.md`, operational acquisition costs are modeled across three primary funnels:


| Acquisition Channel | Resource Allocation / Tooling Cost | Conversion Rate to Audit | Fully Loaded CAC (Per Customer) |
| :--- | :--- | :--- | :--- |
| **Organic Content (Hacker News)** | \$0 financial cost / 10 hours engineering writing | 2.5% link click-through | **\$0.00** |
| **Direct LinkedIn Outreach** | \$120/mo automated scraping tools + 15 hours labor | 4.0% response rate | **\$18.50** |
| **Accelerator Partnerships** | \$0 cost / B2B relational account manager setup | 45% mandatory audit run | **\$35.00** (Partner perk cost) |

\[\text{Blended Target CAC Baseline} = \mathbf{\$17.83}\]

Given our Gross LTV of \$9,600, a blended CAC of \$17.83 yields an **LTV:CAC ratio of 538:1**, demonstrating the massive unit economic efficiency of using software tools as a lead-generation mechanism.

---

## 3. Operational Conversion Funnel (Audit to Contract)

To maintain structural profitability, the application's funnel must maintain these minimum baseline conversion parameters:

```text
[ 1,000 Unique Inbound Audits Run ]
                │
                ▼ (12.0% Email Ingestion Rate via Lead Capture Card)
   [ 120 Verified Operator Leads ]
                │
                ▼ (15.0% Strategy Consultation Booking Rate)
    [ 18 Credex Consultations Booked ]
                │
                ▼ (25.0% Sales Closing / Activation Rate)
      [ 4.5 Closed Contracts Signed ]
```

### The Math Behind Funnel Profitability:
*   **Total Audits Required per 1 Closed Customer:** $1,000 \div 4.5 = \mathbf{222.2 \text{ audits}}$.
*   **Total Processing Cost per Audit:** Upstash Redis + Supabase serverless computing costs + Resend Sandbox emails average **$0.002 per run**.
*   **Total Infrastructure Cost per Closed Customer:** $222.2 \times \$0.002 = \mathbf{\$0.44}$.
*   **Breakeven Verification:** Since the annual revenue of one single closed customer ($2,400) vastly exceeds the marginal computing and acquisition overhead ($0.44 infrastructure + $17.83 blended CAC = $18.27 total cost), the tool is highly profitable from day one.

---

## 4. Operational Milestones to $1M ARR in 18 Months

To drive **$1,000,000 in Annual Recurring Revenue** within 18 months, the platform must successfully close and retain a specific volume of enterprise startup accounts.

### Step-by-Step Target Metrics Breakdown:
*   **Total Active Contracts Needed:** $\$1,000,000 \text{ target ARR} \div \$2,400 \text{ annual revenue per account} = \mathbf{417 \text{ active customers}}$.
*   **Monthly Account Closing Velocity:** $417 \text{ total accounts} \div 18 \text{ months} = \mathbf{23.2 \text{ closed contracts / month}}$.
*   **Daily Traffic Targets Required (Using our Funnel Ratios):**
    *   To secure 23.2 closed accounts per month, the sales team needs to host **92.8 scheduled consultations** per month ($23.2 \div 25\%$).
    *   To secure 92.8 calls, the database needs to capture **618.6 verified emails** per month ($92.8 \div 15\%$).
    *   To capture 618.6 emails, the application must process **5,155 completed audits** per month ($618.6 \div 12\%$).

$$\text{Daily Audit Volume Target} = 5,155 \text{ monthly audits} \div 30 \text{ days} = \mathbf{172 \text{ audits / day}}$$

### Strategic Pillars Required to Hit These Targets:
1.  **Algorithmic Virality:** The app's public sharing link mechanism (`/share/...`) must achieve a virality coefficient of $K \ge 0.15$ (meaning every 100 users who run an audit natively invite 15 new operators to run theirs via shared Slack/X links).
2.  **Platform Launch Integration:** Launching the utility systematically on Product Hunt, Hacker News, and TLDR Web Dev to capture a massive baseline traffic surge of 15,000+ top-of-funnel hits within the first 48 hours.
3.  **Automatic Embedded Partnerships:** Successfully onboarding at least 3 mid-tier venture funds or startup accelerators to automate the audit process, embedding the system directly into their mandatory company onboarding flows.
