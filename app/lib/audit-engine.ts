// lib/audit-engine.ts
import { PRICING_DB } from "./pricing-data";

export function calculateAudit(
  toolKey: string, 
  currentPlanId: string, 
  userCount: number, 
  actualMonthlySpend: number, 
  useCase: string
) {
  const tool = PRICING_DB[toolKey];
  const currentPlan = tool.plans.find((p: any) => p.id === currentPlanId);

  if (!tool || !currentPlan) return null;

  // Actual Spend vs. Catalog Price calculation
  const calculatedCost = currentPlan.pricePerUser * userCount;
  const currentCost = actualMonthlySpend > 0 ? actualMonthlySpend : calculatedCost;

  // 1. TIER-DOWN LOGIC (Same Vendor)
  // Logic: Is there a cheaper plan from the same vendor that supports this many users?
  const cheaperSameVendor = tool.plans
    .filter((p: any) => p.pricePerUser < currentPlan.pricePerUser && userCount <= (p.maxUsers || Infinity))
    .sort((a: any, b: any) => a.pricePerUser - b.pricePerUser)[0];

  // 2. CROSS-TOOL ALTERNATIVE (Defense-grade Reasoning)
  // Logic: If UseCase is 'Coding' and tool isn't Cursor/Windsurf, suggest specialized IDEs.
  // Logic: If UseCase is 'Data' and spend is high, suggest API Direct (80% cost reduction).
  let alternativeSuggestion = null;
  if (useCase === "Coding" && !["cursor", "windsurf"].includes(toolKey)) {
    alternativeSuggestion = { name: "Cursor Pro", price: 20, reason: "IDE-native AI reduces context-switch latency vs. chat." };
  } else if (useCase === "Data" && currentCost > 50) {
    alternativeSuggestion = { name: "OpenAI API Direct", price: currentCost * 0.2, reason: "Usage-based billing eliminates 'idle seat' tax for automated workflows." };
  }

  // 3. FINAL RECOMMENDATION
  let recommendedPlan = currentPlan.name;
  let recommendedCost = calculatedCost;
  let strategy = "Your current configuration is optimal for your scale and administrative requirements.";

  // Rule: Seat Redundancy Check
  if (actualMonthlySpend > calculatedCost && userCount > 0) {
    strategy = `Audit detected a $${actualMonthlySpend - calculatedCost} monthly delta. You are likely paying for redundant/zombie seats.`;
  }

  // Rule: Tier Mismatch Check
  if (cheaperSameVendor) {
    recommendedPlan = cheaperSameVendor.name;
    recommendedCost = cheaperSameVendor.pricePerUser * userCount;
   // Replace the old strategy line with this one:
strategy = `We recommend the ${cheaperSameVendor.name} plan for your current scale; it offers the same performance at a better price point.`;

  }

  // Rule: Alternative Tool Superiority
  if (alternativeSuggestion && (currentCost - alternativeSuggestion.price) > 15) {
    strategy = `Protocol Shift: Based on your ${useCase} focus, ${alternativeSuggestion.name} provides ${alternativeSuggestion.reason}`;
    // We don't force the 'recommendedPlan' to a different tool to keep the audit "Defensible" within the vendor, 
    // but we highlight it in the strategy.
  }

  const annualSavings = Math.max(0, (currentCost - recommendedCost) * 12);

  return {
    toolName: tool.name,
    currentCost,
    recommendedPlan,
    recommendedCost,
    annualSavings,
    isSavingMoney: annualSavings > 1,
    strategy
  };
}
