// lib/pricing-data.ts

export type Plan = {
  id: string;
  name: string;
  pricePerUser: number;
  minUsers?: number;
  isBusinessPlan: boolean;
};

export type ToolPricing = {
  name: string;
  plans: Plan[];
};

export const PRICING_DB: Record<string, ToolPricing> = {
  chatgpt: {
    name: "ChatGPT",
    plans: [
      { id: "go", name: "Go", pricePerUser: 8, isBusinessPlan: false },
      { id: "plus", name: "Plus", pricePerUser: 20, isBusinessPlan: false },
      { id: "pro_100", name: "Pro ($100)", pricePerUser: 100, isBusinessPlan: false },
      { id: "pro_200", name: "Pro ($200)", pricePerUser: 200, isBusinessPlan: false },
      { id: "business", name: "Business (Team)", pricePerUser: 25, minUsers: 2, isBusinessPlan: true },
      { id: "enterprise", name: "Enterprise (Custom)", pricePerUser: 60, minUsers: 150, isBusinessPlan: true },
    ],
  },
  claude: {
    name: "Claude",
    plans: [
      { id: "pro", name: "Pro", pricePerUser: 20, isBusinessPlan: false },
      { id: "max", name: "Max", pricePerUser: 100, isBusinessPlan: false },
      { id: "team_std", name: "Team Standard", pricePerUser: 30, minUsers: 5, isBusinessPlan: true },
      { id: "team_premium", name: "Team Premium", pricePerUser: 150, minUsers: 5, isBusinessPlan: true },
    ],
  },
  cursor: {
    name: "Cursor",
    plans: [
      { id: "pro", name: "Pro", pricePerUser: 20, isBusinessPlan: false },
      { id: "pro_plus", name: "Pro+", pricePerUser: 60, isBusinessPlan: false },
      { id: "ultra", name: "Ultra", pricePerUser: 200, isBusinessPlan: false },
      { id: "teams", name: "Teams", pricePerUser: 40, isBusinessPlan: true },
    ],
  },
  perplexity: {
    name: "Perplexity",
    plans: [
      { id: "pro", name: "Pro", pricePerUser: 20, isBusinessPlan: false },
      { id: "max", name: "Max", pricePerUser: 200, isBusinessPlan: false },
      { id: "ent_pro", name: "Enterprise Pro", pricePerUser: 40, isBusinessPlan: true },
      { id: "ent_max", name: "Enterprise Max", pricePerUser: 325, isBusinessPlan: true },
    ],
  }
};
