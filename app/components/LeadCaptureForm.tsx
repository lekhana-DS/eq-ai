'use client';

import React, { useState } from 'react';

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    role: '',
    teamSize: '',
    username_verification: '', // Honeypot field trap string
  });
  
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Processing audit submission pipeline...' });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server processing error occurred.');
      }

      setStatus({
        type: 'success',
        message: 'Audit verification email dispatched successfully. Check your inbox.',
      });
      
      // Reset visible form parameters
      setFormData({
        email: '',
        companyName: '',
        role: '',
        teamSize: '',
        username_verification: '',
      });
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to submit lead data.',
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-6 shadow-xl">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold tracking-tight">Save Your Infrastructure Audit</h3>
        <p className="text-xs text-slate-400 mt-1">
          Lock in your cost baseline profile configuration and receive your optimization brief via email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Anti-Bot Abuse Honeypot Protection Input Field (Visually Hidden) */}
        <div 
          aria-hidden="true"
          style={{ position: 'absolute', opacity: 0, zIndex: -1, pointerEvents: 'none' }}
        >
          <label htmlFor="username_verification">Leave this field blank</label>
          <input
            id="username_verification"
            type="text"
            name="username_verification"
            value={formData.username_verification}
            onChange={handleChange}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        {/* Email Capture input */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Company Name Capture Input */}
        <div>
          <label htmlFor="companyName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Acme Corp"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Professional Role Capture Input */}
        <div>
          <label htmlFor="role" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Your Role
          </label>
          <input
            id="role"
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Engineering Lead / CTO"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Team Size Dropdown Input Selection */}
        <div>
          <label htmlFor="teamSize" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Team Size
          </label>
          <select
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="" className="text-slate-600">Select company size...</option>
            <option value="1">1 - 5 members</option>
            <option value="6">6 - 20 members</option>
            <option value="21">21 - 50 members</option>
            <option value="51">51+ members (High Savings Priority)</option>
          </select>
        </div>

        {/* Submit Execution Action Button */}
        <button
          type="submit"
          disabled={status.type === 'loading'}
          className={`w-full mt-2 font-medium text-sm text-white p-2.5 rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
            status.type === 'loading'
              ? 'bg-blue-600/50 cursor-not-allowed text-slate-300'
              : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98]'
          }`}
        >
          {status.type === 'loading' ? 'Processing Pipeline...' : 'Generate Full Report'}
        </button>

        {/* Operational Flow Real-time Feedback Alerts */}
        {status.type !== 'idle' && (
          <div
            className={`mt-4 p-3 rounded-lg border text-xs leading-relaxed text-center font-medium ${
              status.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : status.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}
