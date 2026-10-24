import React from 'react';
import { MacroIndicators } from '../types';
import { PresetScenario } from '../services/marketSimulator';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Edit3, Calendar } from 'lucide-react';

interface MarketMetricsStripProps {
  macro: MacroIndicators;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  onApplyPreset: (preset: PresetScenario) => void;
  activeAlertCount: number;
  onOpenEditMacro: () => void;
  onResetToOfficialClose: () => void;
}

export const MarketMetricsStrip: React.FC<MarketMetricsStripProps> = ({
  macro,
  isSimulating,
  setIsSimulating,
  onApplyPreset,
  activeAlertCount,
  onOpenEditMacro,
  onResetToOfficialClose,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Real-time Macro Strip (Tabular Figures) */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            {/* Market Closed Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[11px]">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>PSX: Closed (Weekend)</span>
            </div>

            {/* KSE-100 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">KSE-100:</span>
              <span className="font-mono font-semibold tabular-nums text-white">
                {macro.kse100.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`font-mono text-[11px] font-medium flex items-center ${
                  macro.kse100Change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {macro.kse100Change >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {macro.kse100Change >= 0 ? '+' : ''}
                {macro.kse100Change.toFixed(2)}
              </span>
            </div>

            <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>

            {/* SBP Policy Rate */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">SBP Rate:</span>
              <span className="font-mono font-semibold tabular-nums text-amber-300">
                {macro.sbpPolicyRate.toFixed(2)}%
              </span>
            </div>

            <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>

            {/* USD / PKR */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">USD/PKR:</span>
              <span className="font-mono font-semibold tabular-nums text-slate-200">
                Rs. {macro.pkrToUsd.toFixed(2)}
              </span>
            </div>

            <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>

            {/* Brent Crude */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">Brent Crude:</span>
              <span className="font-mono font-semibold tabular-nums text-sky-300">
                ${macro.brentCrudeUsd.toFixed(2)}/bbl
              </span>
            </div>

            <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>

            {/* Gas Feed Tariff */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">Gas Tariff:</span>
              <span className="font-mono font-semibold tabular-nums text-slate-200">
                Rs. {macro.gasFeedPriceMmbtd}/MMBTU
              </span>
            </div>

            {/* Edit Macro Button */}
            <button
              onClick={onOpenEditMacro}
              title="Edit and lock static values for gas tariff, crude oil, USD, and SBP rate"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-slate-400" />
              <span>Edit Static</span>
            </button>
          </div>

          {/* Simulator & Presets Control Strip */}
          <div className="flex items-center flex-wrap gap-2 pt-1 lg:pt-0 border-t border-slate-800 lg:border-t-0">
            {/* Live Tick Simulator Toggle */}
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                isSimulating
                  ? 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
              title={isSimulating ? 'Pause tick simulation' : 'Simulate market ticks for alert testing'}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3 h-3 text-amber-400" />
                  <span>Simulation Active</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-slate-400" />
                  <span>Prices Static (Closed)</span>
                </>
              )}
            </button>

            {/* Macro Shock Presets Dropdown/Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onApplyPreset('FLASH_CRASH')}
                title="Test sudden broad-market drop to trigger price floor alerts"
                className="px-2 py-1 text-[11px] font-mono text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-900/60 rounded cursor-pointer transition-colors"
              >
                Test: Drop
              </button>

              <button
                onClick={() => onApplyPreset('CRUDE_SURGE')}
                title="Test crude rally on E&P stocks"
                className="px-2 py-1 text-[11px] font-mono text-sky-300 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-900/60 rounded cursor-pointer transition-colors"
              >
                Test: Crude
              </button>

              <button
                onClick={onResetToOfficialClose}
                title="Reset all 12 stock prices and KSE-100 to official market closing values"
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reset to Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
