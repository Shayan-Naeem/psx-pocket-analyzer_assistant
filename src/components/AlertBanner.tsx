import React from 'react';
import { TriggeredAlertEvent } from '../types';
import { AlertTriangle, Check, Copy, ExternalLink, X, Send } from 'lucide-react';

interface AlertBannerProps {
  alerts: TriggeredAlertEvent[];
  onDismiss: (alertId: string) => void;
  onOpenAlertDetails: (alert: TriggeredAlertEvent) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts,
  onDismiss,
  onOpenAlertDetails,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (alerts.length === 0) return null;

  const currentAlert = alerts[0]; // Show the most recent breach

  const handleCopyWhatsApp = (alert: TriggeredAlertEvent) => {
    navigator.clipboard.writeText(alert.whatsappMessage);
    setCopiedId(alert.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenWhatsAppWeb = (alert: TriggeredAlertEvent) => {
    const encoded = encodeURIComponent(alert.whatsappMessage);
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 sm:px-6 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Breach Alert Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-1.5 bg-rose-600 text-white rounded shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
            <span className="font-mono font-bold text-rose-950 text-sm">
              {currentAlert.symbol} Trigger Breached
            </span>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-slate-800">
              {currentAlert.triggerType === 'VOLATILITY_PERCENT' ? (
                <>Volatility hit <strong className="font-mono tabular-nums">{currentAlert.thresholdValue}%</strong></>
              ) : (
                <>Floor pierced below <strong className="font-mono tabular-nums">Rs. {currentAlert.thresholdValue.toFixed(2)} PKR</strong></>
              )}
            </span>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-slate-700">
              Current: <strong className="font-mono tabular-nums text-rose-700">Rs. {currentAlert.triggerPrice.toFixed(2)}</strong> ({currentAlert.sessionChangePercent >= 0 ? '+' : ''}{currentAlert.sessionChangePercent.toFixed(2)}%)
            </span>

            {alerts.length > 1 && (
              <span className="text-xs text-rose-700 font-medium ml-1">
                (+{alerts.length - 1} more alert{alerts.length > 2 ? 's' : ''})
              </span>
            )}
          </div>
        </div>

        {/* Right: Quick actions for WhatsApp & Webhook */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => handleCopyWhatsApp(currentAlert)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-2xs transition-colors cursor-pointer"
            title="Copy pre-formatted WhatsApp text to clipboard"
          >
            {copiedId === currentAlert.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleOpenWhatsAppWeb(currentAlert)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded transition-colors cursor-pointer"
            title="Share directly via WhatsApp"
          >
            <Send className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={() => onOpenAlertDetails(currentAlert)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span>Payloads</span>
          </button>

          <button
            onClick={() => onDismiss(currentAlert.id)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
