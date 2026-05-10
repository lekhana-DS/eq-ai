// lib/audit-engine.ts
import { PRICING_DB } from "./pricing-data";

interface Plan {
  id: string;
  name: string;
  pricePerUser: number;
  minUsers?: number;
}

export interface AuditPayload {
  toolName: string;
  currentCost: number;
  recommendedPlan: string;
  recommendedCost: number;
  annualSavings: number;
  isSavingMoney: boolean;
  strategy: string;
  eligibleForCredex: boolean;
}

function estimateApiCost(toolKey: string, currentMonthlySpend: number): number | null {
  if (toolKey === 'chatgpt' || toolKey === 'openai') return currentMonthlySpend * 0.6;
  if (toolKey === 'claude') return currentMonthlySpend * 0.55;
  return null;
}

export function calculateAudit(
  toolKey: string,
  currentPlanId: string,
  userCount: number,
  actualMonthlySpend: number,
  useCase: string
): AuditPayload {
  const fallback = (msg: string): AuditPayload => ({
    toolName: toolKey,
    currentCost: actualMonthlySpend || 0,
    recommendedPlan: currentPlanId,
    recommendedCost: actualMonthlySpend || 0,
    annualSavings: 0,
    isSavingMoney: false,
    strategy: `⚠️ Audit incomplete: ${msg}`,
    eligibleForCredex: false,
  });

  const tool = PRICING_DB[toolKey];
  if (!tool) return fallback(`Tool "${toolKey}" not found`);

  const currentPlan = tool.plans.find((p: Plan) => p.id === currentPlanId);
  if (!currentPlan) return fallback(`Plan "${currentPlanId}" not found for tool "${toolKey}"`);

  const calculatedCost = currentPlan.pricePerUser * userCount;
  const currentCost = actualMonthlySpend > 0 ? actualMonthlySpend : calculatedCost;

  // ========== NEW: OVERBILLING DETECTION ==========
  // If user entered spend is higher than the plan's official price, flag savings
  if (actualMonthlySpend > 0 && actualMonthlySpend > calculatedCost) {
    const overbilling = actualMonthlySpend - calculatedCost;
    const annualSavings = overbilling * 12;
    const strategy = `You are overpaying by $${overbilling}/month ($${annualSavings}/year) compared to ${currentPlan.name}’s official pricing. Contact your vendor to adjust billing or switch to direct invoicing.`;
    return {
      toolName: tool.name,
      currentCost: actualMonthlySpend,
      recommendedPlan: currentPlan.name,
      recommendedCost: calculatedCost,
      annualSavings,
      isSavingMoney: true,
      strategy,
      eligibleForCredex: annualSavings > 500,
    };
  }

  // 1. Cheaper plan within same vendor
  const cheaperPlan = tool.plans
    .filter((p: Plan) => p.pricePerUser < currentPlan.pricePerUser && userCount >= (p.minUsers || 1))
    .sort((a: Plan, b: Plan) => b.pricePerUser - a.pricePerUser)[0];

  // 2. API alternative (only for 1-2 users)
  let apiRecommended = false;
  let apiCost: number | null = null;
  let apiPlanName = "";
  if (userCount <= 2 && (toolKey === 'chatgpt' || toolKey === 'claude' || toolKey === 'openai')) {
    const est = estimateApiCost(toolKey, currentCost);
    if (est && est < currentCost) {
      apiRecommended = true;
      apiCost = est;
      apiPlanName = toolKey === 'chatgpt' ? "OpenAI API" : "Anthropic API";
    }
  }

  // 3. Volume discount / Credex recommendation for large teams
  let volumeDiscount = false;
  let volumeStrategy = "";
  if (!cheaperPlan && !apiRecommended && userCount >= 20 && currentCost >= 200) {
    volumeDiscount = true;
    volumeStrategy = `Your team of ${userCount} seats spends $${currentCost}/month. Standard per‑seat pricing doesn't scale. Credex offers institutional credits at 15‑30% below retail – contact them to unlock volume discounts.`;
  }

  // 4. Alternative tool suggestions (only if no other savings found)
  let alternativeRecommended = false;
  let altPlanName = "";
  let altCost = 0;
  let altStrategy = "";
  if (!cheaperPlan && !apiRecommended && !volumeDiscount) {
    if (useCase === "Coding" && toolKey !== "cursor") {
      const cursorPro = PRICING_DB["cursor"]?.plans.find((p: Plan) => p.id === "pro");
      if (cursorPro) {
        alternativeRecommended = true;
        altPlanName = "Cursor Pro";
        altCost = cursorPro.pricePerUser * userCount;
        altStrategy = `Switch to Cursor Pro for native IDE completions. Estimated monthly cost: $${altCost}.`;
      }
    } else if (useCase === "Data" && currentCost > 150 && userCount <= 5) {
      alternativeRecommended = true;
      altPlanName = "Usage‑Based API";
      altCost = currentCost * 0.3;
      altStrategy = `Replace subscriptions with usage‑based API – estimated monthly cost: $${altCost}.`;
    }
  }

  // Final decision
  let recommendedPlan = currentPlan.name;
  let recommendedCost = currentCost;
  let strategy = "Your current configuration is cost‑optimal for your team size. No changes recommended.";
  let eligibleForCredex = false;

  if (apiRecommended && apiCost !== null) {
    recommendedPlan = apiPlanName;
    recommendedCost = apiCost;
    strategy = `Switch to ${apiPlanName} (pay‑as‑you‑go). Save ~$${Math.round((currentCost - apiCost) * 12)}/year.`;
  } else if (cheaperPlan) {
    recommendedPlan = cheaperPlan.name;
    recommendedCost = cheaperPlan.pricePerUser * userCount;
    strategy = `Downgrade to ${cheaperPlan.name}. Save ~$${Math.round((currentCost - recommendedCost) * 12)}/year.`;
  } else if (volumeDiscount) {
    recommendedPlan = "Credex Institutional Credits";
    const discountedCost = currentCost * 0.8;
    recommendedCost = discountedCost;
    strategy = volumeStrategy;
    eligibleForCredex = true;
  } else if (alternativeRecommended) {
    recommendedPlan = altPlanName;
    recommendedCost = altCost;
    strategy = altStrategy;
  }

  const annualSavings = Math.max(0, (currentCost - recommendedCost) * 12);
  if (!eligibleForCredex && (annualSavings > 500 || (userCount >= 20 && currentCost >= 200))) {
    eligibleForCredex = true;
  }

  return {
    toolName: tool.name,
    currentCost,
    recommendedPlan,
    recommendedCost,
    annualSavings,
    isSavingMoney: annualSavings > 0,
    strategy,
    eligibleForCredex,
  };
}