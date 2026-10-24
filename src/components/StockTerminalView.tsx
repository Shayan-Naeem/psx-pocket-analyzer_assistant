import React from 'react';
import { StockQuote, StockSymbol, SectorType, AlertRule } from '../types';
import { TrendingUp, TrendingDown, Bell, Sparkles, ChevronRight, Sliders } from 'lucide-react';

interface StockTerminalViewProps {
  stocks: StockQuote[];
  rules: AlertRule[];
  onOpenGemmaAnalysis: (stock: StockQuote) => void;
  onOpenCreateRuleForStock: (stock: StockQuote) => void;
  onSimulatePriceDrop: (symbol: StockSymbol, targetPrice: number) => void;
  activeSectorFilter: SectorType | 'ALL';
  setActiveSectorFilter: (sec: SectorType | 'ALL') => void;
}

export const StockTerminalView: React.FC<StockTerminalViewProps> = ({
  stocks,
  rules,
  onOpenGemmaAnalysis,
  onOpenCreateRuleForStock,
  onSimulatePriceDrop,
  activeSectorFilter,
  setActiveSectorFilter,
}) => {
  const [selectedStockSymbol, setSelectedStockSymbol] = React.useState<StockSymbol>('MEBL');
  const [customPriceInput, setCustomPriceInput] = React.useState<string>('530');

  const filteredStocks = activeSectorFilter === 'ALL'
    ? stocks
    : stocks.filter((s) => s.sector === activeSectorFilter);

  const selectedStock = stocks.find((s) => s.symbol === selectedStockSymbol) || stocks[0];

  React.useEffect(() => {
    if (selectedStock) {
      setCustomPriceInput(selectedStock.currentPrice.toFixed(2));
    }
  }, [selectedStockSymbol]);

  const getRulesForStock = (sym: StockSymbol) => {
    return rules.filter((r) => r.symbol === sym && r.status === 'ACTIVE');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Interactive Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded border border-slate-200">
        <div>
          <h2 className="text-base font-display font-bold text-slate-900 tracking-tight">
            PSX Blue-Chip Target Universe
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>12 Core Securities</span>
            <span aria-hidden="true">·</span>
            <span>Banks, E&P & Fertilizers</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Order Book Simulation</span>
          </div>
        </div>

        {/* Sector Segmented Controls (Interactive Filter Buttons) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded">
          <button
            onClick={() => setActiveSectorFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSectorFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Sectors (12)
          </button>
          <button
            onClick={() => setActiveSectorFilter('Commercial Banks')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSectorFilter === 'Commercial Banks'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Banks (5)
          </button>
          <button
            onClick={() => setActiveSectorFilter('Oil & Gas Exploration')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSectorFilter === 'Oil & Gas Exploration'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Oil & Gas (4)
          </button>
          <button
            onClick={() => setActiveSectorFilter('Fertilizers')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSectorFilter === 'Fertilizers'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fertilizers (3)
          </button>
        </div>
      </div>

      {/* Main Grid: Stocks Table and Quick Simulation Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table View (Cols 1-3) */}
        <div className="lg:col-span-3 bg-white rounded border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Symbol / Company</th>
                  <th className="py-3 px-4 text-right">Last Price (PKR)</th>
                  <th className="py-3 px-4 text-right">Change</th>
                  <th className="py-3 px-4 text-right">Day Range</th>
                  <th className="py-3 px-4 text-right">P/E Ratio</th>
                  <th className="py-3 px-4 text-right">Div Yield</th>
                  <th className="py-3 px-4">Active Triggers</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStocks.map((stock) => {
                  const stockRules = getRulesForStock(stock.symbol);
                  const isSelected = stock.symbol === selectedStockSymbol;

                  return (
                    <tr
                      key={stock.symbol}
                      onClick={() => {
                        setSelectedStockSymbol(stock.symbol);
                        setCustomPriceInput(String(Math.floor(stock.currentPrice * 0.98)));
                      }}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-50/60 ring-1 ring-inset ring-slate-300' : ''
                      }`}
                    >
                      {/* Symbol & Name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {stock.symbol}
                          </span>
                          <span className="text-slate-500 text-[11px] font-sans truncate max-w-[160px]">
                            {stock.name}
                          </span>
                        </div>
                      </td>

                      {/* Current Price with Tick Animation */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-mono font-bold tabular-nums text-sm px-1.5 py-0.5 rounded transition-colors duration-300 ${
                            stock.lastTickDirection === 'up'
                              ? 'bg-emerald-100 text-emerald-800'
                              : stock.lastTickDirection === 'down'
                              ? 'bg-rose-100 text-rose-800'
                              : 'text-slate-900'
                          }`}
                        >
                          Rs. {stock.currentPrice.toFixed(2)}
                        </span>
                      </td>

                      {/* Change PKR & % */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                        <div
                          className={`inline-flex items-center gap-0.5 font-semibold ${
                            stock.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {stock.changePercent >= 0 ? '+' : ''}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {stock.changePKR >= 0 ? '+' : ''}
                          {stock.changePKR.toFixed(2)} PKR
                        </div>
                      </td>

                      {/* Day Range (Low - High) */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono tabular-nums text-slate-600">
                        <div>
                          {stock.lowPrice.toFixed(1)} - {stock.highPrice.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Vol: {(stock.volume / 1000000).toFixed(2)}M
                        </div>
                      </td>

                      {/* P/E Ratio */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                        <span
                          className={`font-semibold ${
                            stock.peRatio < 5.0 ? 'text-emerald-700' : 'text-slate-800'
                          }`}
                        >
                          {stock.peRatio.toFixed(1)}x
                        </span>
                      </td>

                      {/* Dividend Yield */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                        <span
                          className={`font-semibold ${
                            stock.dividendYield >= 14.0 ? 'text-emerald-700' : 'text-slate-800'
                          }`}
                        >
                          {stock.dividendYield.toFixed(1)}%
                        </span>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {stock.payoutFrequency}
                        </div>
                      </td>

                      {/* Active Triggers */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {stockRules.length > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            {stockRules.map((r) => (
                              <span
                                key={r.id}
                                className="font-mono text-[11px] text-slate-700 flex items-center gap-1"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {r.type === 'ABSOLUTE_FLOOR'
                                  ? `< ${r.thresholdValue} PKR`
                                  : `±${Math.abs(r.thresholdValue)}%`}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">No rules</span>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenGemmaAnalysis(stock);
                            }}
                            title="Analyze fundamentals and valuation with Gemma 4"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCreateRuleForStock(stock);
                            }}
                            title="Add alert rule for this stock"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Stock Quick Simulator & Inspection Panel (Col 4) */}
        <div className="bg-white rounded border border-slate-200 p-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-sans font-medium text-slate-500 uppercase tracking-wider">
                  {selectedStock.sector}
                </span>
                <h3 className="font-mono font-bold text-lg text-slate-900">
                  {selectedStock.symbol}
                </h3>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums">
                  Rs. {selectedStock.currentPrice.toFixed(2)}
                </div>
                <div
                  className={`font-mono text-xs font-semibold tabular-nums ${
                    selectedStock.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {selectedStock.changePercent >= 0 ? '+' : ''}
                  {selectedStock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Fundamentals mini grid */}
            <div className="grid grid-cols-2 gap-3 py-4 text-xs border-b border-slate-100">
              <div>
                <span className="text-slate-500">P/E Ratio</span>
                <p className="font-mono font-semibold text-slate-900 tabular-nums">
                  {selectedStock.peRatio.toFixed(1)}x
                </p>
              </div>
              <div>
                <span className="text-slate-500">Dividend Yield</span>
                <p className="font-mono font-semibold text-slate-900 tabular-nums">
                  {selectedStock.dividendYield.toFixed(1)}%
                </p>
              </div>
              <div>
                <span className="text-slate-500">Book Value</span>
                <p className="font-mono font-semibold text-slate-900 tabular-nums">
                  Rs. {selectedStock.bookValue.toFixed(1)}
                </p>
              </div>
              <div>
                <span className="text-slate-500">52W Range</span>
                <p className="font-mono font-semibold text-slate-900 tabular-nums text-[11px]">
                  {selectedStock.week52Low} - {selectedStock.week52High}
                </p>
              </div>
            </div>

            {/* Offline Interactive Price Simulator Tool */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>Simulate Price Breach</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Manually push price below floor threshold or trigger volatility to test multi-format alerts.
              </p>

              {/* PSX Daily Circuit Breaker / Price Adjustment Tool */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-400">Rs.</span>
                  <input
                    type="number"
                    step="0.05"
                    value={customPriceInput}
                    onChange={(e) => setCustomPriceInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="Enter target PKR"
                  />
                </div>
                <button
                  onClick={() => {
                    const price = parseFloat(customPriceInput);
                    if (!isNaN(price) && price > 0) {
                      onSimulatePriceDrop(selectedStock.symbol, price);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  Set Price
                </button>
              </div>

              {/* Instant Test Presets calculated from Official Previous Close (Non-compounding) */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    // Non-compounding: always relative to official previousClose
                    const floorDrop = Math.round(selectedStock.previousClose * 0.98 * 100) / 100;
                    setCustomPriceInput(floorDrop.toFixed(2));
                    onSimulatePriceDrop(selectedStock.symbol, floorDrop);
                  }}
                  title="Simulate mild -2.0% pullback from official close"
                  className="px-2 py-1.5 text-[11px] font-mono text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  -2.0% Dip
                </button>

                <button
                  onClick={() => {
                    // Non-compounding: -4.5% drop from official close to trigger floor alerts
                    const floorDrop = Math.round(selectedStock.previousClose * 0.955 * 100) / 100;
                    setCustomPriceInput(floorDrop.toFixed(2));
                    onSimulatePriceDrop(selectedStock.symbol, floorDrop);
                  }}
                  title="Simulate -4.5% drop from official close (breaches 535 PKR on MEBL)"
                  className="px-2 py-1.5 text-[11px] font-mono text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors cursor-pointer text-center font-semibold"
                >
                  -4.5% Drop
                </button>

                <button
                  onClick={() => {
                    // Instant reset of this specific scrip to official closing price
                    setCustomPriceInput(selectedStock.previousClose.toFixed(2));
                    onSimulatePriceDrop(selectedStock.symbol, selectedStock.previousClose);
                  }}
                  title="Reset scrip to official closing price"
                  className="px-2 py-1.5 text-[11px] font-mono text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  Reset Scrip
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action for Gemma 4 */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenGemmaAnalysis(selectedStock)}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-700" />
              <span>Ask Gemma 4 on {selectedStock.symbol}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
