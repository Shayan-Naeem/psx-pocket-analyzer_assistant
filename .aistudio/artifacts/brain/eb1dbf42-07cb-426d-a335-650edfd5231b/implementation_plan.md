# PSX Pocket Advisor & Alert Assistant

An institutional-grade Pakistan Stock Exchange (PSX) financial companion and alert simulator designed for retail investors in Pakistan. It evaluates blue-chip stocks across Commercial Banks, Oil & Gas Exploration, and Fertilizers using real-time valuation metrics, dual-trigger price breach monitors (Absolute Floor & Volatility %), macro cycle drivers (SBP interest rates, PKR/USD, crude oil, gas tariffs), and multi-channel delivery (WhatsApp, JSON Webhook, UI Banner, and native OS Desktop Notifications) alongside a dedicated Gemma 4 Agent Skill workbench.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions have been aligned based on your feedback:
> - **Interface & Operating Mode**: Full interactive institutional terminal featuring both the real-time valuation dashboard, interactive alert simulation, and an integrated Gemma 4 Agent Skill engine.
> - **Market Simulation Strategy**: Realistic PSX live tick simulator with user-configurable drift/volatility, one-click shock presets (e.g. "Rate Cut Announcement", "Crude Oil Rally", "Gas Tariff Hike", "Bearish Selloff"), and manual price adjustment sliders.
> - **Visual Aesthetic**: Clean institutional modern fintech interface in crisp light mode, using slate surfaces, high-contrast dark navy typography, emerald/rose financial accents, strict tabular numerals, and zero-pill discipline.

---

### 1. Overview & Core Concept

- **What It Does**:
  - **Stock Universe Tracking**: Scoped strictly to the 12 core PSX blue-chip stocks across three sectors:
    1. *Commercial Banks*: MEBL (Meezan Bank), FABL (Faysal Bank), HBL (Habib Bank), UBL (United Bank), MCB (MCB Bank).
    2. *Oil & Gas Exploration*: MARI (Mari Petroleum), OGDC (Oil & Gas Development Co.), PPL (Pakistan Petroleum), POL (Pakistan Oilfields).
    3. *Fertilizers*: FFC (Fauji Fertilizer), EFERT (Engro Fertilizers), FATIMA (Fatima Fertilizer).
  - **Valuation & Recommendation Engine**: Real-time screening by P/E ratio, historical dividend yield, dividend payout frequency, earnings stability, and capital gains potential vs. yield profiling.
  - **Macro Sector Intelligence**: Dynamic analysis of State Bank of Pakistan (SBP) policy rate cuts/hikes, PKR devaluation, Arab Light / Brent crude oil prices, and indigenous gas feed tariffs.
  - **Dual-Trigger Price Alert System**:
    1. *Absolute Floor Trigger*: Threshold breaches when a stock falls below a target price in PKR (e.g. `MEBL < 535 PKR`).
    2. *Percentage Volatility Trigger*: Intraday percentage move breaches (e.g. `-5%` dip or `+10%` breakout).
  - **Multi-Format Notification Delivery**:
    1. *On-Screen Alert Banner*: High-urgency visual notifications with instant action triggers.
    2. *One-Click WhatsApp / SMS Formatter*: Cleanly structured, copy-pasteable messages with emoji bullet formatting tailored for Pakistani investor groups.
    3. *Structured Webhook JSON*: Compliant with Zapier, Make.com, Python scripts, or custom SMTP alert dispatchers.
    4. *Native OS Desktop Notifications*: HTML5 Notification API support triggering native desktop popups on Windows and macOS.
  - **Gemma 4 Agent Skill Workbench**: Interactive prompt runner and exportable Agent Skill bundle (system instructions, prompt schema, benchmark examples, and one-click copy/download).

- **Target Audience / Persona**:
  Pakistani retail stock investors, equity research analysts, and high-net-worth portfolio managers trading on KSE-100 who require fast valuation signals, instant price alerts on WhatsApp, and automated webhook triggers.

- **Key Value**:
  Replaces manual Excel sheets and delayed brokerage SMS alerts with an active, browser-based valuation engine and alert dispatcher, backed by Gemma 4 intelligence for macro narrative synthesis.

---

### 2. User Experience & Visual Design

