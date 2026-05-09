// lib/audit-engine.ts
import { PRICING_DB } from "./pricing-data";

export function calculateAudit(toolKey: string, currentPlanId: string, userCount: number) {
  const tool = PRICING_DB[toolKey];
  const currentPlan = tool.plans.find(p => p.id === currentPlanId);
  
  if (!tool || !currentPlan) return null;

  const currentCost = currentPlan.pricePerUser * userCount;

  // 1. Filter for "Valid" plans based on user count requirements
  const validPlans = tool.plans.filter(p => userCount >= (p.minUsers || 1));

  // 2. Find the "Best" plan using professional logic
  const bestPlan = validPlans.reduce((prev, curr) => {
    // RULE: If user is already on a Business plan, don't recommend a downgrade 
    // to an Individual plan, even if it's cheaper. Centralized billing > tiny savings.
    if (currentPlan.isBusinessPlan && !curr.isBusinessPlan) {
      return prev; 
    }

    // RULE: Otherwise, pick the cheaper per-user price
    if (curr.pricePerUser < prev.pricePerUser) return curr;
    
    // RULE: If prices are equal, prefer the Business plan for extra features
    if (curr.pricePerUser === prev.pricePerUser && curr.isBusinessPlan) return curr;
    
    return prev;
  });

  const recommendedCost = bestPlan.pricePerUser * userCount;
  const annualSavings = (currentCost - recommendedCost) * 12;

  // 3. Strategic Advice Generation
  let strategy = "";
  
  if (currentPlan.isBusinessPlan && userCount > 1) {
    strategy = "Your team is utilizing a Business-tier plan. We recommend maintaining this for centralized billing and security oversight.";
  } else if (userCount > 5 && !bestPlan.isBusinessPlan) {
    strategy = "While individual plans are cheaper, a team of your size should consider a Business plan for SOC2 compliance and admin controls.";
  } else if (bestPlan.id !== currentPlanId && annualSavings > 0) {
    strategy = `Optimization found: Switching to the ${bestPlan.name} plan better aligns with your current scale.`;
  } else {
    strategy = "Your current configuration is optimal for your team size and administrative requirements.";
  }

  return {
    toolName: tool.name,
    currentCost,
    recommendedPlan: bestPlan.name,
    recommendedCost,
    annualSavings,
    isSavingMoney: annualSavings > 0,
    isSamePlan: bestPlan.id === currentPlanId,
    strategy
  };
}
