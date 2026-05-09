"use client";
import { useState, useEffect } from "react";
import { calculateAudit } from "./lib/audit-engine";
import { PRICING_DB } from "./lib/pricing-data";

export default function Home() {
  const [toolKey, setToolKey] = useState("cursor");
  const [planId, setPlanId] = useState("pro");
  const [users, setUsers] = useState(1);
  const [result, setResult] = useState<any>(null);

  // When tool changes, reset the plan to the first available one
  useEffect(() => {
    setPlanId(PRICING_DB[toolKey].plans[0].id);
  }, [toolKey]);

  const handleAudit = () => {
    // We will update the audit engine next to accept the current planId
    const auditResult = calculateAudit(toolKey, planId, users);
    setResult(auditResult);
  };

  return (
    <main className="p-10 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">EQ AI: Audit Engine</h1>
      
      <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        {/* Tool Selection */}
        <div>
          <label className="block text-sm font-semibold mb-1">Select AI Tool</label>
          <select 
            value={toolKey} 
            onChange={(e) => setToolKey(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50"
          >
            {Object.keys(PRICING_DB).map(key => (
              <option key={key} value={key}>{PRICING_DB[key].name}</option>
            ))}
          </select>
        </div>

        {/* Plan Selection */}
        <div>
          <label className="block text-sm font-semibold mb-1">Your Current Plan</label>
          <select 
            value={planId} 
            onChange={(e) => setPlanId(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50"
          >
            {PRICING_DB[toolKey].plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name} (${plan.pricePerUser}/user)</option>
            ))}
          </select>
        </div>

        {/* User Count */}
        <div>
          <label className="block text-sm font-semibold mb-1">Number of Users</label>
          <input 
            type="number" 
            value={users || ""} 
            onChange={(e) => setUsers(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded-lg bg-gray-50"
          />
        </div>

        <button 
          onClick={handleAudit}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Run Optimization Audit
        </button>
      </div>

      {/* Results Section (Same as before, just update the labels) */}
      {result && (
            
        <div className={`mt-8 p-6 rounded-xl border ${result.isSavingMoney ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'}`}>
          <h2 className="text-xl font-bold mb-2">Results for {result.toolName}</h2>
          <p className="text-gray-600">Current Monthly Spend: <span className="font-bold">${result.currentCost}</span></p>
          
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Strategic Recommendation</p>
            <p className="text-gray-800 mt-1 font-semibold">{result.strategy}</p>
            {result.isSavingMoney && (
              <p className="text-green-600 mt-2">
                Switching to **{result.recommendedPlan}** could save you **${result.annualSavings}** per year.
              </p>
            )}
          </div>
        </div>
      )}

   
    </main>
  );
}
