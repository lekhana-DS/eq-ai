"use client";

import { useState, useEffect } from "react";
import { calculateAudit } from "./lib/audit-engine";
import { PRICING_DB, USE_CASES } from "./lib/pricing-data";

export default function Home() {
  const [toolKey, setToolKey] = useState("cursor");
  const [planId, setPlanId] = useState("pro");
  const [users, setUsers] = useState(1);
  const [monthlySpend, setMonthlySpend] = useState(20);
  const [useCase, setUseCase] = useState("Coding");
  const [result, setResult] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence: Load & Save
  useEffect(() => {
    const saved = localStorage.getItem("eq_ai_state");
    if (saved) {
      const p = JSON.parse(saved);
      setToolKey(p.toolKey); setPlanId(p.planId); setUsers(p.users);
      setMonthlySpend(p.monthlySpend); setUseCase(p.useCase);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("eq_ai_state", JSON.stringify({ toolKey, planId, users, monthlySpend, useCase }));
    }
  }, [toolKey, planId, users, monthlySpend, useCase, isLoaded]);

  const handleAudit = () => {
    const auditResult = calculateAudit(toolKey, planId, users, monthlySpend, useCase);
    setResult(auditResult);
  };

  if (!isLoaded) return null;

  return (
    <main className="p-4 md:p-10 max-w-2xl mx-auto font-sans min-h-screen bg-[#F8FAFC]">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black text-[#0F172A] tracking-tighter italic">EQ AI</h1>
        <p className="text-slate-500 mt-3 font-medium antialiased">Defensible AI Infrastructure Audits.</p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tool</label>
            <select value={toolKey} onChange={(e) => setToolKey(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-blue-500">
              {Object.keys(PRICING_DB).map(k => <option key={k} value={k}>{PRICING_DB[k].name}</option>)}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Plan</label>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-blue-500">
              {PRICING_DB[toolKey].plans.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Monthly Bill ($)</label>
            <input type="number" value={monthlySpend} onChange={(e) => setMonthlySpend(Number(e.target.value))} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-blue-500" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Seats</label>
            <input type="number" value={users} onChange={(e) => setUsers(Number(e.target.value))} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-blue-500" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Primary Use Case</label>
          <select value={useCase} onChange={(e) => setUseCase(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-blue-500">
            {USE_CASES.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <button onClick={handleAudit} className="w-full bg-[#1E293B] text-white p-5 rounded-2xl font-black hover:bg-black transition-all uppercase tracking-widest text-xs shadow-lg">
          Generate Audit
        </button>
      </div>

      {/* RESULTS SECTION */}
      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* HERO RESULTS */}
          <div className={`p-8 rounded-[32px] border-2 ${result.annualSavings > 100 ? 'border-blue-500 bg-white' : 'border-slate-200 bg-slate-50'} transition-all`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Audit Report</h2>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.annualSavings > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                {result.annualSavings > 0 ? 'Savings Found' : 'Optimal Stack'}
              </span>
            </div>

            {result.annualSavings > 0 ? (
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Annual Savings Opportunity</p>
                <div className="text-6xl font-black text-blue-600 tracking-tighter">
                  ${result.annualSavings.toLocaleString()}
                </div>
                <p className="text-slate-500 font-medium pt-4 border-t border-slate-100 mt-6 leading-relaxed italic">
                  "{result.strategy}"
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">You're spending well.</p>
                <p className="text-slate-500 mt-2 font-medium">Your current {result.toolName} configuration is highly efficient.</p>
                <button className="mt-6 text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">
                  Notify me of new optimizations →
                </button>
              </div>
            )}
          </div>

          {/* CREDEX ALPHA CARD (Dynamic Visibility) */}
          {result.annualSavings >= 500 && (
            <div className="bg-[#0F172A] text-white p-8 rounded-[32px] relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Credex Protocol Active</p>
                <h3 className="text-2xl font-bold mb-4">Capture your ${result.annualSavings.toLocaleString()} with Credex.</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  High-volume AI users qualify for institutional credits. Stop paying retail for {result.toolName} capacity.
                </p>
                <button className="w-full bg-white text-black p-5 rounded-2xl font-black hover:bg-slate-100 transition-all text-xs uppercase tracking-widest">
                  Activate Credex Alpha
                </button>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
            </div>
          )}

          {/* FOOTER ACTION */}
          <button onClick={() => window.print()} className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">
            Download Defensible PDF Audit
          </button>
        </div>
      )}
    </main>
  );
}
