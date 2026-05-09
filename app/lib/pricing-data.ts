export const PRICING_DB: Record<string, any> = {
  cursor: {
    name: "Cursor",
    plans: [
      { id: "hobby", name: "Hobby", pricePerUser: 0 },
      { id: "pro", name: "Pro", pricePerUser: 20 },
      { id: "business", name: "Business", pricePerUser: 40 },
      { id: "enterprise", name: "Enterprise", pricePerUser: 100 },
    ],
  },
  github_copilot: {
    name: "GitHub Copilot",
    plans: [
      { id: "individual", name: "Individual", pricePerUser: 10 },
      { id: "business", name: "Business", pricePerUser: 19 },
      { id: "enterprise", name: "Enterprise", pricePerUser: 39 },
    ],
  },
  claude: {
    name: "Claude",
    plans: [
      { id: "free", name: "Free", pricePerUser: 0 },
      { id: "pro", name: "Pro", pricePerUser: 20 },
      { id: "max", name: "Max", pricePerUser: 45 },
      { id: "team", name: "Team", pricePerUser: 30 },
      { id: "enterprise", name: "Enterprise", pricePerUser: 75 },
      { id: "api", name: "API Direct", pricePerUser: 0 }, // Usage based
    ],
  },
  chatgpt: {
    name: "ChatGPT",
    plans: [
      { id: "plus", name: "Plus", pricePerUser: 20 },
      { id: "team", name: "Team", pricePerUser: 30 },
      { id: "enterprise", name: "Enterprise", pricePerUser: 60 },
      { id: "api", name: "API Direct", pricePerUser: 0 },
    ],
  },
  gemini: {
    name: "Gemini",
    plans: [
      { id: "pro", name: "Pro", pricePerUser: 20 },
      { id: "ultra", name: "Ultra", pricePerUser: 30 },
      { id: "api", name: "API", pricePerUser: 0 },
    ],
  },
  windsurf: {
    name: "Windsurf",
    plans: [
      { id: "individual", name: "Individual", pricePerUser: 0 },
      { id: "pro", name: "Pro", pricePerUser: 20 },
      { id: "team", name: "Team", pricePerUser: 40 },
    ],
  },
  anthropic_api: { name: "Anthropic API Direct", plans: [{ id: "usage", name: "Usage Based", pricePerUser: 0 }] },
  openai_api: { name: "OpenAI API Direct", plans: [{ id: "usage", name: "Usage Based", pricePerUser: 0 }] },
};

export const USE_CASES = ["Coding", "Writing", "Data", "Research", "Mixed"];
