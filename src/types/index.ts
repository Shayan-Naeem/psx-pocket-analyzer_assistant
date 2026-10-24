export type SectorType = 'Commercial Banks' | 'Oil & Gas Exploration' | 'Fertilizers';

export type StockSymbol =
  | 'MEBL'
  | 'FABL'
  | 'HBL'
  | 'UBL'
  | 'MCB'
  | 'MARI'
  | 'OGDC'
  | 'PPL'
  | 'POL'
  | 'FFC'
  | 'EFERT'
  | 'FATIMA';

export interface StockQuote {
  symbol: StockSymbol;
  name: string;
  sector: SectorType;
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  changePKR: number;
  changePercent: number;
  volume: number;
  peRatio: number;
  dividendYield: number; // e.g. 14.2 for 14.2%
  payoutFrequency: string; // e.g. "Quarterly", "Bi-Annual"
  eps: number;
  bookValue: number;
  week52High: number;
  week52Low: number;
  profile: 'High Yield' | 'Capital Growth' | 'Balanced';
  macroSensitivities: {
    interestRate: 'High' | 'Medium' | 'Low';
    pkrDevaluation: 'Positive' | 'Neutral' | 'Negative';
    crudeOil: 'High' | 'Low' | 'Neutral';
    gasTariff: 'High' | 'Low' | 'Neutral';
  };
  sparkline: number[];
  lastTickDirection?: 'up' | 'down' | 'neutral';
}

export type TriggerType = 'ABSOLUTE_FLOOR' | 'VOLATILITY_PERCENT' | 'ABSOLUTE_CEILING';

export interface AlertRule {
  id: string;
  symbol: StockSymbol;
  type: TriggerType;
  thresholdValue: number; // e.g. 535 PKR or -5%
  status: 'ACTIVE' | 'TRIGGERED' | 'PAUSED';
  createdAt: string;
  triggeredAt?: string;
  triggerPrice?: number;
  note?: string;
}

export interface TriggeredAlertEvent {
  id: string;
  ruleId: string;
  symbol: StockSymbol;
  stockName: string;
  triggerType: TriggerType;
  thresholdValue: number;
  triggerPrice: number;
  sessionChangePercent: number;
  timestamp: string;
  banner: string;
  whatsappMessage: string;
  webhookJson: Record<string, any>;
  gemmaRationale?: string;
  deliveredChannels: {
    banner: boolean;
    whatsapp: boolean;
    webhook: boolean;
    osNotification: boolean;
  };
}

export interface MacroIndicators {
  kse100: number;
  kse100Change: number;
  sbpPolicyRate: number; // e.g. 12.0%
  pkrToUsd: number; // e.g. 281.50
  brentCrudeUsd: number; // e.g. 76.40
  gasFeedPriceMmbtd: number; // e.g. 580 PKR
}
