import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Key, 
  RefreshCw, 
  Server, 
  Zap,
  ShieldCheck
} from 'lucide-react';

export const ResellerApiModal: React.FC = () => {
  const [apiKey, setApiKey] = useState('kt_live_9a72b8d410f92ce388b17a6');
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeLang, setActiveLang] = useState<'curl' | 'python' | 'node'>('curl');

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `kt_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    setApiKey(newKey);
  };

  const codeSnippets = {
    curl: `curl -X POST https://api.kentechlikes.com/v2 \\
  -d "key=${apiKey}" \\
  -d "action=add" \\
  -d "service=TT-101" \\
  -d "link=https://www.tiktok.com/@nairobi_trends" \\
  -d "quantity=1000"`,
    python: `import requests

url = "https://api.kentechlikes.com/v2"
payload = {
    "key": "${apiKey}",
    "action": "add",
    "service": "TT-101",
    "link": "https://www.tiktok.com/@nairobi_trends",
    "quantity": 1000
}

response = requests.post(url, data=payload)
print(response.json())
# Returns: {"order": "KT-98124", "status": "success", "charge": 110}`,
    node: `import axios from 'axios';

const { data } = await axios.post('https://api.kentechlikes.com/v2', {
  key: '${apiKey}',
  action: 'add',
  service: 'TT-101',
  link: 'https://www.tiktok.com/@nairobi_trends',
  quantity: 1000
});

console.log(data); // { order: "KT-98124", status: "success" }`
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Standard SMM v2 Specification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Developer & Reseller REST API
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Connect your own SMM panel (SmartStore, PerfectPanel, custom apps) and resell KEN_TECH LIKES services with automatic fulfillment.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono text-emerald-400">HTTP 200 &bull; 99.98% SLA</span>
          </div>
        </div>

        {/* API Credentials Box */}
        <div className="mt-6 rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Your Secret API Key</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRegenerateKey}
                className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-[#090D16] border border-slate-700/80 rounded-xl px-3 py-2">
            <span className="font-mono text-xs text-emerald-300 flex-1 truncate">
              {apiKey}
            </span>
            <button
              onClick={handleCopyKey}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>API Endpoint: <strong className="font-mono text-white">https://api.kentechlikes.com/v2</strong></span>
            <span>Response Type: <strong className="font-mono text-white">application/json</strong></span>
          </div>
        </div>

        {/* Code Snippets Tabs */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Example Code: Place New Order
            </span>
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {(['curl', 'python', 'node'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    activeLang === lang ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl bg-[#090D16] border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
            <pre className="text-emerald-400/90 whitespace-pre leading-relaxed">
              {codeSnippets[activeLang]}
            </pre>
          </div>
        </div>

        {/* API Endpoints Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="font-mono font-bold text-emerald-400 block mb-1">action=services</span>
            <p className="text-slate-400 text-[11px]">Returns full array of active service IDs, rates, min/max limits, and refill types.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="font-mono font-bold text-emerald-400 block mb-1">action=status</span>
            <p className="text-slate-400 text-[11px]">Pass order ID to receive real-time charge, start count, remains, and completion status.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="font-mono font-bold text-emerald-400 block mb-1">action=balance</span>
            <p className="text-slate-400 text-[11px]">Returns your current KEN_TECH LIKES wallet balance in KES and default currency.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