- **Layout Structure**:
  - Institutional SaaS header conforming to the 3-Zone Top Bar Contract: Brand mark wordmark ("PSX Pocket Advisor"), clean text nav links (`Market Overview`, `Valuation Engine`, `Alert Triggers`, `Macro Drivers`, `Gemma 4 Skill`), and a primary quick-action button (`+ New Alert Rule`).
  - Viewport-balanced multi-column layout optimized for 1440px desktop screens with fluid mobile responsiveness:
    - **Top Metrics Strip**: KSE-100 benchmark, SBP Policy Rate (12.0%), PKR/USD rate (281.50), Brent Crude ($76.20/bbl).
    - **Main Workspace Tabbed Views**:
      1. *Terminal & Live Market Feed*: 12-stock interactive grid with live ticker simulations, candlestick sparklines, bid/ask spreads, and instant alert threshold indicators.
      2. *Dual-Trigger Alert Simulator*: Rule builder, trigger test runner with simulated price drops, live alert logs, and output tabs (WhatsApp copy, Webhook JSON preview, Test OS Notification).
      3. *Valuation & Sector Comparison Matrix*: Comparative scatter/bar visualizations of P/E vs. Dividend Yield, capital appreciation ranking, and macro sensitivity matrix.
      4. *Pakistani Macro Analysis*: Deep-dive into interest rate impact on banks, currency devaluation on E&P, and gas pricing on fertilizer margins.
      5. *Gemma 4 Skill & AI Studio Center*: Complete system instructions, direct prompt execution testbed via server-side Gemini/Gemma models, and exportable Skill package (`SKILL.md` + sample payloads).

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Institutional modern fintech — crisp, authoritative, clear, and mathematically precise.
  - *Color Palette (60-30-10 Rule)*:
    - Dominant Canvas (60%): Clean crisp neutral white (`#FFFFFF`) with ultra-subtle off-white background fields (`#F8FAFC`).
    - Structural Surfaces (30%): Hairline slate borders (`#E2E8F0`), muted headers (`#64748B`), and slate surface containers (`#F1F5F9`).
    - Accent Budget (10%): Classic financial emerald green (`#16A34A` / `#059669`) for positive returns and buy alerts, crimson rose (`#DC2626`) for negative volatility and stop breaches, and institutional navy (`#0F172A`) for active controls.
  - *Typography*:
    - Display & Headers: `Plus Jakarta Sans` for clean, professional modern weight.
    - Body Text: `DM Sans` for high legibility at 13px–15px.
    - Financial Metrics & Ticker Data: `JetBrains Mono` / `tabular-nums` for strict vertical alignment of decimals, percentages, and PKR currency figures.
  - *Zero-Pill & Metadata Discipline*:
    - All tickers, sectors, and dates rendered as unboxed typography separated by quiet dots (`MEBL · Commercial Banks · P/E 4.8x · Yield 14.2%`).
    - No decorative pill badge sandwiches or artificial status tags.
  - *Interactive Feedback*:
    - Real-time price flash animation (soft green or red highlight on tick change settling in 250ms).
    - Sound toggle for triggered alerts (optional subtle audio chime).
    - Toast confirmations for clipboard copy operations ("Copied WhatsApp payload to clipboard").

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Realistic Client-Side Market Tick Generator with Preset Shocks**
  - *Approach*: Built-in deterministic Brownian motion engine that simulates live trades, order book spreads, and intraday volume for all 12 stocks, paired with one-click market shock triggers ("Emergency SBP Rate Cut", "OPEC Oil Surge", "Fertilizer Gas Subsidies Reduced", "Black Monday Selloff").
  - *Why*: Allows immediate, offline-ready testing of alert triggers without waiting for PSX trading hours (9:15 AM - 3:30 PM PKT) or requiring paid PSX data vendor APIs.
  - *Alternative Considered*: Static mock data (dismissed because testing dual-trigger alerts requires dynamic movement across price thresholds).

- **Decision 2: Native HTML5 Desktop Notification Integration**
  - *Approach*: Integrate the browser's `Notification.requestPermission()` and `new Notification()` API to dispatch genuine OS-level desktop notifications on Windows, macOS, and Linux whenever a price floor or volatility limit is breached.
  - *Why*: Satisfies Feature B & PRD Section 4 requirements for native OS alerts that notify investors even when the browser tab is in the background.
  - *Alternative Considered*: In-app toast banners only (less effective for real traders who need background alerts while working).

