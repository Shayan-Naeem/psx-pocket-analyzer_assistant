/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StockQuote,
  StockSymbol,
  AlertRule,
  TriggeredAlertEvent,
  MacroIndicators,
  SectorType,
} from './types';
import { PSX_STOCKS, INITIAL_RULES, INITIAL_MACRO } from './data/psxStocks';
import {
  simulateMarketTick,
  applyPresetScenario,
  PresetScenario,
} from './services/marketSimulator';
import { notificationService } from './services/notificationService';
import { Navbar } from './components/Navbar';
import { MarketMetricsStrip } from './components/MarketMetricsStrip';
import { AlertBanner } from './components/AlertBanner';
import { StockTerminalView } from './components/StockTerminalView';
import { AlertSimulatorView } from './components/AlertSimulatorView';
import { ValuationEngineView } from './components/ValuationEngineView';
import { MacroInsightsView } from './components/MacroInsightsView';
import { GemmaSkillWorkbenchView } from './components/GemmaSkillWorkbenchView';
import { CreateAlertModal } from './components/CreateAlertModal';
import { AlertDetailModal } from './components/AlertDetailModal';
import { EditMacroModal } from './components/EditMacroModal';

export default function App() {
  const [stocks, setStocks] = useState<StockQuote[]>(PSX_STOCKS);
  const [macro, setMacro] = useState<MacroIndicators>(INITIAL_MACRO);
  const [rules, setRules] = useState<AlertRule[]>(INITIAL_RULES);
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlertEvent[]>([]);
  const [bannerAlerts, setBannerAlerts] = useState<TriggeredAlertEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'terminal' | 'valuation' | 'alerts' | 'macro' | 'gemma'>('terminal');
  // Default to false: PSX market is closed on Saturday / weekend; prices remain strictly static
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeSectorFilter, setActiveSectorFilter] = useState<SectorType | 'ALL'>('ALL');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditMacroOpen, setIsEditMacroOpen] = useState<boolean>(false);
  const [preselectedStock, setPreselectedStock] = useState<StockQuote | undefined>(undefined);
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState<TriggeredAlertEvent | null>(null);

  // Trigger evaluation engine
  const evaluateAlertRules = useCallback(
    (currentStocks: StockQuote[], currentRules: AlertRule[]) => {
      const activeRules = currentRules.filter((r) => r.status === 'ACTIVE');
      if (activeRules.length === 0) return;

      const newBreachedEvents: TriggeredAlertEvent[] = [];
      const updatedRules = [...currentRules];

      activeRules.forEach((rule) => {
        const stock = currentStocks.find((s) => s.symbol === rule.symbol);
        if (!stock) return;

        let isBreached = false;

        if (rule.type === 'ABSOLUTE_FLOOR') {
          if (stock.currentPrice < rule.thresholdValue) {
            isBreached = true;
          }
        } else if (rule.type === 'VOLATILITY_PERCENT') {
          if (rule.thresholdValue < 0) {
            // Negative volatility floor (e.g. drop >= 4%)
            if (stock.changePercent <= rule.thresholdValue) {
              isBreached = true;
            }
          } else {
            // Positive volatility or absolute magnitude
            if (stock.changePercent >= rule.thresholdValue) {
              isBreached = true;
            }
          }
        } else if (rule.type === 'ABSOLUTE_CEILING') {
          if (stock.currentPrice > rule.thresholdValue) {
            isBreached = true;
          }
        }

        if (isBreached) {
          // Mark rule as triggered
          const rIndex = updatedRules.findIndex((r) => r.id === rule.id);
          if (rIndex >= 0) {
            updatedRules[rIndex] = {
              ...updatedRules[rIndex],
              status: 'TRIGGERED',
              triggeredAt: new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' }),
              triggerPrice: stock.currentPrice,
            };
          }

          const now = new Date();
          const timePKT = now.toLocaleTimeString('en-PK', {
            timeZone: 'Asia/Karachi',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          const formattedPrice = stock.currentPrice.toFixed(2);
          const formattedThreshold = rule.thresholdValue.toFixed(2);
          const formattedChange = (stock.changePercent >= 0 ? '+' : '') + stock.changePercent.toFixed(2);

          const bannerText = `🚨 PSX TRIGGER: ${stock.symbol} breached ${
            rule.type === 'VOLATILITY_PERCENT' ? `${formattedThreshold}% volatility` : `floor @ ${formattedThreshold} PKR`
          }. Current: Rs. ${formattedPrice} (${formattedChange}%).`;

          const whatsappMessage = `*🔔 PSX POCKET ADVISOR ALERT: ${stock.symbol}*

*Trigger Type:* ${rule.type === 'VOLATILITY_PERCENT' ? 'Percentage Volatility Breach' : 'Absolute Price Floor Breached'}
*Current Price:* Rs. ${formattedPrice} PKR
*Threshold Rule:* ${rule.type === 'VOLATILITY_PERCENT' ? `${formattedThreshold}% Session Move` : `Below Rs. ${formattedThreshold} PKR`}
*Session Change:* ${formattedChange}%
*Time (PKT):* ${timePKT}

*Advisor Note:* Security has penetrated designated valuation floor. Review dividend yield buffer before entering.

_Educational summary only, not formal financial advice. Consult a certified broker before trading._`;

          const webhookJson = {
            event: 'PSX_PRICE_ALERT_TRIGGERED',
            timestamp: now.toISOString(),
            exchange: 'PSX',
            data: {
              symbol: stock.symbol,
              name: stock.name,
              sector: stock.sector,
              triggerType: rule.type,
              currentPricePKR: stock.currentPrice,
              thresholdPKR: rule.thresholdValue,
              percentChangeSession: stock.changePercent,
              marketTimePKT: timePKT,
            },
            status: 'TRIGGERED',
            disclaimer: 'Educational summary only, not formal financial advice. Consult a certified broker before trading.',
          };

          const newEvent: TriggeredAlertEvent = {
            id: `evt-${Date.now()}-${rule.id}`,
            ruleId: rule.id,
            symbol: stock.symbol,
            stockName: stock.name,
            triggerType: rule.type,
            thresholdValue: rule.thresholdValue,
            triggerPrice: stock.currentPrice,
            sessionChangePercent: stock.changePercent,
            timestamp: timePKT,
            banner: bannerText,
            whatsappMessage,
            webhookJson,
            deliveredChannels: {
              banner: true,
              whatsapp: true,
              webhook: true,
              osNotification: false,
            },
          };

          newBreachedEvents.push(newEvent);
        }
      });

      if (newBreachedEvents.length > 0) {
        setRules(updatedRules);
        setTriggeredAlerts((prev) => [...newBreachedEvents, ...prev]);
        setBannerAlerts((prev) => [...newBreachedEvents, ...prev]);

        // Audio & OS Notification
        if (soundEnabled) {
          notificationService.playAlertChime();
        }

        newBreachedEvents.forEach((evt) => {
          notificationService.dispatchNotification(
            `PSX Alert: ${evt.symbol} Breached`,
            `Rs. ${evt.triggerPrice.toFixed(2)} PKR (${evt.sessionChangePercent.toFixed(2)}%). Rule: ${
              evt.triggerType === 'VOLATILITY_PERCENT' ? `${evt.thresholdValue}%` : `< ${evt.thresholdValue} PKR`
            }`
          );
        });
      }
    },
    [soundEnabled]
  );

  // Background Realistic Market Tick Simulator (every 2.5s)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        const nextStocks = simulateMarketTick(prevStocks, 1.0);
        evaluateAlertRules(nextStocks, rules);
        return nextStocks;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating, rules, evaluateAlertRules]);

  // Handler for macro shock presets
  const handleApplyPreset = (scenario: PresetScenario) => {
    const result = applyPresetScenario(stocks, macro, scenario, PSX_STOCKS);
    setStocks(result.stocks);
    setMacro(result.macro);
    evaluateAlertRules(result.stocks, rules);
  };

  // Rule management
  const handleToggleRuleStatus = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          return {
            ...r,
            status: r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
          };
        }
        return r;
      })
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleSaveNewRule = (newRuleData: Omit<AlertRule, 'id' | 'createdAt'>) => {
    const newRule: AlertRule = {
      ...newRuleData,
      id: `rule-${Date.now()}-${newRuleData.symbol.toLowerCase()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRule, ...rules];
    setRules(updated);
    evaluateAlertRules(stocks, updated);
  };

  // Immediate manual breach test for any rule
  const handleManualTriggerTest = (rule: AlertRule) => {
    const targetStock = stocks.find((s) => s.symbol === rule.symbol);
    if (!targetStock) return;

    // Simulate price to cross the trigger threshold
    const testPrice =
      rule.type === 'ABSOLUTE_FLOOR'
        ? Math.round((rule.thresholdValue - 1.5) * 100) / 100
        : Math.round(targetStock.previousClose * (1 + (rule.thresholdValue - 0.5) / 100) * 100) / 100;

    const nextStocks = stocks.map((s) => {
      if (s.symbol === rule.symbol) {
        const changePKR = Math.round((testPrice - s.previousClose) * 100) / 100;
        const changePercent = Math.round(((testPrice - s.previousClose) / s.previousClose) * 10000) / 100;
        return {
          ...s,
          currentPrice: testPrice,
          changePKR,
          changePercent,
          lastTickDirection: (testPrice < s.currentPrice ? 'down' : 'up') as 'down' | 'up',
        };
      }
      return s;
    });

    setStocks(nextStocks);
    evaluateAlertRules(nextStocks, rules);
  };

  const handleSimulatePriceDrop = (symbol: StockSymbol, targetPrice: number) => {
    const nextStocks = stocks.map((s) => {
      if (s.symbol === symbol) {
        const changePKR = Math.round((targetPrice - s.previousClose) * 100) / 100;
        const changePercent = Math.round(((targetPrice - s.previousClose) / s.previousClose) * 10000) / 100;
        return {
          ...s,
          currentPrice: targetPrice,
          changePKR,
          changePercent,
          lastTickDirection: (targetPrice < s.currentPrice ? 'down' : 'up') as 'down' | 'up',
        };
      }
      return s;
    });

    setStocks(nextStocks);
    evaluateAlertRules(nextStocks, rules);
  };

  const handleResetToOfficialClose = () => {
    setStocks(PSX_STOCKS.map((s) => ({ ...s, sparkline: [...s.sparkline] })));
    setMacro(INITIAL_MACRO);
    setBannerAlerts([]);
  };

  const handleSaveMacro = (updatedMacro: MacroIndicators) => {
    setMacro(updatedMacro);
  };

  const activeAlertCount = rules.filter((r) => r.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Header (Top Bar Contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateRule={() => {
          setPreselectedStock(undefined);
          setIsCreateModalOpen(true);
        }}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeAlertCount={activeAlertCount}
      />

      {/* 2. Real-time Macro & Simulator Strip */}
      <MarketMetricsStrip
        macro={macro}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        onApplyPreset={handleApplyPreset}
        activeAlertCount={activeAlertCount}
        onOpenEditMacro={() => setIsEditMacroOpen(true)}
        onResetToOfficialClose={handleResetToOfficialClose}
      />

      {/* 3. Sticky Alert Banner on Price Breach */}
      <AlertBanner
        alerts={bannerAlerts}
        onDismiss={(id) => setBannerAlerts((prev) => prev.filter((a) => a.id !== id))}
        onOpenAlertDetails={(alert) => setSelectedAlertForDetail(alert)}
      />

      {/* 4. Main Viewport Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'terminal' && (
          <StockTerminalView
            stocks={stocks}
            rules={rules}
            activeSectorFilter={activeSectorFilter}
            setActiveSectorFilter={setActiveSectorFilter}
            onOpenGemmaAnalysis={(stock) => {
              setPreselectedStock(stock);
              setActiveTab('gemma');
            }}
            onOpenCreateRuleForStock={(stock) => {
              setPreselectedStock(stock);
              setIsCreateModalOpen(true);
            }}
            onSimulatePriceDrop={handleSimulatePriceDrop}
          />
        )}

        {activeTab === 'valuation' && (
          <ValuationEngineView
            stocks={stocks}
            onOpenGemmaAnalysis={(stock) => {
              setPreselectedStock(stock);
              setActiveTab('gemma');
            }}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertSimulatorView
            rules={rules}
            stocks={stocks}
            triggeredEvents={triggeredAlerts}
            onToggleRuleStatus={handleToggleRuleStatus}
            onDeleteRule={handleDeleteRule}
            onOpenCreateRule={() => {
              setPreselectedStock(undefined);
              setIsCreateModalOpen(true);
            }}
            onManualTriggerTest={handleManualTriggerTest}
            onSelectAlertDetails={(evt) => setSelectedAlertForDetail(evt)}
          />
        )}

        {activeTab === 'macro' && (
          <MacroInsightsView macro={macro} stocks={stocks} />
        )}

        {activeTab === 'gemma' && (
          <GemmaSkillWorkbenchView
            stocks={stocks}
            initialStock={preselectedStock}
          />
        )}
      </main>

      {/* 5. Modals */}
      <CreateAlertModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        stocks={stocks}
        initialStock={preselectedStock}
        onSaveRule={handleSaveNewRule}
      />

      <AlertDetailModal
        alert={selectedAlertForDetail}
        onClose={() => setSelectedAlertForDetail(null)}
      />

      <EditMacroModal
        isOpen={isEditMacroOpen}
        onClose={() => setIsEditMacroOpen(false)}
        currentMacro={macro}
        onSaveMacro={handleSaveMacro}
      />

      {/* 6. Clean Institutional Footer (No fake telemetry tickers or gimmicks) */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">PSX Pocket Advisor</span>
            <span>·</span>
            <span>Target Sectors: Commercial Banks, Oil & Gas Exploration, Fertilizers</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            Educational summary only, not formal financial advice. Consult a certified broker before trading.
          </div>
        </div>
      </footer>
    </div>
  );
}
