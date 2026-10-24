import React from 'react';
import { AlertRule, StockQuote, TriggeredAlertEvent, StockSymbol } from '../types';
import {
  Bell,
  Check,
  Copy,
  Download,
  Send,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  ExternalLink,
  Code,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { notificationService } from '../services/notificationService';

interface AlertSimulatorViewProps {
  rules: AlertRule[];
  stocks: StockQuote[];
  triggeredEvents: TriggeredAlertEvent[];
  onToggleRuleStatus: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onOpenCreateRule: () => void;
  onManualTriggerTest: (rule: AlertRule) => void;
  onSelectAlertDetails: (event: TriggeredAlertEvent) => void;
}

export const AlertSimulatorView: React.FC<AlertSimulatorViewProps> = ({
  rules,
  stocks,
  triggeredEvents,
  onToggleRuleStatus,
  onDeleteRule,
  onOpenCreateRule,
  onManualTriggerTest,
  onSelectAlertDetails,
}) => {
  const [activeTab, setActiveTab] = React.useState<'active' | 'history'>('active');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const getStock = (symbol: StockSymbol) => stocks.find((s) => s.symbol === symbol);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadJson = (data: Record<string, any>, filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Rule Engine Controls */}
      <div className="bg-white p-5 rounded border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-display font-bold text-slate-900 tracking-tight">
              Dual-Trigger Price Alert Engine
            </h2>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              Live Monitor Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Evaluates incoming ticks against Absolute Floor thresholds and Session Volatility percentage limits.
            On breach, compiles multi-format payloads for WhatsApp groups, Webhook JSON endpoints, and native OS desktop alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              notificationService.playAlertChime();
              notificationService.dispatchNotification(
                'PSX Alert Test',
                'Native OS notifications are operating normally.'
              );
            }}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors cursor-pointer"
          >
            Test OS Popup
          </button>

          <button
            onClick={onOpenCreateRule}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            + Add New Trigger Rule
          </button>
        </div>
      </div>

      {/* Segmented Controls for Active vs History */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
              activeTab === 'active'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Configured Rules ({rules.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Triggered Events Stream ({triggeredEvents.length})
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Strict Universe: Banks · Oil & Gas · Fertilizers
        </div>
      </div>

      {/* Tab 1: Configured Rules */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => {
            const stock = getStock(rule.symbol);
            if (!stock) return null;

            const currentPrice = stock.currentPrice;
            const isFloor = rule.type === 'ABSOLUTE_FLOOR';
            const distance = isFloor
              ? currentPrice - rule.thresholdValue
              : Math.abs(rule.thresholdValue) - Math.abs(stock.changePercent);

            const isImminent = isFloor
              ? distance > 0 && distance < currentPrice * 0.02
              : distance < 1.0;

            return (
              <div
                key={rule.id}
                className={`bg-white p-4 rounded border transition-all ${
                  rule.status === 'TRIGGERED'
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-900">
                        {rule.symbol}
                      </span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {stock.name}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="font-sans text-slate-500">Trigger Rule:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {isFloor ? (
                          <>Price Floor &lt; Rs. {rule.thresholdValue.toFixed(2)} PKR</>
                        ) : (
                          <>Volatility Breach &ge; {rule.thresholdValue}% Session</>
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                      rule.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-800'
                        : rule.status === 'TRIGGERED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rule.status}
                  </span>
                </div>

                {/* Distance & Status Indicator */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Current Market:</span>{' '}
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      Rs. {currentPrice.toFixed(2)}
                    </span>{' '}
                    <span
                      className={`font-mono text-[11px] ${
                        stock.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-600">
                    {isFloor ? (
                      distance <= 0 ? (
                        <span className="text-rose-700 font-semibold">BREACHED</span>
                      ) : (
                        <span>+{distance.toFixed(2)} PKR buffer</span>
                      )
                    ) : (
                      distance <= 0 ? (
                        <span className="text-rose-700 font-semibold">BREACHED</span>
                      ) : (
                        <span>{distance.toFixed(1)}% to trigger</span>
                      )
                    )}
                  </div>
                </div>

                {rule.note && (
                  <p className="mt-2 text-[11px] text-slate-500 font-sans italic">
                    "{rule.note}"
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onManualTriggerTest(rule)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors cursor-pointer"
                    title="Simulate immediate breach to verify WhatsApp, Webhook, and Banner outputs"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Fire Simulated Breach</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleRuleStatus(rule.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded transition-colors cursor-pointer"
                      title={rule.status === 'ACTIVE' ? 'Pause Rule' : 'Activate Rule'}
                    >
                      {rule.status === 'ACTIVE' ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Triggered Events Stream */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {triggeredEvents.length === 0 ? (
            <div className="bg-white p-8 text-center rounded border border-slate-200 text-slate-500 text-xs">
              <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No price breaches recorded yet</p>
              <p className="mt-1">
                Use the "Fire Simulated Breach" button above or trigger market shocks from the top bar to test live payload generation.
              </p>
            </div>
          ) : (
            triggeredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-5 rounded border border-slate-200 hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-slate-900">
                      {event.symbol}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-medium">
                      {event.stockName}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {event.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Rs. {event.triggerPrice.toFixed(2)} PKR ({event.sessionChangePercent >= 0 ? '+' : ''}{event.sessionChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Triple Payload Output Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                  {/* WhatsApp Formatted Text */}
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp / SMS Notification Text</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(event.whatsappMessage, `wa-${event.id}`)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded cursor-pointer"
                        >
                          {copiedId === `wa-${event.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-[11px] text-slate-700 whitespace-pre-wrap bg-white p-2.5 rounded border border-slate-200/80 leading-relaxed max-h-48 overflow-y-auto">
                        {event.whatsappMessage}
                      </pre>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          const url = `https://wa.me/?text=${encodeURIComponent(event.whatsappMessage)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 text-[11px] font-semibold cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send to WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Webhook JSON Payload */}
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Code className="w-3.5 h-3.5 text-sky-600" />
                          <span>Structured Webhook JSON</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyText(JSON.stringify(event.webhookJson, null, 2), `json-${event.id}`)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded cursor-pointer"
                          >
                            {copiedId === `json-${event.id}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDownloadJson(event.webhookJson, `psx-alert-${event.symbol}-${Date.now()}`)}
                            className="p-1 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded cursor-pointer"
                            title="Download JSON Payload"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <pre className="font-mono text-[11px] text-slate-800 bg-slate-900 text-slate-100 p-2.5 rounded max-h-48 overflow-y-auto leading-relaxed">
                        {JSON.stringify(event.webhookJson, null, 2)}
                      </pre>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-500">
                      RFC-compliant JSON ready for Zapier, Make.com, or Python webhooks.
                    </div>
                  </div>
                </div>

                {/* Gemma Advisory Note */}
                {event.gemmaRationale && (
                  <div className="bg-slate-100/70 p-3 rounded text-xs text-slate-700 border border-slate-200">
                    <span className="font-semibold text-slate-900">Gemma 4 Valuation Note: </span>
                    {event.gemmaRationale}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
