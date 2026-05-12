
## Day 1 — May 8, 2026
**Hours worked:** 2 hours

**What I did:** 
- Finalized product identity as "EQ AI". 
- Scaffolded Next.js project with TypeScript and Tailwind CSS.
- Configured Git environment and established a 5-day commit roadmap.
- Defined core value proposition: balancing AI performance with cost efficiency.

  
**What I learned:** Setting up a professional Git workflow is the foundation of a defensible product audit.  

**Blockers:** Initial local Git configuration issues (resolved).  

**Plan for tomorrow:** Build the Spend Input form and implement the core Audit Engine logic.
=============================================================================
## Day 2 — May 9, 2026
**Hours worked:** 3 hours

**What I did:**
- Built the core `AuditEngine` logic in TypeScript, moving from static data to a deterministic calculation module.
- Implemented a "Smart Recommendation" system that prioritizes administrative efficiency (centralized billing) over raw cost for larger teams.
- Created a dynamic UI in Next.js that allows users to select specific plans and team sizes.
- Fixed input handling to prevent `NaN` errors during user interaction.

**What I learned:**
- React state management for dependent dropdowns (Tools -> Plans).
- The importance of "Business Logic" in fintech—saving \$20 isn't worth it if it creates 10 extra expense reports for a manager.

**Blockers:**
- Encountered React rendering issues with floating HTML tags (Resolved by wrapping in fragments/divs).

**Plan for tomorrow:**
- Integrate the "Credex Savings Bridge" to show savings using discounted credits.
- Start designing the "Viral Share" summary component.
===============================================================================================
## Day 3: Deployment & Viral Loop Integration
**Hours worked:5 hours

### What I did:
- Established a CI/CD pipeline by connecting the GitHub repository to Vercel.
- Successfully deployed the MVP to a live production environment (https://vercel.app).
- Implemented the "Broadcast to X" viral share feature with professional, data-driven pre-text.
- Refined the UI of the Audit Result card to improve mobile responsiveness.

### What I learned:
- Debugged a critical `SyntaxError` in `window.open()` caused by improper template literal syntax and missing URL encoding.
- Learned how to manage environment variables in Vercel to keep API keys secure while allowing the live site to function.

### Blockers:
- Encountered a "Window: Unable to open a window with invalid URL" error. Resolved it by properly using `${}` syntax for URI encoding and directing to the correct Twitter intent path.
=================================================================================
## Day 4: Supabase Integration & Database Schema Architecture
**Hours worked:** 4 hours
### What I did:
- Integrated Supabase into the Next.js application as the core Backend-as-a-Service (BaaS) platform.
- Designed and initialized the database schema, creating primary tables for user spend profiles, audit records, and workspace configurations.
- Configured secure Row Level Security (RLS) policies on the database to isolate tenant data for larger teams.
- Established local environment variables to manage the database connection string and public anon API keys securely.
### What I learned:
- Learned how to write granular PostgreSQL RLS policies to enforce workspace-level access control based on user metadata.
- Understood the trade-offs of using Supabase's auto-generated types versus writing manual TypeScript interfaces for database transactions.
### Blockers:
- Encountered a migration syncing issue between the local database state and the remote Supabase dashboard (Resolved by resetting the local development branch tracking).
### Plan for tomorrow:
- Connect the frontend `AuditEngine` components directly to the live Supabase client data hooks.

=================================================================================

## Day 5: Cloudflare Network Tunnels & Outbound Email Infrastructure
**Hours worked:** 5 hours
### What I did:
- Provisioned a secure Cloudflare Zero Trust network tunnel targeting the Tokyo (`ap-northeast-1`) regional hub for infrastructure domain routing.
- Integrated the `@resend` server-side rendering mailing dependency package into the local Next.js project.
- Injected secret domain tracking authorization hashes inside secure production infrastructure environment profiles.
- Established automated DNS delegation records to securely bind `credexon.com` outbound traffic directly to AWS SES pathways.
- Structured three isolated Cloudflare routing records bypass rules using unproxied DNS-Only modes (MX and TXT arrays).
- Configured dynamic email routers to partition user confirmations into isolated queues depending on team size thresholds.
### What I learned:
- Cloudflare infrastructure setups default to a "Not Started" status flag until local servers run an authenticated `cloudflared` token string instance.
- Third-party mailing API relays mandate bypassed DNS proxy layers to properly check and validate cryptographic DKIM handshakes.
### Blockers:
- Resend record authorizations failed validation metrics initially until unproxied 1-hour Time-To-Live (TTL) policies were manually adjusted.
### Plan for tomorrow:
- Complete the local server `cloudflared` daemon installation scripts.
- Execute integration tests on the transaction email layer using live API payload strings to confirm delivery.

