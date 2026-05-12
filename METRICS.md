# Product Analytics & North Star Metrics Framework

This matrix establishes the tracking framework, conversion milestones, and monitoring instrumentation needed to analyze the audit engine's operational efficiency.

---

## 1. Primary Corporate North Star Metric

The singular focus metric for this application is **Total Confirmed Annual Savings Discovered (\$)**. 

### Why this is the North Star:
*   **Direct Value Proof:** It measures the exact financial pain point resolved for the customer immediately upon engine execution.
*   **High-Quality Lead Filter:** It maps cleanly to Credex's B2B optimization consultation funnel. A higher discovered savings volume indicates a highly qualified, high-intent lead ready for conversion.
*   **Avoids Vanity Traps:** It completely drops irrelevant SaaS consumer growth data like Daily Active Users (DAU), since infrastructure tools are running on lower, high-value quarterly or annual evaluation frequencies.

---

## 2. Core Supporting Input Metrics

To intentionally drive and expand our North Star metric value, we measure and optimize three core input metrics:

*   **Audit Generation Velocity:** The total volume of completed audit forms generated per week. This serves as the top-of-funnel traffic health check across acquisition vectors.
*   **High-Value Audit Ingestion Yield (%):** The percentage of unique audits that reveal over \$2,500 in annual optimization waste. This tells us if marketing loops are successfully targeting bloated team profiles rather than solo hobbyists.
*   **Lead Capture Ingestion Rate (%):** The conversion percentage of total audit viewers who fill out the optional corporate email capture box after seeing their initial financial breakdown.

---

## 3. High-Priority Analytics Instrumentation Focus

We will instrument **form field drop-off analytics** first using a lightweight tracker like Mixpanel or PostHog event logging.

### Why this comes first:
*   We must map the exact step where users pause or abandon the calculator interface.
*   By tracking drop-offs across specific fields (e.g., inputting the exact `MONTHLY BILL ($)` vs selecting a `PRIMARY USE CASE`), we can continuously simplify form requirements to maximize completion rates.

---

## 4. Strategic Pivot Decision Threshold

We establish a rolling 400-session check window to track user conversion friction:

*   **The Trigger Metric:** If the overall Lead Form Email Conversion Rate drops below **3.5% over 400 consecutive sessions**.
*   **The Pivot Action:** A drop below this floor indicates that technical users are either dropping out due to privacy fears or missing the immediate value proposition. If triggered, we will pivot the conversion flow by removing the manual corporate form field completely. Instead, we will implement an un-gated, single-click *"Download PDF Audit Invoice"* option that captures the email address naturally as the delivery endpoint.
