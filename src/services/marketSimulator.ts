import { StockQuote, StockSymbol, MacroIndicators } from '../types';

export function simulateMarketTick(
  stocks: StockQuote[],
  volatilityScale: number = 1.0
): StockQuote[] {
  return stocks.map((stock) => {
    // Generate tick between -0.4% and +0.4% * volatilityScale
    const deltaPercent = (Math.random() - 0.49) * 0.008 * volatilityScale;
    let newPrice = stock.currentPrice * (1 + deltaPercent);

    // Keep within reasonable precision (2 decimals)
    newPrice = Math.round(newPrice * 100) / 100;

    const changePKR = Math.round((newPrice - stock.previousClose) * 100) / 100;
    const changePercent = Math.round(((newPrice - stock.previousClose) / stock.previousClose) * 10000) / 100;

    const highPrice = Math.max(stock.highPrice, newPrice);
    const lowPrice = Math.min(stock.lowPrice, newPrice);
    const volume = stock.volume + Math.floor(Math.random() * 5000);

    const newSparkline = [...stock.sparkline.slice(-14), newPrice];

    let lastTickDirection: 'up' | 'down' | 'neutral' = 'neutral';
    if (newPrice > stock.currentPrice) lastTickDirection = 'up';
    else if (newPrice < stock.currentPrice) lastTickDirection = 'down';

    return {
      ...stock,
      currentPrice: newPrice,
      highPrice,
      lowPrice,
      changePKR,
      changePercent,
      volume,
      sparkline: newSparkline,
      lastTickDirection,
    };
  });
}

export type PresetScenario =
  | 'RATE_CUT_BULL'
  | 'CRUDE_SURGE'
  | 'GAS_TARIFF_HIKE'
  | 'FLASH_CRASH'
  | 'RESET_BASELINE';

