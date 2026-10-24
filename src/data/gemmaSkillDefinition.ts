export const GEMMA_SYSTEM_PROMPT = `You are "PSX Pocket Advisor," an expert financial companion for the Pakistan Stock Exchange (PSX). Your focus is restricted exclusively to Commercial Banks, Oil & Gas Exploration, and Fertilizers.

### Stock Universe:
- Commercial Banks: MEBL, FABL, HBL, UBL, MCB
- Oil & Gas Exploration: MARI, OGDC, PPL, POL
- Fertilizers: FFC, EFERT, FATIMA

### Primary Tasks:
1. Valuation Analysis: Compare stocks using P/E ratio, dividend yield, and macro drivers (interest rates, crude oil prices, PKR exchange rate, gas tariffs).
2. Trigger-Based Price Alerts: When evaluating market price inputs against user rules (e.g., MEBL < 535 PKR or -5% volatility breach), determine if an alert rule is triggered.
3. Alert Payload Generation: When a rule is breached, generate an on-screen alert banner, a human-readable WhatsApp message, and a clean JSON object containing event details.

### Rules & Safety:
- Include compliance disclaimer: "Educational summary only, not formal financial advice. Consult a certified broker before trading."
- Use clean Markdown formatting with clear headers and bullet points.`;

export const GEMMA_FUNCTION_DECLARATIONS = [
  {
    name: 'get_psx_quote',
    description: 'Fetches the latest official closing price, daily high/low, and session percentage change for a PSX blue-chip stock.',
    parameters: {
      type: 'OBJECT',
      properties: {
        symbol: {
          type: 'STRING',
          enum: ['MEBL', 'FABL', 'HBL', 'UBL', 'MCB', 'MARI', 'OGDC', 'PPL', 'POL', 'FFC', 'EFERT', 'FATIMA'],
          description: 'The stock ticker symbol on the Pakistan Stock Exchange.',
        },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'evaluate_price_alert',
    description: 'Evaluates whether an incoming market price or session move has breached an investor rule (Absolute Floor < PKR or Volatility >= ±%).',
    parameters: {
      type: 'OBJECT',
      properties: {
        symbol: {
          type: 'STRING',
          description: 'Stock symbol (e.g., MEBL, OGDC, EFERT).',
        },
        current_price_pkr: {
          type: 'NUMBER',
          description: 'The current market price in Pakistani Rupees (PKR).',
        },
        trigger_type: {
          type: 'STRING',
          enum: ['ABSOLUTE_FLOOR', 'VOLATILITY_PERCENT', 'ABSOLUTE_CEILING'],
          description: 'Type of alert condition to evaluate.',
        },
        threshold_value: {
          type: 'NUMBER',
          description: 'Target threshold (e.g., 535.0 for floor, or -4.5 for volatility percentage).',
        },
      },
      required: ['symbol', 'current_price_pkr', 'trigger_type', 'threshold_value'],
    },
  },
  {
    name: 'dispatch_alert_webhook',
    description: 'Dispatches multi-channel notification payloads (WhatsApp formatted message and structured JSON) to downstream webhooks or notification channels.',
    parameters: {
      type: 'OBJECT',
      properties: {
        symbol: { type: 'STRING' },
        trigger_type: { type: 'STRING' },
        current_price_pkr: { type: 'NUMBER' },
        threshold_pkr: { type: 'NUMBER' },
        percent_change: { type: 'NUMBER' },
        channel: {
          type: 'STRING',
          enum: ['WHATSAPP', 'WEBHOOK_JSON', 'ALL'],
          description: 'Destination delivery format.',
        },
      },
      required: ['symbol', 'trigger_type', 'current_price_pkr', 'threshold_pkr'],
    },
  },
];

export const GEMMA_SKILL_MD_CONTENT = `---
name: "psx-pocket-advisor"
description: >
  Autonomous financial intelligence companion and price alert trigger assistant
  for the Pakistan Stock Exchange (PSX). Evaluates blue-chip stocks in Commercial
  Banks, Oil & Gas Exploration, and Fertilizers using P/E multiples, dividend yields,
  macro drivers (SBP interest rates, PKR/USD, crude oil, gas feed tariffs), and
  dispatches multi-channel alerts (UI Banner, WhatsApp, JSON Webhook).
target_model: "Gemma 4 (Google AI Studio)"
track: "No-Code / Agent Skill Track"
tools:
  - "googleSearch"
  - "evaluate_price_alert"
  - "dispatch_alert_webhook"
---

# PSX Pocket Advisor & Alert Assistant Skill

## 1. Scope & Stock Universe
Strictly restricted to 12 PSX blue-chip securities across 3 key sectors:
- **Commercial Banks**: MEBL, FABL, HBL, UBL, MCB
- **Oil & Gas Exploration**: MARI, OGDC, PPL, POL
- **Fertilizers**: FFC, EFERT, FATIMA

## 2. Core Operational Capabilities
1. **Valuation & Screening**: Compare stocks using P/E ratio, dividend yield history, and macro drivers (SBP interest rate cycles, crude oil prices, PKR exchange rate, gas tariffs).
2. **Dual-Trigger Price Alerting**:
   - **Absolute Floor Trigger**: Determines breach when \`Current_Price_PKR < Absolute_Floor_Threshold\` (e.g. \`MEBL < 535 PKR\`).
   - **Volatility Spike Trigger**: Determines breach when session move exceeds \`Volatility_Threshold_Percent\` (e.g. \`-4.5%\` dip or \`+5.0%\` rally).
3. **Multi-Format Delivery**:
   - **On-Screen Alert Banner**: High-priority alert banner.
   - **WhatsApp / SMS Formatted Text**: Clean emoji bullet message ready for mobile delivery.
   - **Structured Webhook JSON**: Standard RFC-compliant payload for Zapier, Make.com, or SMTP.

## 3. Function Calling Tool Specifications

### Tool 1: \`get_psx_quote(symbol)\`
Fetches official market closing quotes, day range, and volume.

### Tool 2: \`evaluate_price_alert(symbol, current_price_pkr, trigger_type, threshold_value)\`
Evaluates the mathematical trigger condition and returns trigger boolean and formatted payloads.

### Tool 3: \`dispatch_alert_webhook(symbol, trigger_type, current_price_pkr, threshold_pkr, channel)\`
Forwards generated alerts to WhatsApp / Webhook endpoints.

## 4. Multi-Channel Output Specification
When a price breach occurs, the agent emits three exact formats:

### A. On-Screen Alert Banner
\`\`\`
🚨 PSX TRIGGER: [SYMBOL] breached [TRIGGER_TYPE]. Current Price: Rs. [PRICE] PKR ([CHANGE]%).
\`\`\`

### B. WhatsApp / SMS Notification Text
\`\`\`
*🔔 PSX POCKET ADVISOR ALERT: [SYMBOL]*

*Trigger Type:* [TRIGGER_TYPE_HUMAN_READABLE]
*Current Price:* Rs. [CURRENT_PRICE] PKR
*Threshold Rule:* [THRESHOLD_RULE_TEXT]
*Session Change:* [CHANGE_PERCENT]%
*Time (PKT):* [TIME_STAMP]

*Advisor Note:* [CONCISE_VALUATION_NOTE]

_Educational summary only, not formal financial advice. Consult a certified broker before trading._
\`\`\`

### C. Clean JSON Webhook Payload
\`\`\`json
{
  "event": "PSX_PRICE_ALERT_TRIGGERED",
  "timestamp": "ISO_8601_TIMESTAMP",
  "exchange": "PSX",
  "data": {
    "symbol": "[SYMBOL]",
    "triggerType": "[TRIGGER_TYPE]",
    "currentPricePKR": 0.00,
    "thresholdPKR": 0.00,
    "percentChangeSession": 0.00,
    "marketTimePKT": "[TIME_PKT]"
  },
  "status": "TRIGGERED",
  "disclaimer": "Educational summary only, not formal financial advice. Consult a certified broker before trading."
}
\`\`\`

## 5. Macro Sensitivity Framework
- **State Bank of Pakistan (SBP) Policy Rate**: Rate cuts expand liquidity and equity multiples (+PIB bond portfolio capital gains for Banks).
- **PKR Devaluation & Arab Light/Brent Crude**: Direct translation to revenue windfalls for Oil & Gas E&P companies with dollar-indexed pricing formulas.
- **Gas Feed Tariffs**: Operating cost inflation pressure on Fertilizers; evaluate urea market pricing pass-through capabilities.

*Educational summary only, not formal financial advice. Consult a certified broker before trading.*
`;

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Valuation' | 'Alert Trigger' | 'Macro Analysis';
  prompt: string;
  sampleInput: string;
}

export const GEMMA_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'template-valuation',
    title: 'P/E Multiples & Dividend Yield Ranking',
    category: 'Valuation',
    prompt: `Analyze the valuation rankings of MEBL, FFC, and OGDC. Compare their current P/E multiples against their historical dividend yields, and determine which stock offers the safest dividend cash flow profile in an SBP 11.5% rate cycle.`,
    sampleInput: 'MEBL (Rs. 534.35, P/E 4.6x, Yield 14.2%), FFC (Rs. 532.49, P/E 6.2x, Yield 15.4%), OGDC (Rs. 302.50, P/E 4.5x, Yield 12.6%). SBP Rate: 11.5%.',
  },
  {
    id: 'template-alert-floor',
    title: 'Absolute Price Floor Breach Evaluation',
    category: 'Alert Trigger',
    prompt: `Evaluate an incoming market tick: Stock MEBL has fallen to 531.50 PKR from previous close of 545.05 PKR (-2.48%). User rule has an Absolute Floor Trigger at 535.00 PKR. Determine if triggered, generate the on-screen alert banner, the WhatsApp message, and the JSON payload.`,
    sampleInput: 'Symbol: MEBL | Price: 531.50 PKR | Rule: Absolute Floor < 535.00 PKR | Session: -2.48%',
  },
  {
    id: 'template-alert-volatility',
    title: 'Percentage Volatility Spike Evaluation',
    category: 'Alert Trigger',
    prompt: `Evaluate an incoming market spike: Stock OGDC jumped to 315.00 PKR from 299.80 PKR (+5.07% intraday move). User rule has a Volatility Trigger set at 4.00%. Generate the on-screen banner, WhatsApp copy, and clean JSON webhook object.`,
    sampleInput: 'Symbol: OGDC | Current: 315.00 PKR | Close: 299.80 PKR | Move: +5.07% | Rule: Volatility >= 4.00%',
  },
  {
    id: 'template-macro-rates',
    title: 'SBP Monetary Policy Cycle Impact on Banks',
    category: 'Macro Analysis',
    prompt: `The State Bank of Pakistan benchmark policy rate stands at 11.50%. Compare the direct earnings impact on MEBL, UBL, and MCB under current liquidity conditions. Highlight Net Interest Margin (NIM) repricing lag and investment book revaluation.`,
    sampleInput: 'SBP Policy Rate: 11.50%. Target universe: Commercial Banks (MEBL, UBL, MCB).',
  },
];
