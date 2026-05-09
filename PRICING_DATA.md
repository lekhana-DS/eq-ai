# Verified Pricing Data
*As of May 2026*

1. **Cursor Pro:**  (https://cursor.com)
2. **ChatGPT Plus:**  (https://openai.com)
3. **Claude Pro:** (https://anthropic.com)
 **Perplexity:** (https://perplexity.ai)
================================================================================

# Verified Pricing Data (Last Updated: May 9, 2026)

This document serves as the "Source of Truth" for the EQ AI audit engine. All logic in `lib/audit-engine.ts` is mapped directly to the rates listed below.

## AI Infrastructure Pricing Table


| Platform | Plan Tier | Price (Monthly) | Category | Key Target Audience |
| :--- | :--- | :--- | :--- | :--- |
| **ChatGPT** | Go | $8 | Individual | Casual/Ad-supported users |
| **ChatGPT** | Plus | $20 | Individual | Standard power users |
| **ChatGPT** | Pro | $200 | Power User | High-volume researchers |
| **ChatGPT** | Team | $25 | Team | Small to mid-sized startups |
| **ChatGPT** | Enterprise| Custom ($60) | Corporate | Large scale orgs (SOC2/SSO) |
| **Claude** | Pro | $20 | Individual | Creative and coding professionals |
| **Claude** | Max | $100 | Power User | Unrestricted access/Early models |
| **Claude** | Team | $30 | Team | Professional engineering teams |
| **Cursor** | Pro | $20 | Individual | Solo developers |
| **Cursor** | Business | $40 | Team | Tech teams requiring admin tools |
| **Perplexity** | Pro | $20 | Individual | General research and search |
| **Perplexity** | Max | $200 | Power User | Advanced data synthesis |
| **Perplexity** | Ent. Pro | $40 | Team | Enterprise search & compliance |

## Official Verification Links
- **OpenAI:** [https://openai.com](https://openai.com)
- **Anthropic:** [https://anthropic.com](https://anthropic.com)
- **Cursor:** [https://cursor.com](https://cursor.com)
- **Perplexity:** [https://perplexity.ai](https://perplexity.ai)

---

## Audit Engine Logic Rules
1. **Administrative Premium:** The engine prioritizes "Team/Business" tiers for groups larger than 5, even if individual licenses are cheaper, to account for centralized billing and security overhead.
2. **Threshold Validation:** Plans with seat minimums (e.g., ChatGPT Team requires 2 seats) are only recommended if the user count meets the requirement.
3. **Credex Optimization:** All listed prices are baseline. EQ AI highlights a secondary "Credex Price" assuming a 15-20% reduction via optimized credits.
