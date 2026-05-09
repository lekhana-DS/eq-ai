"use client";
import { useState, useEffect } from "react";
import { calculateAudit } from "./lib/audit-engine";
import { PRICING_DB } from "./lib/pricing-data";

export default function Home() {
  const [toolKey, setToolKey] = useState("cursor");
  const [planId, setPlanId] = useState("pro");
  const [users, setUsers] = useState(1);
  const [result, setResult] = useState<any>(null);

  // Sync plan selection when tool changes
  useEffect(() => {
    if (PRICING_DB[toolKey]) {
      setPlanId(PRICING_DB[toolKey].plans[0].id);
    }
  }, [toolKey]);

  const handleAudit = () => {
    const auditResult = calculateAudit(toolKey, planId, users);
    setResult(auditResult);
  };

 const handleShare = () => {
  const savings = result?.annualSavings || 0;
  const toolName = PRICING_DB[toolKey]?.name || "AI stack";

  // Data-driven "Alpha" text
  const shareText = 
    `🔍 Just audited our ${toolName} infrastructure via EQ AI.\n\n` +
    `💰 Identified $${savings.toLocaleString()}/yr in redundant seat costs and tier-mismatch.\n\n` +
    `If you're scaling AI seats, you're likely overpaying. Run a defensible audit here:`;

  const pageUrl = encodeURIComponent("https://vercel.app");
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${pageUrl}`;

  window.open(twitterUrl, "_blank", "width=600,height=400");
};




  return (
    <main className="p-6 md:p-10 max-w-2xl mx-auto font-sans min-h-screen bg-gray-50">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-blue-900 tracking-tight italic">EQ AI</h1>
        <p className="text-gray-500 mt-2 font-medium">Restore financial equilibrium to your AI infrastructure.</p>
      </div>
      
      <div className="space-y-5 bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl">
        {/* Tool Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Select AI Tool</label>
          <select 
            value={toolKey} 
            onChange={(e) => setToolKey(e.target.value)}
            className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer font-semibold"
          >
            {Object.keys(PRICING_DB).map(key => (
              <option key={key} value={key}>{PRICING_DB[key].name}</option>
            ))}
          </select>
        </div>

        {/* Plan Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Current Plan</label>
          <select 
            value={planId} 
            onChange={(e) => setPlanId(e.target.value)}
            className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer font-semibold"
          >
            {PRICING_DB[toolKey].plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name} (${plan.pricePerUser}/user)</option>
            ))}
          </select>
        </div>

        {/* User Count */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Team Size (Seats)</label>
          <input 
            type="number" 
            value={users || ""} 
            onChange={(e) => setUsers(parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
          />
        </div>

        <button 
          onClick={handleAudit}
          className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm"
        >
          Execute Optimization Audit
        </button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Main Audit Result */}
          <div className="mt-10 p-8 rounded-3xl border-2 border-blue-500 bg-white shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Audit Summary</h2>
              {result.isSavingMoney && (
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Savings Found</span>
              )}
            </div>
            
            <p className="text-gray-500 text-sm font-medium">Estimated Monthly Spend</p>
            <p className="text-3xl font-black text-gray-900">${result.currentCost}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-3">Strategic Protocol</p>
              <p className="text-gray-700 font-medium leading-relaxed italic">"{result.strategy}"</p>
              
              {result.isSavingMoney && (
                <div className="mt-6 bg-green-50 p-6 rounded-2xl border border-green-100">
                  <p className="text-green-800 text-sm font-semibold">
                    Optimal Tier: <span className="font-bold underline">{result.recommendedPlan}</span>
                  </p>
                  <p className="text-4xl font-black text-green-600 mt-2 tracking-tighter">
                    + ${result.annualSavings}<span className="text-sm font-bold uppercase ml-2 opacity-60">Saved / Year</span>
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={handleShare}
              className="mt-8 w-full flex items-center justify-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-50 p-4 rounded-2xl transition-all border border-blue-100"
            >
              🐦 Broadcast Savings to Network
            </button>
          </div>

          {/* CREDEX INTEGRATION CARD */}
          <div className="mt-6 p-8 bg-blue-900 text-white rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black tracking-tight italic">Credex Advantage</h3>
                <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
                  Optimization Alpha
                </span>
              </div>
              
              <div className="mt-8">
                <p className="text-blue-300 text-[10px] uppercase font-black tracking-[0.3em]">Total Savings Opportunity</p>
                <div className="text-5xl font-black mt-2 tracking-tighter">
                  ${(result.annualSavings + (result.recommendedCost * 0.2 * 12)).toFixed(0)}<span className="text-lg font-medium text-blue-400 ml-1">/YR</span>
                </div>
              </div>

              <button className="mt-8 w-full bg-white text-blue-900 p-5 rounded-2xl font-black hover:bg-blue-50 transition-all text-xs uppercase tracking-[0.2em] shadow-lg">
                Activate Credex Credits
              </button>
            </div>
            {/* Background Glow */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-[100px]"></div>
          </div>
        </div>
      )}
      
      <footer className="mt-16 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] opacity-50">
        Engineered for Credex Systems • EQ AI Framework v1.2
      </footer>
    </main>
  );
}