- **Decision 3: Server-Side Gemini API Proxy for Gemma 4 Live Inference**
  - *Approach*: Express server proxy route (`/api/gemma/analyze` and `/api/gemma/alert-payload`) invoking `@google/genai` with `gemini-3.8-flash` (or user's selected Gemma model) using the PRD's exact system prompt.
  - *Why*: Keeps API keys strictly server-side, enables live conversational financial analysis, and tests the exact Gemma 4 prompt instructions on actual market ticks.
  - *Fallback*: Full offline evaluation mode if API key is not configured, generating identical deterministic JSON and WhatsApp templates.

- **Decision 4: Multi-Channel Alert Payload Architecture**
  - *Approach*: Alert triggers simultaneously update the on-screen alert banner, prepare a formatted WhatsApp message with quick-copy and `https://wa.me/?text=` share link, and emit an RFC-compliant JSON webhook payload.
  - *Why*: Directly serves the retail Pakistani investor workflow where WhatsApp groups and personal messaging are the primary mode of community alerts.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PSX Pocket Advisor Terminal                     │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ PSX Market Simulator  │  │ Dual-Trigger Price Alert Engine       │  │
│  │ - 12 Blue-Chip Tickers│  │ - Absolute Floor Monitor (< PKR)      │  │
│  │ - Banks / E&P / Fert  │  │ - Percentage Volatility Monitor (±%)  │  │
│  │ - Live Tick Generator │  │ - Multi-rule Evaluation on each Tick  │  │
│  └───────────┬───────────┘  └───────────────────┬───────────────────┘  │
│              │                                  │                      │
│              ▼                                  ▼                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Multi-Format Dispatcher & Formatter Engine                       │  │
│  │  ├─ Visual UI Alert Banner (Toast / Alert Bar)                    │  │
│  │  ├─ Native HTML5 Browser Desktop Notification (OS Popup)         │  │
│  │  ├─ WhatsApp / SMS Formatted Text (with wa.me share link)        │  │
│  │  └─ Structured JSON Webhook Payload (Zapier / Make / SMTP ready)  │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│              ┌──────────────────────┴──────────────────────┐           │
│              ▼                                             ▼           │
│  ┌─────────────────────────────┐             ┌──────────────────────┐  │
│  │ Valuation & Macro Analytics │             │ Gemma 4 Skill Center │  │
│  │ - P/E & Dividend Ranking    │             │ - System Instructions│  │
│  │ - Capital Gain vs Yield     │             │ - Live Prompt Runner │  │
│  │ - SBP / FX / Oil Scenarios  │             │ - Full Skill Export  │  │
│  └─────────────────────────────┘             └──────────┬───────────┘  │
└─────────────────────────────────────────────────────────┼──────────────┘
                                                          │ HTTP POST
                                                          ▼
                                            ┌───────────────────────────┐
                                            │ Express Backend Server    │
                                            │ /api/gemma/analyze        │
                                            │ /api/gemma/alert-payload  │
                                            │ GoogleGenAI SDK           │
                                            └───────────────────────────┘
```

- **Stock Universe Data Model**:
  ```typescript
  interface StockQuote {
    symbol: 'MEBL' | 'FABL' | 'HBL' | 'UBL' | 'MCB' | 'MARI' | 'OGDC' | 'PPL' | 'POL' | 'FFC' | 'EFERT' | 'FATIMA';
    name: string;
    sector: 'Commercial Banks' | 'Oil & Gas Exploration' | 'Fertilizers';
    currentPrice: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    previousClose: number;
    changePKR: number;
    changePercent: number;
    volume: number;
    peRatio: number;
    dividendYield: number;
    dividendPayoutFrequency: string;
    eps: number;
    bookValue: number;
    sparkline: number[];
  }
  ```

- **Alert Rule Data Model**:
  ```typescript
  interface AlertRule {
    id: string;
    symbol: string;
    type: 'ABSOLUTE_FLOOR' | 'VOLATILITY_PERCENT' | 'ABSOLUTE_CEILING';
    thresholdValue: number; // e.g. 535 PKR or -5%
    status: 'ACTIVE' | 'TRIGGERED' | 'PAUSED';
    triggeredAt?: string;
    triggerPrice?: number;
    notes?: string;
  }
  ```

- **Interactive State Transitions**:
  - Ticker update triggers recalculation across all active rules in `< 1ms`.
  - When a rule condition is met:
    - Status changes from `ACTIVE` to `TRIGGERED`.
    - Native `Notification` triggers (if permission granted).
    - Audio alert chime sounds (if enabled).
    - WhatsApp message and JSON webhook payload generated instantly.
    - Rule logged in "Triggered Alerts History" with timestamp and market snapshot.
  - Market Presets: Users can click presets ("Bank Run / Rate Cut", "Middle East Oil Spike", "Gas Price Surge", "Market Crash") to instantly verify triggers across the entire portfolio.

---

### 5. Verification Plan

- **Compilation**: Full app build verification with `compile_applet`.
- **Alert Testing**:
  - Trigger absolute floor test (e.g. drop MEBL to 530 PKR against 535 PKR threshold).
  - Trigger volatility test (e.g. simulate -5.5% drop on OGDC).
  - Verify WhatsApp format string generation, character lengths, and copy button.
  - Verify Webhook JSON payload schema compliance against PRD specs.
  - Verify Desktop OS notification permission prompt and popup firing.
- **Valuation & Macro Engine**: Verify accurate P/E and dividend sorting and sector grouping.
- **Skill Workbench**: Verify Gemma 4 system prompt preview, prompt execution test, and downloadable `SKILL.md` export.
