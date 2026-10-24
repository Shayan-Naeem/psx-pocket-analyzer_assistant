import React from 'react';
import { MacroIndicators, StockQuote } from '../types';
import { Sliders, TrendingUp, TrendingDown, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

interface MacroInsightsViewProps {
  macro: MacroIndicators;
  stocks: StockQuote[];
}

export const MacroInsightsView: React.FC<MacroInsightsViewProps> = ({ macro, stocks }) => {
  const [simulatedRate, setSimulatedRate] = React.useState<number>(macro.sbpPolicyRate);
  const [simulatedUSD, setSimulatedUSD] = React.useState<number>(macro.pkrToUsd);
  const [simulatedCrude, setSimulatedCrude] = React.useState<number>(macro.brentCrudeUsd);
  const [simulatedGasTariff, setSimulatedGasTariff] = React.useState<number>(macro.gasFeedPriceMmbtd);

  React.useEffect(() => {
    setSimulatedRate(macro.sbpPolicyRate);
    setSimulatedUSD(macro.pkrToUsd);
    setSimulatedCrude(macro.brentCrudeUsd);
    setSimulatedGasTariff(macro.gasFeedPriceMmbtd);
  }, [macro]);

  // Compute macro sensitivities
  const rateDelta = simulatedRate - macro.sbpPolicyRate;
  const crudeDelta = simulatedCrude - macro.brentCrudeUsd;
  const usdDelta = simulatedUSD - macro.pkrToUsd;
  const gasDelta = simulatedGasTariff - macro.gasFeedPriceMmbtd;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-white p-5 rounded border border-slate-200">
        <h2 className="text-base font-display font-bold text-slate-900 tracking-tight">
          Pakistani Macro Drivers & Sector Sensitivity Matrix
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          The Pakistan Stock Exchange is uniquely driven by sovereign policy cycles, indigenous gas allocations,
          and currency peg dynamics. Below is the structural transmission model for Commercial Banks, Oil & Gas, and Fertilizers.
        </p>

        {/* 3 Core Transmission Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Channel 1: Commercial Banks */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900">
                1. Monetary Policy & SBP Rate
              </span>
              <span className="text-[10px] font-mono text-slate-600 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                Banks Focus
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>High Interest Rates</strong> expand bank Net Interest Margins (NIMs) via float on current deposits.
              Rate easing cycles spur private sector credit demand and equity valuation re-rating.
            </p>
            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Top Exposures:</span> MEBL, FABL, HBL, UBL, MCB
            </div>
          </div>

          {/* Channel 2: Oil & Gas Exploration */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900">
                2. PKR/USD & Brent Crude
              </span>
              <span className="text-[10px] font-mono text-slate-600 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                E&P Focus
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Wellhead gas and crude revenue agreements are pegged to US Dollars. Any <strong>PKR devaluation</strong> or 
              <strong>Crude Oil Rally</strong> directly inflates rupee top-line earnings without added operational cost.
            </p>
            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Top Exposures:</span> MARI, OGDC, PPL, POL
            </div>
          </div>

          {/* Channel 3: Fertilizers */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900">
                3. Gas Feed Tariffs
              </span>
              <span className="text-[10px] font-mono text-slate-600 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                Fertilizers Focus
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Feedstock gas is the primary raw material for urea manufacturing. Tariff hikes increase production costs,
              tested against domestic urea pricing power and international landed parity.
            </p>
            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Top Exposures:</span> FFC, EFERT, FATIMA
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Sandbox */}
      <div className="bg-white p-5 rounded border border-slate-200 space-y-5">
        <div>
          <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <span>Interactive Macro Scenario Sandbox</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Adjust macro levers to simulate the structural transmission across stock universe earnings.
          </p>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* SBP Rate Slider */}
          <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">SBP Policy Rate</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {simulatedRate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="8.0"
              max="22.0"
              step="0.5"
              value={simulatedRate}
              onChange={(e) => setSimulatedRate(parseFloat(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>8.0% (Aggressive Easing)</span>
              <span>22.0% (Tight)</span>
            </div>
          </div>

          {/* USD/PKR Slider */}
          <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">USD / PKR Rate</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                Rs. {simulatedUSD.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="270"
              max="320"
              step="1"
              value={simulatedUSD}
              onChange={(e) => setSimulatedUSD(parseFloat(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>270 (Stable)</span>
              <span>320 (Devaluation)</span>
            </div>
          </div>

          {/* Brent Crude Slider */}
          <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Brent Crude</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                ${simulatedCrude.toFixed(1)}/bbl
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="110"
              step="1"
              value={simulatedCrude}
              onChange={(e) => setSimulatedCrude(parseFloat(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>$60</span>
              <span>$110 (Spike)</span>
            </div>
          </div>

          {/* Gas Tariff Slider */}
          <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Gas Feed Tariff</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                Rs. {simulatedGasTariff}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="2500"
              step="25"
              value={simulatedGasTariff}
              onChange={(e) => setSimulatedGasTariff(parseInt(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Rs. 500</span>
              <span>Rs. 1,597 (OGRA)</span>
              <span>Rs. 2,500</span>
            </div>
          </div>
        </div>

        {/* Projected Impact Cards */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Projected Sector Multiplier Impacts
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Commercial Banks Impact */}
            <div className="p-3.5 rounded border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">Commercial Banks</span>
                <span
                  className={`font-mono font-bold ${
                    rateDelta < 0 ? 'text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  {rateDelta < 0 ? 'Net Positive (+Liquidity)' : 'Spread Expansion'}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                {rateDelta < -1
                  ? 'Lower interest rates spark loan growth and trigger hefty capital gains on government paper (PIBs) portfolios.'
                  : 'Sustained rates keep NIM spreads elevated; asset re-pricing continues on quarterly KIBOR resets.'}
              </p>
            </div>

            {/* Oil & Gas Exploration Impact */}
            <div className="p-3.5 rounded border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">Oil & Gas (E&P)</span>
                <span
                  className={`font-mono font-bold ${
                    crudeDelta > 0 || usdDelta > 0 ? 'text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  {crudeDelta > 5 ? 'High Windfall' : 'Stable Dollar Cash-flow'}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                {crudeDelta > 5 || usdDelta > 10
                  ? 'Revenues expand dynamically with zero added operating expense. MARI and POL dividend capacity surges.'
                  : 'Predictable wellhead pricing offers currency defense against domestic inflation.'}
              </p>
            </div>

            {/* Fertilizers Impact */}
            <div className="p-3.5 rounded border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">Fertilizers</span>
                <span
                  className={`font-mono font-bold ${
                    gasDelta > 100 ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {gasDelta > 100 ? 'Margin Squeeze' : 'High Payout Security'}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                {gasDelta > 100
                  ? 'Input cost increases must be offset through higher domestic urea pricing; margin compression on un-hedged plants.'
                  : 'Reliable cash generation supports double-digit dividend yields (FFC, EFERT).'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
