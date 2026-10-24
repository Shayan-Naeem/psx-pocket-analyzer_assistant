import React from 'react';
import { TriggeredAlertEvent } from '../types';
import { X, Copy, Check, Send, Download, Code, MessageSquare, AlertTriangle, Bell } from 'lucide-react';
import { notificationService } from '../services/notificationService';

interface AlertDetailModalProps {
  alert: TriggeredAlertEvent | null;
  onClose: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, onClose }) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  if (!alert) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(alert.webhookJson, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psx-alert-${alert.symbol}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-600 text-white rounded">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {alert.symbol} Trigger Event
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-600">{alert.stockName}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {alert.timestamp}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Format 1: On-Screen Banner Preview */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-700">1. On-Screen Banner Format</span>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-950 font-mono text-xs">
              {alert.banner}
            </div>
          </div>

          {/* Format 2: WhatsApp / SMS Notification Text */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. WhatsApp / SMS Notification Message</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(alert.whatsappMessage, 'wa')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                >
                  {copiedKey === 'wa' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                  <span>{copiedKey === 'wa' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => {
                    const url = `https://wa.me/?text=${encodeURIComponent(alert.whatsappMessage)}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Send WhatsApp</span>
                </button>
              </div>
            </div>
            <pre className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed">
              {alert.whatsappMessage}
            </pre>
          </div>

          {/* Format 3: Structured Webhook JSON */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-sky-600" />
                <span>3. Structured Webhook JSON Payload</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(JSON.stringify(alert.webhookJson, null, 2), 'json')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                >
                  {copiedKey === 'json' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                  <span>{copiedKey === 'json' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed">
              {JSON.stringify(alert.webhookJson, null, 2)}
            </pre>
          </div>

          {/* Format 4: Native OS Desktop Notification Test */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded">
              <div>
                <span className="font-semibold text-slate-800">4. Native OS Desktop Notification</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fires directly into Windows Action Center / macOS Notification Center.
                </p>
              </div>
              <button
                onClick={() => {
                  notificationService.playAlertChime();
                  notificationService.dispatchNotification(
                    `PSX Alert: ${alert.symbol} Trigger Breached`,
                    `Current: Rs. ${alert.triggerPrice.toFixed(2)} PKR (${alert.sessionChangePercent.toFixed(2)}%). Valuation floor penetrated.`
                  );
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Trigger Popup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
