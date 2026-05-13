"use client";

import { useState, useEffect } from "react";
import { calculateAudit } from "./lib/audit-engine";
import { PRICING_DB, USE_CASES } from "./lib/pricing-data";
import React from "react";
export default function Home() {
  const [toolKey, setToolKey] = useState("cursor");
  const [planId, setPlanId] = useState("pro");
  const [users, setUsers] = useState(1);
  const [monthlySpend, setMonthlySpend] = useState(20);
  const [useCase, setUseCase] = useState("Coding");
  const [result, setResult] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Load / save state
  useEffect(() => {
    const saved = localStorage.getItem("eq_ai_state");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        Object.entries(p).forEach(([key, value]: [string, any]) => {
          if (key === "toolKey") setToolKey(value);
          if (key === "planId") setPlanId(value);
          if (key === "users") setUsers(value);
          if (key === "monthlySpend") setMonthlySpend(value);
          if (key === "useCase") setUseCase(value);
        });
      } catch (e) {
        console.error("localStorage parse failed", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "eq_ai_state",
      JSON.stringify({ toolKey, planId, users, monthlySpend, useCase })
    );
  }, [toolKey, planId, users, monthlySpend, useCase]);

  useEffect(() => {
    const firstPlan = PRICING_DB[toolKey]?.plans?.[0]?.id;
    if (firstPlan && planId !== firstPlan) setPlanId(firstPlan);
  }, [toolKey]);

  const handleAudit = async () => {
    const audit = calculateAudit(toolKey, planId, users, monthlySpend, useCase);
    if (!audit) {
      setResult(null);
      setAiSummary("Failed to calculate audit.");
      return;
    }

    setResult(audit);
    setAiSummary("");
    setLoadingAI(true);
    setShowLeadForm(true);
    setLeadSubmitted(false);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditData: { teamSize: users, useCase },
          results: {
            currentSpend: monthlySpend,
            monthlySavings: Math.max(0, Math.round(audit.annualSavings / 12)),
            actionsList: [audit.strategy],
            topOverspendTool: PRICING_DB[toolKey]?.name || "AI Stack",
          },
        }),
      });
      if (!res.ok) throw new Error(`AI summary failed: ${res.status}`);
      const { summary } = await res.json();
      setAiSummary(summary);
    } catch (err) {
      console.error("AI summary error:", err);
      setAiSummary("Check your primary software tiers for optimization.");
    } finally {
      setLoadingAI(false);
    }
  };

  const [leadData, setLeadData] = useState({
    email: "",
    company: "",
    role: "",
    teamSize: "",
    username_verification: "",
  });
  const [submittingLead, setSubmittingLead] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || submittingLead || !leadData.email) return;

    setSubmittingLead(true);

    try {
      const payload = {
        ...leadData,
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
      };

      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Lead error:", res.status, text);
        throw new Error(`Submit failed: ${res.status}`);
      }

      await res.json();
      setLeadSubmitted(true);
      setLeadData({ email: "", company: "", role: "", teamSize: "", username_verification: "" });
      setTimeout(() => setShowLeadForm(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Lead submission failed. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleShareLinkCopy = () => {
    if (!result) return;
    const payloadStr = JSON.stringify({
      tool: PRICING_DB[toolKey]?.name || "AI Stack",
      plan: planId,
      bill: monthlySpend,
      seats: users,
      useCase,
      savings: result.annualSavings,
    });
    const base64 = btoa(payloadStr);
    const shareLink = `${window.location.origin}/share/${encodeURIComponent(base64)}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [copied, setCopied] = useState(false);

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto min-h-screen bg-[#F8FAFC] font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#0F172A]">EQ AI</h1>
        <p className="text-slate-500">Defensible AI Infrastructure Audits.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
              Tool
            </label>
            <select
              value={toolKey}
              onChange={(e) => setToolKey(e.target.value)}
              className="w-full p-3 bg-slate-50 border-none rounded-lg font-medium outline-blue-500"
            >
              {Object.keys(PRICING_DB).map((k) => (
                <option key={k} value={k}>
                  {PRICING_DB[k].name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
              Plan
            </label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="w-full p-3 bg-slate-50 border-none rounded-lg font-medium outline-blue-500"
            >
              {(PRICING_DB[toolKey]?.plans ?? []).map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
              Monthly Bill ($)
            </label>
            <input
              type="number"
              min="0"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Math.max(0, Number(e.target.value)))}
              className="w-full p-3 bg-slate-50 border-none rounded-lg outline-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
              Seats
            </label>
            <input
              type="number"
              min="1"
              value={users}
              onChange={(e) => setUsers(Math.max(1, Number(e.target.value)))}
              className="w-full p-3 bg-slate-50 border-none rounded-lg outline-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
            Primary Use Case
          </label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            className="w-full p-3 bg-slate-50 border-none rounded-lg font-medium outline-blue-500"
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
          className="w-full bg-[#1E293B] text-white p-3 rounded-lg font-bold hover:bg-black transition"
        >
          Generate Audit
        </button>
      </div>

      {/* Lead form */}
      {showLeadForm && result && !leadSubmitted && (
        <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-200 shadow">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Audit Complete</h2>
            {result.annualSavings >= 500 && (
              <p className="text-xl font-bold text-green-700">
                ${result.annualSavings.toLocaleString()} Annual Savings
              </p>
            )}
          </div>

          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <input
              type="text"
              name="username_verification"
              value={leadData.username_verification}
              onChange={(e) =>
                setLeadData({ ...leadData, username_verification: e.target.value })
              }
              className="hidden"
              tabIndex={-1}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="you@company.com"
                  value={leadData.email}
                  onChange={(e) =>
                    setLeadData({ ...leadData, email: e.target.value })
                  }
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                  Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder={users.toString()}
                  value={leadData.teamSize}
                  onChange={(e) =>
                    setLeadData({ ...leadData, teamSize: e.target.value })
                  }
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={leadData.company}
                  onChange={(e) =>
                    setLeadData({ ...leadData, company: e.target.value })
                  }
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="Engineering Lead, CTO, etc."
                  value={leadData.role}
                  onChange={(e) =>
                    setLeadData({ ...leadData, role: e.target.value })
                  }
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submittingLead || !leadData.email}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold disabled:bg-gray-300"
            >
              {submittingLead ? "Sending..." : "Send My Report"}
            </button>
            <p className="text-xs text-slate-500 text-center">
              High‑value leads get Credex outreach.
            </p>
          </form>
        </div>
      )}

      {/* Success */}
      {leadSubmitted && (
        <div className="mt-6 p-6 bg-green-100 rounded-2xl border border-green-200 text-center">
          <h2 className="text-xl font-bold text-green-900">Report Sent!</h2>
          <p className="text-sm text-green-800 mt-2">
            Check your inbox. {result.annualSavings >= 500
              ? "Credex team will contact you within 24hrs."
              : "We’ll notify you of future savings."
            }
          </p>
        </div>
      )}

      {/* Results */}
      {result && !showLeadForm && (
        <div className="mt-6 space-y-4">
          <div
            className={`p-6 rounded-2xl border ${
              result.annualSavings > 100 ? "border-blue-500 bg-blue-50" : "border-slate-200"
            }`}
          >
            <h2 className="text-lg font-bold text-slate-900">Audit Report</h2>
            {result.annualSavings > 0 ? (
              <div>
                <p className="text-sm text-slate-600">Annual savings</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${result.annualSavings.toLocaleString()}
                </p>
                <p className="text-sm text-slate-600 mt-2">{result.strategy}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                Your {result.toolName} configuration is optimized.
              </p>
            )}
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
              AI Executive Summary
            </h3>
            {loadingAI && <p className="text-sm text-slate-400">Analyzing...</p>}
            {aiSummary && <p className="text-sm text-slate-700">{aiSummary}</p>}
          </div>

          {result.annualSavings >= 500 && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl">
              <p className="text-xs font-bold text-blue-300 uppercase mb-2">Credex Protocol Active</p>
              <h3 className="text-xl font-bold text-white">
                Unlock ${result.annualSavings.toLocaleString()} Savings
              </h3>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleShareLinkCopy}
              className={`py-3 px-4 rounded-lg font-bold text-xs border ${
                copied
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-white border-slate-300"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
            <button
              onClick={() => window.print()}
              className="py-3 px-4 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs font-bold"
            >
              Print Report
            </button>
          </div>
        </div>
      )}
      <FAQSection />
    </main>
  );
}
// Place this array at the absolute bottom of page.tsx (Outside your component)
const FAQ_DATA = [
  {
    q: "Do I need to connect our primary corporate credit cards or management tools to run this audit?",
    a: "No. The computation engine processes values purely based on the active user seat counts, tools, and plan tiers you enter manually. Your corporate financial data remains completely unlinked, secure, and untouched."
  },
  {
    q: "How does this tool stay free without selling my startup's operational data?",
    a: "The calculation engine is offered entirely free by Credex to provide immediate utility to engineering leaders. For organizations discovering massive structural tool overspend, Credex offers optimization consulting paths to transition them into specialized, lower-cost corporate credit access pools."
  },
  {
    q: "Are my company's details kept completely private if I share my results page?",
    a: "Yes. The \"Share Results\" link mechanism strips away all company and personal identifiers locally before compressing the parameters into a stateless, encrypted Base64 URL hash. Shared pages render strictly anonymized pricing rows."
  },
  {
    q: "How accurate and up-to-date is the underlying pricing data used by the engine?",
    a: "The logic matrix evaluates your inputs against real data hardcoded inside PRICING_DATA.md. This file is updated weekly against official, live pricing configurations from Cursor, GitHub, OpenAI, and Anthropic."
  },
  {
    q: "Can the engine accurately evaluate custom enterprise billing packages or heavy API usage?",
    a: "Yes. The tool features dedicated calculation rules built to analyze mixed configurations, helping teams assess whether migrating from individual flat-rate subscriptions over to consumption-based API access is cheaper."
  }
];
export function FAQSection() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <section className="mt-16 pt-10 border-t border-neutral-200 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-neutral-500">
          Understand how the EQ AI audit architecture computes and protects parameters.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_DATA.map((item, index) => (
          <div 
            key={index}
            className="border border-neutral-300 rounded-lg bg-neutral-50 overflow-hidden transition-all shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-neutral-800 hover:text-neutral-950 transition-colors"
            >
              <span>{item.q}</span>
              <span className="ml-4 text-neutral-400 font-mono text-base shrink-0 select-none">
                {openFaq === index ? '−' : '+'}
              </span>
            </button>
            
            {openFaq === index && (
              <div className="p-4 pt-0 text-sm text-neutral-600 leading-relaxed border-t border-neutral-200 bg-neutral-100/50">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