export function applyPresetScenario(
  currentStocks: StockQuote[],
  currentMacro: MacroIndicators,
  scenario: PresetScenario,
  baselineStocks: StockQuote[]
): { stocks: StockQuote[]; macro: MacroIndicators; description: string } {
  let updatedMacro = { ...currentMacro };
  let desc = '';

  switch (scenario) {
    case 'RATE_CUT_BULL': {
      updatedMacro.sbpPolicyRate = Math.max(9.0, updatedMacro.sbpPolicyRate - 1.5);
      updatedMacro.kse100 += 1250;
      updatedMacro.kse100Change = 1250;
      desc = 'SBP eases policy rate by 150 bps! Equity-wide valuation expansion with massive liquidity inflow into blue-chip high-yielders.';

      const stocks = currentStocks.map((stock) => {
        let mult = 1.025; // default +2.5%
        if (stock.sector === 'Fertilizers') mult = 1.035; // high dividend gainers
        if (stock.sector === 'Commercial Banks') mult = 1.012; // NIM compression offset by loan book growth

        const newPrice = Math.round(stock.currentPrice * mult * 100) / 100;
        const changePKR = Math.round((newPrice - stock.previousClose) * 100) / 100;
        const changePercent = Math.round(((newPrice - stock.previousClose) / stock.previousClose) * 10000) / 100;
        return {
          ...stock,
          currentPrice: newPrice,
          highPrice: Math.max(stock.highPrice, newPrice),
          changePKR,
          changePercent,
          sparkline: [...stock.sparkline.slice(-14), newPrice],
          lastTickDirection: 'up' as const,
        };
      });
      return { stocks, macro: updatedMacro, description: desc };
    }

    case 'CRUDE_SURGE': {
      updatedMacro.brentCrudeUsd = 86.8;
      updatedMacro.kse100 += 640;
      updatedMacro.kse100Change = 640;
      desc = 'Middle East crude supply disruption! Brent climbs past $86/bbl, catalyzing massive buying across MARI, OGDC, PPL, and POL.';

      const stocks = currentStocks.map((stock) => {
        let mult = 1.002;
        if (stock.sector === 'Oil & Gas Exploration') {
          mult = stock.symbol === 'MARI' ? 1.045 : 1.052;
        }

        const newPrice = Math.round(stock.currentPrice * mult * 100) / 100;
        const changePKR = Math.round((newPrice - stock.previousClose) * 100) / 100;
        const changePercent = Math.round(((newPrice - stock.previousClose) / stock.previousClose) * 10000) / 100;
        return {
          ...stock,
          currentPrice: newPrice,
          highPrice: Math.max(stock.highPrice, newPrice),
          changePKR,
          changePercent,
          sparkline: [...stock.sparkline.slice(-14), newPrice],
          lastTickDirection: (newPrice >= stock.currentPrice ? 'up' : 'down') as 'up' | 'down',
        };
      });
      return { stocks, macro: updatedMacro, description: desc };
    }

    case 'GAS_TARIFF_HIKE': {
      updatedMacro.gasFeedPriceMmbtd = 780;
      desc = 'Ministry of Energy rationalizes gas feed tariffs to Rs. 780/MMBTU. Fertilizer margins compress on higher cost of production.';

      const stocks = currentStocks.map((stock) => {
        let mult = 1.0;
        if (stock.sector === 'Fertilizers') {
          mult = stock.symbol === 'FFC' ? 0.965 : stock.symbol === 'EFERT' ? 0.955 : 0.96;
        }

        const newPrice = Math.round(stock.currentPrice * mult * 100) / 100;
        const changePKR = Math.round((newPrice - stock.previousClose) * 100) / 100;
        const changePercent = Math.round(((newPrice - stock.previousClose) / stock.previousClose) * 10000) / 100;
        return {
          ...stock,
          currentPrice: newPrice,
          lowPrice: Math.min(stock.lowPrice, newPrice),
          changePKR,
          changePercent,
          sparkline: [...stock.sparkline.slice(-14), newPrice],
          lastTickDirection: (newPrice < stock.currentPrice ? 'down' : 'neutral') as 'down' | 'neutral',
        };
      });
      return { stocks, macro: updatedMacro, description: desc };
    }

    case 'FLASH_CRASH': {
      updatedMacro.kse100 -= 2150;
      updatedMacro.kse100Change = -2150;
      desc = 'Broad-market flash selloff triggered! Major floor thresholds and volatility limiters breached across MEBL, OGDC, and EFERT.';

      const stocks = currentStocks.map((stock) => {
        let mult = 0.955; // -4.5%
        if (stock.symbol === 'MEBL') mult = 0.965; // drops to ~523 PKR (breaching 535 floor)
        if (stock.symbol === 'OGDC') mult = 0.942; // drops -5.8% (breaching -4% volatility)
        if (stock.symbol === 'EFERT') mult = 0.952; // drops to ~185 PKR (breaching 190 floor)

        const newPrice = Math.round(stock.currentPrice * mult * 100) / 100;
        const changePKR = Math.round((newPrice - stock.previousClose) * 100) / 100;
        const changePercent = Math.round(((newPrice - stock.previousClose) / stock.previousClose) * 10000) / 100;
        return {
          ...stock,
          currentPrice: newPrice,
          lowPrice: Math.min(stock.lowPrice, newPrice),
          changePKR,
          changePercent,
          sparkline: [...stock.sparkline.slice(-14), newPrice],
          lastTickDirection: 'down' as const,
        };
      });
      return { stocks, macro: updatedMacro, description: desc };
    }

    case 'RESET_BASELINE':
    default: {
      return {
        stocks: baselineStocks.map((b) => ({ ...b, sparkline: [...b.sparkline] })),
        macro: {
          kse100: 162374.88,
          kse100Change: -1549.44,
          sbpPolicyRate: 11.5,
          pkrToUsd: 278.6,
          brentCrudeUsd: 74.8,
          gasFeedPriceMmbtd: 750,
        },
        description: 'Market ticks reset to initial session baseline.',
      };
    }
  }
}
