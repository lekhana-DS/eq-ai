// lib/audit-engine.ts
import { PRICING_DB } from "./pricing-data";

export interface Plan {
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

/**
 * Estimates API direct integration usage cost based on historical data.
 * Finance model assumes an API shift reduces unutilized license overhead by ~40-45%.
 */
function estimateApiCost(toolKey: string, currentMonthlySpend: number): number | null {
  if (toolKey === "chatgpt" || toolKey === "openai") return currentMonthlySpend * 0.6;
  if (toolKey === "claude") return currentMonthlySpend * 0.55;
  return null;
}

/**
 * Executes a deterministic financial logic audit against a selected infrastructure tool.
 * Evaluates overbilling, intra-vendor downgrades, API switches, and institutional volume credits.
 */
export function calculateAudit(
  toolKey: string,
  currentPlanId: string,
  userCount: number,
  actualMonthlySpend: number,
  useCase: string
): AuditPayload {
  // Safe fallback closure preventing application runtime crashes
  const fallback = (msg: string): AuditPayload => ({
    toolName: toolKey,
    currentCost: Math.round(actualMonthlySpend || 0),
    recommendedPlan: currentPlanId,
    recommendedCost: Math.round(actualMonthlySpend || 0),
    annualSavings: 0,
    isSavingMoney: false,
    strategy: `⚠️ Audit incomplete: ${msg}`,
    eligibleForCredex: false,
  });

  const tool = PRICING_DB[toolKey];
  if (!tool) return fallback(`Tool "${toolKey}" not found`);

  const currentPlan = tool.plans.find((p: Plan) => p.id === currentPlanId);
  if (!currentPlan) return fallback(`Plan "${currentPlanId}" not found for tool "${toolKey}"`);

  // Compute reference price boundaries
  const calculatedCost = currentPlan.pricePerUser * userCount;
  const currentCost = actualMonthlySpend > 0 ? actualMonthlySpend : calculatedCost;

  // ==================== CRITERIA 1: OVERBILLING DETECTION ====================
  if (actualMonthlySpend > 0 && actualMonthlySpend > calculatedCost) {
    const overbilling = actualMonthlySpend - calculatedCost;
    const annualSavings = Math.round(overbilling * 12);
    const strategy = `You are overpaying by $${Math.round(overbilling)}/month ($${annualSavings}/year) compared to ${tool.name}’s official retail pricing for ${userCount} seats. Contact your vendor to adjust billing or move to direct invoicing.`;
    
    return {
      toolName: tool.name,
      currentCost: Math.round(actualMonthlySpend),
      recommendedPlan: currentPlan.name,
      recommendedCost: Math.round(calculatedCost),
      annualSavings,
      isSavingMoney: true,
      strategy,
      eligibleForCredex: annualSavings > 500,
    };
  }

  // ==================== CRITERIA 2: INTRA-VENDOR DOWNGRADE ====================
  // Fixed mutation bug: Spread operator [...] isolates array order memory allocations
  const cheaperPlan = [...tool.plans]
    .filter((p: Plan) => p.pricePerUser < currentPlan.pricePerUser && userCount >= (p.minUsers || 1))
    .sort((a: Plan, b: Plan) => b.pricePerUser - a.pricePerUser)[0];

  // ==================== CRITERIA 3: DEVELOPER API TRANSITION ====================
  let apiRecommended = false;
  let apiCost: number | null = null;
  let apiPlanName = "";
  
  if (userCount <= 2 && (toolKey === "chatgpt" || toolKey === "claude" || toolKey === "openai")) {
    const est = estimateApiCost(toolKey, currentCost);
    // Defensible check: Only shift to API if it guarantees >25% cost reduction safety margin
    if (est && est < currentCost * 0.75) {
      apiRecommended = true;
      apiCost = est;
      apiPlanName = toolKey === "claude" ? "Anthropic API" : "OpenAI API";
    }
  }

  // ==================== CRITERIA 4: CREDEX VOLUME DISCOUNTS ====================
  let volumeDiscount = false;
  let volumeStrategy = "";
  
  if (!cheaperPlan && !apiRecommended && userCount >= 20 && currentCost >= 200) {
    volumeDiscount = true;
    volumeStrategy = `Your team of ${userCount} seats spends $${Math.round(currentCost)}/month. Standard retail per-seat subscription models do not scale. Credex provides institutional credits 15-30% below retail margin—contact sales to unlock volume discounts.`;
  }

  // ==================== CRITERIA 5: CROSS-VENDOR ALTERNATIVES ====================
  let alternativeRecommended = false;
  let altPlanName = "";
  let altCost = 0;
  let altStrategy = "";

  if (!cheaperPlan && !apiRecommended && !volumeDiscount) {
    if (useCase === "Coding" && toolKey !== "cursor") {
      const cursorPro = PRICING_DB["cursor"]?.plans.find((p: Plan) => p.id === "pro");
      if (cursorPro) {
        const potentialAltCost = cursorPro.pricePerUser * userCount;
        // Fixed validation bug: Only suggest cross-vendor if it results in cheaper infrastructure
        if (potentialAltCost < currentCost) {
          alternativeRecommended = true;
          altPlanName = "Cursor Pro";
          altCost = potentialAltCost;
          altStrategy = `Switch from ${tool.name} to Cursor Pro for native IDE contextual embeddings. Estimated monthly cost: $${Math.round(altCost)}.`;
        }
      }
    } else if (useCase === "Data" && currentCost > 150 && userCount <= 5) {
      alternativeRecommended = true;
      altPlanName = "Usage-Based API Pipeline";
      altCost = currentCost * 0.3;
      altStrategy = `Replace heavy fixed analytical subscriptions with an optimized usage-based background API architecture. Estimated monthly cost: $${Math.round(altCost)}.`;
    }
  }

  // ==================== COMPOSER: RESOLVE THE OPTIMAL PATH ====================
  let recommendedPlan = currentPlan.name;
  let recommendedCost = currentCost;
  let strategy = "Your current configuration is cost-optimal for your verified team size. No optimizations recommended.";
  let eligibleForCredex = false;

  if (apiRecommended && apiCost !== null) {
    recommendedPlan = apiPlanName;
    recommendedCost = apiCost;
    strategy = `Switch out fixed user seats for the flexible ${apiPlanName} framework (pay-as-you-go). Estimated efficiency savings: ~$${Math.round((currentCost - apiCost) * 12)}/year.`;
  } else if (cheaperPlan) {
    recommendedPlan = cheaperPlan.name;
    recommendedCost = cheaperPlan.pricePerUser * userCount;
    strategy = `Safely downgrade your team license tier to ${cheaperPlan.name}. Estimated efficiency savings: ~$${Math.round((currentCost - recommendedCost) * 12)}/year.`;
  } else if (volumeDiscount) {
    recommendedPlan = "Credex Institutional Credits";
    recommendedCost = currentCost * 0.8; // Models standard institutional 20% discount structure
    strategy = volumeStrategy;
    eligibleForCredex = true;
  } else if (alternativeRecommended) {
    recommendedPlan = altPlanName;
    recommendedCost = altCost;
    strategy = altStrategy;
  }

  // Handle JavaScript IEEE 754 precision math rounding anomalies
  const annualSavings = Math.round(Math.max(0, (currentCost - recommendedCost) * 12));

  // Lead qualification rules for Credex outreach
  if (!eligibleForCredex && (annualSavings > 500 || (userCount >= 20 && currentCost >= 200))) {
    eligibleForCredex = true;
  }

  return {
    toolName: tool.name,
    currentCost: Math.round(currentCost),
    recommendedPlan,
    recommendedCost: Math.round(recommendedCost),
    annualSavings,
    isSavingMoney: annualSavings > 0,
    strategy,
    eligibleForCredex,
  };
}
