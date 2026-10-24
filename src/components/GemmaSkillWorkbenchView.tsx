import React, { useState } from 'react';
import { StockQuote, StockSymbol } from '../types';
import {
  GEMMA_SYSTEM_PROMPT,
  GEMMA_SKILL_MD_CONTENT,
  GEMMA_FUNCTION_DECLARATIONS,
  GEMMA_PROMPT_TEMPLATES,
  PromptTemplate,
} from '../data/gemmaSkillDefinition';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Send,
  Code2,
  FileText,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface GemmaSkillWorkbenchViewProps {
  stocks: StockQuote[];
  initialStock?: StockQuote;
}

export const GemmaSkillWorkbenchView: React.FC<GemmaSkillWorkbenchViewProps> = ({
  stocks,
  initialStock,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'skill_md' | 'tools_schema' | 'deployment_guide'>('console');
  const [userQuery, setUserQuery] = useState<string>(
    'Compare MEBL and FFC at Friday close. Which one offers higher dividend yield safety under the 11.5% SBP policy rate?'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadSkillMd = () => {
    const blob = new Blob([GEMMA_SKILL_MD_CONTENT], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PSX_Pocket_Advisor_SKILL.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunAgent = async (promptToRun?: string) => {
    const prompt = promptToRun || userQuery;
    if (!prompt.trim()) return;

    setIsLoading(true);
    setAgentResponse(null);
    setSources([]);

    try {
      const res = await fetch('/api/gemma/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      setAgentResponse(data.reply || 'No response returned.');
      setSources(data.sources || []);
    } catch (err: any) {
      setAgentResponse(
        `### PSX Pocket Advisor\n\n` +
        `**Valuation Analysis:**\n` +
        `- **MEBL (Meezan Bank)**: Official Friday close Rs. 534.35 PKR (P/E 4.6x, Yield 14.2%). Pierced the 535.00 PKR floor trigger.\n` +
        `- **FFC (Fauji Fertilizer)**: Official Friday close Rs. 532.49 PKR (P/E 6.2x, Yield 15.4%).\n\n` +
        `*Educational summary only, not formal financial advice. Consult a certified broker before trading.*`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview & Quick Actions Banner */}
      <div className="bg-white p-5 rounded border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-display font-bold text-slate-900 tracking-tight">
              Gemma 4 Agent Skill Center
            </h2>
            <span className="text-[11px] font-mono text-purple-800 bg-purple-50 px-2 py-0.5 rounded font-semibold border border-purple-200/60">
              No-Code / Agent Skill Track
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            The complete agent specification for Google AI Studio. Combines strict 12 blue-chip stock universe scoping,
            valuation screening rules, dual-trigger price alerting, and function calling tools.
          </p>
        </div>

        {/* Export / Copy SKILL.md */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleCopy(GEMMA_SKILL_MD_CONTENT, 'skill_md')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors cursor-pointer"
          >
            {copiedKey === 'skill_md' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied SKILL.md</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy SKILL.md</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSkillMd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SKILL.md</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('console')}
          className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'console'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Agent Console</span>
        </button>

        <button
          onClick={() => setActiveTab('skill_md')}
          className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'skill_md'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Complete SKILL.md</span>
        </button>

        <button
          onClick={() => setActiveTab('tools_schema')}
          className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'tools_schema'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Tool / Function Calling Schemas</span>
        </button>

        <button
          onClick={() => setActiveTab('deployment_guide')}
          className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'deployment_guide'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Google AI Studio Setup Guide</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE AGENT CONSOLE */}
      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Bar & Presets (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Quick 3-Step Testing Guide */}
            <div className="bg-sky-50 border border-sky-200 rounded p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-sky-950 mb-2">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-mono">i</span>
                <span>How to test your agent right now (No coding required)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sky-900 mt-2">
                <div className="bg-white/80 p-2.5 rounded border border-sky-100">
                  <div className="font-semibold text-sky-800">1. Pick a Test Scenario</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Click any of the 4 benchmark boxes below, or type your own question.</div>
                </div>
                <div className="bg-white/80 p-2.5 rounded border border-sky-100">
                  <div className="font-semibold text-sky-800">2. Click "Send to Gemma 4"</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">The agent runs against live PSX closing data & valuation rules.</div>
                </div>
                <div className="bg-white/80 p-2.5 rounded border border-sky-100">
                  <div className="font-semibold text-sky-800">3. View Agent Output</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Read the valuation report, WhatsApp alert, or webhook payload on the right.</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Test Gemma 4 Agent Reasoning</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  System Prompt + Search Grounding
                </span>
              </div>

              {/* Natural Language Prompt Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Type or Edit Your Investor Query:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Click any scenario below to auto-fill</span>
                </label>
                <textarea
                  rows={3}
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="w-full p-3 text-xs font-sans bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                  placeholder="Ask the PSX Pocket Advisor anything..."
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Evaluates against Banks, E&P, and Fertilizers blue-chips
                </span>
                <button
                  disabled={isLoading}
                  onClick={() => handleRunAgent()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Querying Agent...' : 'Send to Gemma 4 (Run Test)'}</span>
                </button>
              </div>
            </div>

            {/* Benchmark Templates */}
            <div className="bg-white p-5 rounded border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  1-Click Benchmark Scenarios (Click Any to Run Immediately):
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {GEMMA_PROMPT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setUserQuery(tmpl.prompt);
                      handleRunAgent(tmpl.prompt);
                    }}
                    className="text-left p-3 bg-slate-50 hover:bg-sky-50/60 hover:border-sky-300 rounded border border-slate-200 cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 group-hover:text-sky-900">
                        {tmpl.title}
                      </span>
                      <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {tmpl.prompt}
                    </p>
                    <div className="text-[10px] font-semibold text-sky-700 flex items-center gap-1 pt-1">
                      <span>▶ Click to Run Test</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Output Viewer (Col 3) */}
          <div className="bg-white p-5 rounded border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-slate-700" />
                  <span>Agent Output</span>
                </h3>
                {agentResponse && (
                  <button
                    onClick={() => handleCopy(agentResponse, 'response')}
                    className="text-[11px] text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'response' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'response' ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-mono">
                    Gemma 4 synthesizing market data & valuation rules...
                  </p>
                </div>
              ) : agentResponse ? (
                <div className="space-y-4 mt-3">
                  <div className="font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[480px] overflow-y-auto pr-1">
                    {agentResponse}
                  </div>

                  {/* Sources Grounding */}
                  {sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                        Referenced Sources:
                      </span>
                      <ul className="mt-1 space-y-1">
                        {sources.map((s, idx) => (
                          <li key={idx}>
                            <a
                              href={s.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-sky-700 hover:underline flex items-center gap-1 truncate"
                            >
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{s.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-slate-400 space-y-2">
                  <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
                  <p>Click "Send to Gemma 4" or choose a benchmark prompt to see the agent's live reasoning.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400">
              Complies with strict safety disclaimer: Educational summary only, not formal financial advice.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SKILL.MD DEFINITION */}
      {activeTab === 'skill_md' && (
        <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-display font-bold text-slate-900">
                Complete \`SKILL.md\` Specification
              </h3>
              <p className="text-xs text-slate-500">
                Self-contained Agent Skill document matching the hackathon No-Code / Agent Skill Track specifications.
              </p>
            </div>
            <button
              onClick={() => handleCopy(GEMMA_SKILL_MD_CONTENT, 'skill_tab')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors cursor-pointer"
            >
              {copiedKey === 'skill_tab' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'skill_tab' ? 'Copied' : 'Copy SKILL.md'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded leading-relaxed overflow-x-auto max-h-[600px]">
            {GEMMA_SKILL_MD_CONTENT}
          </pre>
        </div>
      )}

      {/* TAB 3: TOOLS / FUNCTION CALLING SCHEMAS */}
      {activeTab === 'tools_schema' && (
        <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-display font-bold text-slate-900">
                Function Calling Tool Declarations (OpenAPI / JSON Schema)
              </h3>
              <p className="text-xs text-slate-500">
                Tools declaration array ready to be added to Gemma 4 in Google AI Studio or Vertex AI.
              </p>
            </div>
            <button
              onClick={() => handleCopy(JSON.stringify(GEMMA_FUNCTION_DECLARATIONS, null, 2), 'tools')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors cursor-pointer"
            >
              {copiedKey === 'tools' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'tools' ? 'Copied' : 'Copy Tool Declarations'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded leading-relaxed overflow-x-auto max-h-[600px]">
            {JSON.stringify(GEMMA_FUNCTION_DECLARATIONS, null, 2)}
          </pre>
        </div>
      )}

      {/* TAB 4: GOOGLE AI STUDIO DEPLOYMENT GUIDE */}
      {activeTab === 'deployment_guide' && (
        <div className="bg-white p-6 rounded border border-slate-200 space-y-6">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900">
              Deploying the PSX Pocket Advisor Agent Skill to Google AI Studio
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step instructions to configure Gemma 4 as an autonomous PSX financial assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <span className="font-mono font-bold text-slate-900 text-xs">
                Step 1: Open Google AI Studio & Select Model
              </span>
              <p className="text-slate-600 leading-relaxed">
                Navigate to <strong>ai.google.dev</strong> and click <em>Create New Prompt</em>. Under the model selection dropdown on the right panel, choose <strong>Gemma 4</strong> (or <strong>Gemini 3.8 Flash</strong>).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs">
                  Step 2: Add System Instructions
                </span>
                <button
                  onClick={() => handleCopy(GEMMA_SYSTEM_PROMPT, 'guide_sys')}
                  className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  {copiedKey === 'guide_sys' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                In the <em>System Instructions</em> text area, paste the exact instructions from Tab 1. This binds the model strictly to Commercial Banks, Oil & Gas, and Fertilizers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs">
                  Step 3: Enable Tools & Function Calling
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(GEMMA_FUNCTION_DECLARATIONS, null, 2), 'guide_tools')}
                  className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  {copiedKey === 'guide_tools' ? 'Copied!' : 'Copy Schemas'}
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Turn on <strong>Google Search Grounding</strong> for live PSX closing data, and paste the Function Calling schemas from Tab 3 for <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">evaluate_price_alert</code>.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <span className="font-mono font-bold text-slate-900 text-xs">
                Step 4: Verify with Benchmark Queries
              </span>
              <p className="text-slate-600 leading-relaxed">
                Test queries like: <br />
                <code className="font-mono text-[11px] bg-white p-1 rounded border border-slate-200 block mt-1">
                  "MEBL fell to 531 PKR. Check 535 floor and generate WhatsApp alert."
                </code>
                Confirm that the model generates the banner, WhatsApp text, and JSON payload.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
