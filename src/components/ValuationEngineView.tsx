import React from 'react';
import { StockQuote, SectorType } from '../types';
import { BarChart3, TrendingUp, DollarSign, ArrowUpDown, Sparkles } from 'lucide-react';

interface ValuationEngineViewProps {
  stocks: StockQuote[];
  onOpenGemmaAnalysis: (stock: StockQuote) => void;
}

export const ValuationEngineView: React.FC<ValuationEngineViewProps> = ({
  stocks,
  onOpenGemmaAnalysis,
}) => {
  const [sortField, setSortField] = React.useState<'dividendYield' | 'peRatio' | 'currentPrice' | 'eps'>('dividendYield');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [selectedProfile, setSelectedProfile] = React.useState<'ALL' | 'High Yield' | 'Capital Growth' | 'Balanced'>('ALL');

  const filteredStocks = stocks.filter((stock) => {
    if (selectedProfile === 'ALL') return true;
    return stock.profile === selectedProfile;
  });

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const handleSort = (field: 'dividendYield' | 'peRatio' | 'currentPrice' | 'eps') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder(field === 'peRatio' ? 'asc' : 'desc'); // Lower P/E is usually better
    }
  };

  // Sector Aggregates
  const sectors: SectorType[] = ['Commercial Banks', 'Oil & Gas Exploration', 'Fertilizers'];
  const sectorSummaries = sectors.map((sec) => {
    const secStocks = stocks.filter((s) => s.sector === sec);
    const avgPE = secStocks.reduce((acc, s) => acc + s.peRatio, 0) / secStocks.length;
    const avgYield = secStocks.reduce((acc, s) => acc + s.dividendYield, 0) / secStocks.length;
    return {
      sector: sec,
      count: secStocks.length,
      avgPE,
      avgYield,
    };
  });

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-display font-bold text-slate-900 tracking-tight">
              Valuation & Stock Recommendation Engine
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Systematic fundamental screening comparing historical P/E multiples against sustainable dividend yields.
              Evaluates cash-flow yield stability against long-term capital appreciation across Banks, E&P, and Fertilizers.
            </p>
          </div>

          {/* Profile Filter (Buttons/Tabs) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded self-start md:self-auto">
            {(['ALL', 'High Yield', 'Capital Growth', 'Balanced'] as const).map((prof) => (
              <button
                key={prof}
                onClick={() => setSelectedProfile(prof)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                  selectedProfile === prof
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {prof === 'ALL' ? 'All Profiles' : prof}
              </button>
            ))}
          </div>
        </div>

        {/* Sector Summary Strips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100">
          {sectorSummaries.map((sec) => (
            <div key={sec.sector} className="bg-slate-50 p-3.5 rounded border border-slate-200">
              <span className="text-[11px] font-sans font-medium text-slate-500">
                {sec.sector} ({sec.count} Stocks)
              </span>
              <div className="flex items-center justify-between mt-2 text-xs">
                <div>
                  <span className="text-slate-500">Avg P/E:</span>{' '}
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {sec.avgPE.toFixed(1)}x
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Avg Yield:</span>{' '}
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">
                    {sec.avgYield.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Matrix: P/E vs Dividend Yield Quadrant View */}
      <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-slate-900">
              Valuation Quadrant: Multiples (P/E) vs. Cash Dividend Yield
            </h3>
            <p className="text-[11px] text-slate-500">
              Optimal value zone: Lower P/E multiple with high dividend yield (top-left quadrant).
            </p>
          </div>
        </div>

        {/* Quadrant Visual Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {sortedStocks.map((stock) => {
            const isHighYield = stock.dividendYield >= 14.0;
            const isLowPE = stock.peRatio <= 5.0;

            return (
              <div
                key={stock.symbol}
                onClick={() => onOpenGemmaAnalysis(stock)}
                className={`p-3.5 rounded border transition-all cursor-pointer hover:shadow-xs ${
                  isHighYield && isLowPE
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {stock.symbol}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {stock.profile}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-700 font-semibold tabular-nums">
                    Rs. {stock.currentPrice.toFixed(1)}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  {/* P/E Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                      <span>P/E Multiple</span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {stock.peRatio.toFixed(1)}x
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-700 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (stock.peRatio / 8.0) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Dividend Yield Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                      <span>Dividend Yield</span>
                      <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                        {stock.dividendYield.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (stock.dividendYield / 20.0) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>EPS: Rs. {stock.eps.toFixed(1)}</span>
                  <span className="text-emerald-700 font-medium">Click for Gemma advice</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Fundamental Matrix Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-display font-bold text-slate-900">
            Valuation Ranking & Dividend Sustainability
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Sorted by: {sortField.toUpperCase()} ({sortOrder.toUpperCase()})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Sector</th>
                <th
                  onClick={() => handleSort('currentPrice')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Price (PKR)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('peRatio')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>P/E Ratio</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dividendYield')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Dividend Yield</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('eps')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>EPS (PKR)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Book Value</th>
                <th className="py-3 px-4 text-right">Investment Profile</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStocks.map((stock, idx) => (
                <tr key={stock.symbol} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-xs w-4">
                        {idx + 1}.
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {stock.symbol}
                      </span>
                      <span className="text-slate-500 font-sans truncate max-w-[140px]">
                        {stock.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                    {stock.sector}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums font-semibold text-slate-900">
                    Rs. {stock.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                    <span
                      className={`font-semibold ${
                        stock.peRatio < 4.5 ? 'text-emerald-700' : 'text-slate-800'
                      }`}
                    >
                      {stock.peRatio.toFixed(1)}x
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                    <span
                      className={`font-semibold ${
                        stock.dividendYield >= 14.0 ? 'text-emerald-700' : 'text-slate-800'
                      }`}
                    >
                      {stock.dividendYield.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums text-slate-700">
                    Rs. {stock.eps.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums text-slate-600">
                    Rs. {stock.bookValue.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-[11px] text-slate-700">
                    {stock.profile}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenGemmaAnalysis(stock)}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                    >
                      Ask Gemma 4
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
