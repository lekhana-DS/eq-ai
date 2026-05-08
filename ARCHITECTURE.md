<<<<<<< HEAD
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
=======
# System Architecture: EQ AI

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + Shadcn/UI
- **State Management:** React Context / Hooks
- **Testing:** Vitest / Jest (Planned)

## System Components
1. **The Audit Engine:** A deterministic TypeScript module that calculates savings based on user input and verified pricing rules.
2. **Persistence Layer:** LocalStorage for immediate session persistence.
3. **AI Logic:** Integration with Anthropic/OpenAI for qualitative spend summaries.
4. **Viral Loop:** Dynamic OpenGraph (OG) image generation for shareable results.
>>>>>>> 1fd48b9 (docs: populate Day 1 documentation and verified pricing data)
