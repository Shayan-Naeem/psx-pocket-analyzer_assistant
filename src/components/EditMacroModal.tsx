import React, { useState } from 'react';
import { MacroIndicators } from '../types';
import { X, Check, Sliders, Lock } from 'lucide-react';

interface EditMacroModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMacro: MacroIndicators;
  onSaveMacro: (updated: MacroIndicators) => void;
}

export const EditMacroModal: React.FC<EditMacroModalProps> = ({
  isOpen,
  onClose,
  currentMacro,
  onSaveMacro,
}) => {
  const [gasTariff, setGasTariff] = useState<string>(String(currentMacro.gasFeedPriceMmbtd));
  const [brentCrude, setBrentCrude] = useState<string>(String(currentMacro.brentCrudeUsd));
  const [pkrUsd, setPkrUsd] = useState<string>(String(currentMacro.pkrToUsd));
  const [sbpRate, setSbpRate] = useState<string>(String(currentMacro.sbpPolicyRate));
  const [kseIndex, setKseIndex] = useState<string>(String(currentMacro.kse100));
  const [kseChange, setKseChange] = useState<string>(String(currentMacro.kse100Change));

  React.useEffect(() => {
    if (isOpen) {
      setGasTariff(String(currentMacro.gasFeedPriceMmbtd));
      setBrentCrude(String(currentMacro.brentCrudeUsd));
      setPkrUsd(String(currentMacro.pkrToUsd));
      setSbpRate(String(currentMacro.sbpPolicyRate));
      setKseIndex(String(currentMacro.kse100));
      setKseChange(String(currentMacro.kse100Change));
    }
  }, [isOpen, currentMacro]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMacro({
      kse100: parseFloat(kseIndex) || currentMacro.kse100,
      kse100Change: parseFloat(kseChange) || currentMacro.kse100Change,
      sbpPolicyRate: parseFloat(sbpRate) || currentMacro.sbpPolicyRate,
      pkrToUsd: parseFloat(pkrUsd) || currentMacro.pkrToUsd,
      brentCrudeUsd: parseFloat(brentCrude) || currentMacro.brentCrudeUsd,
      gasFeedPriceMmbtd: parseFloat(gasTariff) || currentMacro.gasFeedPriceMmbtd,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded border border-slate-200 max-w-md w-full shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-200 rounded text-slate-800">
              <Lock className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-slate-900">
                Set Static Macro Indicators
              </h3>
              <p className="text-[11px] text-slate-500">
                Lock custom static values for gas tariffs, crude oil, and policy rates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Gas Feed Tariff */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="font-semibold text-slate-700">Gas Feed Tariff (Fertilizer)</label>
              <span className="text-[10px] text-slate-400 font-mono">OGRA: Rs. 1,597</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="1"
                value={gasTariff}
                onChange={(e) => setGasTariff(e.target.value)}
                required
                className="w-full p-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="1597"
              />
              <span className="absolute right-3 top-2 text-slate-400 font-mono text-xs">
                Rs./MMBTU
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Official standardized tariff across fertilizer manufacturers is Rs. 1,597/MMBTU.
            </p>
          </div>

          {/* Brent Crude Oil */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="font-semibold text-slate-700">Brent Crude Oil</label>
              <span className="text-[10px] text-slate-400 font-mono">Global benchmark</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={brentCrude}
                onChange={(e) => setBrentCrude(e.target.value)}
                required
                className="w-full p-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="74.20"
              />
              <span className="absolute right-3 top-2 text-slate-400 font-mono text-xs">
                $/bbl
              </span>
            </div>
          </div>

          {/* USD/PKR */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">USD / PKR Exchange Rate</label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                value={pkrUsd}
                onChange={(e) => setPkrUsd(e.target.value)}
                required
                className="w-full p-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="278.60"
              />
              <span className="absolute right-3 top-2 text-slate-400 font-mono text-xs">
                PKR
              </span>
            </div>
          </div>

          {/* SBP Policy Rate */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">SBP Policy Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.25"
                value={sbpRate}
                onChange={(e) => setSbpRate(e.target.value)}
                required
                className="w-full p-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="11.50"
              />
              <span className="absolute right-3 top-2 text-slate-400 font-mono text-xs">
                %
              </span>
            </div>
          </div>

          {/* KSE-100 Index */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">KSE-100 Level</label>
              <input
                type="number"
                step="1"
                value={kseIndex}
                onChange={(e) => setKseIndex(e.target.value)}
                className="w-full p-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="162374"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Session Change</label>
              <input
                type="number"
                step="0.1"
                value={kseChange}
                onChange={(e) => setKseChange(e.target.value)}
                className="w-full p-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="-1549.4"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-white bg-slate-900 hover:bg-slate-800 rounded font-semibold cursor-pointer shadow-xs"
            >
              Save & Lock Static
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
