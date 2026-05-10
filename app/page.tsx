"use client";

import { useState, useEffect } from "react";
import { calculateAudit } from "../lib/audit-engine";
import { PRICING_DB, USE_CASES } from "../lib/pricing-data";

export default function Home() {
  const [toolKey, setToolKey] = useState("cursor");
  const [planId, setPlanId] = useState("pro");
  const [users, setUsers] = useState(1);
  const [monthlySpend, setMonthlySpend] = useState(20);
  const [useCase, setUseCase] = useState("Coding");
  const [result, setResult] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // 🆕 Lead capture states
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({
    email: "",
    company: "",
    role: "",
    teamSize: "",
    username_verification: "", // Honeypot field
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("eq_ai_state");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setToolKey(p.toolKey || "cursor");
        setPlanId(p.planId || "pro");
        setUsers(p.users || 1);
        setMonthlySpend(p.monthlySpend || 20);
        setUseCase(p.useCase || "Coding");
      } catch (e) {
        console.error("Failed parsing localStorage state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "eq_ai_state",
        JSON.stringify({ toolKey, planId, users, monthlySpend, useCase })
      );
    }
  }, [toolKey, planId, users, monthlySpend, useCase, isLoaded]);

  // 🔧 When tool changes, reset planId to first plan
  useEffect(() => {
    const firstPlan = PRICING_DB[toolKey]?.plans[0]?.id;
    if (firstPlan && planId !== firstPlan) {
      setPlanId(firstPlan);
    }
  }, [toolKey]);

  const handleAudit = async () => {
    const auditResult = calculateAudit(toolKey, planId, users, monthlySpend, useCase);
    if (!auditResult) {
      console.error("Audit calculation failed");
      setResult(null);
      setAiSummary("Unable to calculate audit results at this time.");
      return;
    }

    setResult(auditResult);
    setAiSummary("");
    setLoadingAI(true);
    setShowLeadForm(true); // 🆕 Show lead form immediately
    setLeadSubmitted(false); // Reset lead form

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditData: {
            teamSize: Number(users),
            useCase: String(useCase)
          },
          results: {
            currentSpend: Number(monthlySpend),
            monthlySavings: Math.max(0, Math.round(Number(auditResult.annualSavings) / 12)),
            actionsList: [String(auditResult.strategy)],
            topOverspendTool: PRICING_DB[toolKey]?.name || "AI Stack",
          },
        }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setAiSummary(data.summary);
    } catch (err) {
      console.error("AI summary failed:", err);
      setAiSummary("Our engine suggests checking your primary software tiers for optimization opportunities.");
    } finally {
      setLoadingAI(false);
    }
  };

  // 🆕 Handle lead form submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || submittingLead || !leadData.email) return;

    setSubmittingLead(true);

    try {
      const payload = {
        email: leadData.email,
        company: leadData.company,
        role: leadData.role,
        teamSize: leadData.teamSize || users.toString(),
        auditData: {
          tool: PRICING_DB[toolKey]?.name || "AI Stack",
          plan: planId,
          monthlySpend,
          users,
          useCase,
          annualSavings: result.annualSavings,
          strategy: result.strategy,
        },
        highValueLead: result.annualSavings >= 500,
        submittedAt: new Date().toISOString(),
        username_verification: leadData.username_verification, // Honeypot
      };

      const response = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

     // ✅ NEW - Shows EXACT error
if (!response.ok) {
  try {
    const errorData = await response.json();
    console.error('🚨 SERVER ERROR:', response.status, errorData);
    throw new Error(`Error ${response.status}: ${errorData.error || 'Unknown'}`);
  } catch {
    console.error('🚨 RAW RESPONSE:', await response.text());
    throw new Error(`Server error ${response.status}`);
  }
}

      const data = await response.json();
      console.log("✅ Lead captured:", data);

      setLeadSubmitted(true);
      setLeadData({ email: "", company: "", role: "", teamSize: "", username_verification: "" });
      
      // Hide form after 3s, show results
      setTimeout(() => {
        setShowLeadForm(false);
      }, 3000);

    } catch (error) {
      console.error("Lead submission failed:", error);
      alert("Failed to send report. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleShareLinkCopy = () => {
    if (!result) return;

    const payloadObj = {
      tool: PRICING_DB[toolKey]?.name || "AI Stack",
      plan: planId,
      bill: monthlySpend,
      seats: users,
      useCase: useCase,
      savings: result.annualSavings,
    };

    const base64Payload = btoa(JSON.stringify(payloadObj));
    const publicShareLink = `${window.location.origin}/share/${encodeURIComponent(base64Payload)}`;

    navigator.clipboard.writeText(publicShareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isLoaded) return null;

  return (
    <main className="p-4 md:p-10 max-w-2xl mx-auto font-sans min-h-screen bg-[#F8FAFC]">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black text-[#0F172A] tracking-tighter italic">EQ AI</h1>
        <p className="text-slate-500 mt-3 font-medium antialiased">
          Defensible AI Infrastructure Audits.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              Tool
            </label>
            <select
              value={toolKey}
              onChange={(e) => setToolKey(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-blue-500"
            >
              {Object.keys(PRICING_DB).map((k) => (
                <option key={k} value={k}>
                  {PRICING_DB[k].name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              Plan
            </label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-blue-500"
            >
              {PRICING_DB[toolKey]?.plans?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              )) || <option>No plans</option>}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              Monthly Bill ($)
            </label>
            <input
              type="number"
              min="0"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Math.max(0, Number(e.target.value)))}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              Seats
            </label>
            <input
              type="number"
              min="1"
              value={users}
              onChange={(e) => setUsers(Math.max(1, Number(e.target.value)))}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
            Primary Use Case
          </label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-blue-500"
          >
            {USE_CASES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAudit}
          className="w-full bg-[#1E293B] text-white p-5 rounded-2xl font-black hover:bg-black transition-all uppercase tracking-widest text-xs shadow-lg"
        >
          Generate Audit
        </button>
      </div>

      {/* 🆕 LEAD CAPTURE FORM - Shows after audit */}
      {showLeadForm && result && !leadSubmitted && (
        <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-[32px] border-2 border-blue-200/50 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/50 mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <span className="font-black text-lg text-slate-900 tracking-tight">
                Audit Complete
              </span>
            </div>
            {result.annualSavings >= 500 ? (
              <>
                <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tighter mb-2">
                  ${result.annualSavings.toLocaleString()}
                </h2>
                <p className="text-xl text-slate-600 font-semibold">
                  Annual savings opportunity detected
                </p>
              </>
            ) : (
              <p className="text-2xl font-black text-slate-900">
                Your audit is ready
              </p>
            )}
          </div>

          <form onSubmit={handleLeadSubmit} className="space-y-4">
            {/* Hidden honeypot */}
            <input
              type="text"
              name="username_verification"
              value={leadData.username_verification}
              onChange={(e) => setLeadData({ ...leadData, username_verification: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="you@company.com"
                  value={leadData.email}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  className="w-full p-4 bg-white/80 border border-slate-200 hover:border-blue-300 focus:border-blue-500 rounded-2xl font-bold backdrop-blur-sm transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder={users.toString()}
                  value={leadData.teamSize}
                  onChange={(e) => setLeadData({ ...leadData, teamSize: e.target.value })}
                  className="w-full p-4 bg-white/80 border border-slate-200 hover:border-blue-300 focus:border-blue-500 rounded-2xl font-bold backdrop-blur-sm transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={leadData.company}
                  onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                  className="w-full p-4 bg-white/80 border border-slate-200 hover:border-blue-300 focus:border-blue-500 rounded-2xl font-bold backdrop-blur-sm transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="Engineering Lead, CTO, etc."
                  value={leadData.role}
                  onChange={(e) => setLeadData({ ...leadData, role: e.target.value })}
                  className="w-full p-4 bg-white/80 border border-slate-200 hover:border-blue-300 focus:border-blue-500 rounded-2xl font-bold backdrop-blur-sm transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingLead || !leadData.email}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-2xl font-black hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl text-sm uppercase tracking-widest"
            >
              {submittingLead ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Report...
                </span>
              ) : result.annualSavings >= 500 ? (
                `Claim $${result.annualSavings.toLocaleString()} Savings + Report`
              ) : (
                "Send My Full Report"
              )}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Report delivered instantly • High-value leads get Credex outreach
            </p>
          </form>
        </div>
      )}

      {/* 🆕 SUCCESS STATE */}
      {leadSubmitted && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-12 rounded-[32px] text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-green-900 mb-4 tracking-tight">
              Report Sent Successfully!
            </h2>
            <p className="text-lg text-green-800 mb-6 leading-relaxed max-w-md mx-auto">
              Check your inbox for the complete audit + optimization playbook. 
              <strong className="block mt-2">
                {result.annualSavings >= 500 
                  ? "Credex team will contact you within 24hrs" 
                  : "We'll notify you of future savings"
                }
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* RESULTS - Only show after lead capture OR if already captured */}
      {result && !showLeadForm && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div
            className={`p-8 rounded-[32px] border-2 ${
              result.annualSavings > 100 ? "border-blue-500 bg-gradient-to-br from-blue-50 bg-white/80" : "border-slate-200 bg-slate-50/50"
            } transition-all backdrop-blur-sm`}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Audit Report</h2>
              <span
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  result.annualSavings > 0 
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200" 
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {result.annualSavings > 0 ? "💰 Savings Found" : "✅ Optimal Stack"}
              </span>
            </div>

            {result.annualSavings > 0 ? (
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Annual Savings Opportunity
                  </p>
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">
                    ${result.annualSavings.toLocaleString()}
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-slate-700 text-sm leading-relaxed italic font-medium bg-slate-50 p-4 rounded-2xl">
                    "{result.strategy}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                  You're Optimized
                </h3>
                <p className="text-xl text-slate-600 font-medium max-w-md mx-auto">
                  Your {result.toolName} configuration is highly efficient for your use case.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              AI Executive Summary
            </h3>
            {loadingAI && (
              <div className="flex items-center space-x-3 text-slate-400 text-sm py-4 animate-pulse">
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing via Anthropic Claude...</span>
              </div>
            )}
            {aiSummary && (
              <p className="text-slate-700 text-sm leading-relaxed font-normal antialiased">
                {aiSummary}
              </p>
            )}
          </div>

          {result.annualSavings >= 500 && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[32px] relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
              <div className="relative z-10">
                <p className="text-blue-300 text-[10px] font-black uppercase tracking-[0.4em] mb-3 bg-blue-900/30 px-3 py-1 rounded-full inline-block">
                  Credex Protocol Active
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                  Unlock ${result.annualSavings.toLocaleString()} Institutional Savings
                </h3>
                <p className="text-slate-300 text-sm mb-8 leading-relaxed opacity-90">
                  High-volume AI teams qualify for wholesale capacity. Stop paying retail pricing for {result.toolName}.
                </p>
                <button className="w-full bg-white/90 text-slate-900 p-5 rounded-2xl font-black hover:bg-white transition-all text-xs uppercase tracking-widest shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5">
                  Activate Credex Alpha
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleShareLinkCopy}
              className={`py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
                copied
                  ? "bg-green-500 border-green-500 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {copied ? "✓ Link Copied!" : "🔗 Copy Share Link"}
            </button>

            <button
              onClick={() => window.print()}
              className="py-4 px-6 bg-white border-2 border-slate-200 rounded-2xl text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              📄 Print Report
            </button>
          </div>
        </div>
      )}
    </main>
  );
}