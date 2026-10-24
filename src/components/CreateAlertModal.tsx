import React from 'react';
import { StockQuote, StockSymbol, TriggerType, AlertRule } from '../types';
import { X, Bell, Plus, Check } from 'lucide-react';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockQuote[];
  onSaveRule: (rule: Omit<AlertRule, 'id' | 'createdAt'>) => void;
  initialStock?: StockQuote;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSaveRule,
  initialStock,
}) => {
  const [symbol, setSymbol] = React.useState<StockSymbol>(
    initialStock ? initialStock.symbol : 'MEBL'
  );
  const [triggerType, setTriggerType] = React.useState<TriggerType>('ABSOLUTE_FLOOR');
  const [thresholdValue, setThresholdValue] = React.useState<string>('535.00');
  const [note, setNote] = React.useState<string>('Valuation accumulation zone');

  React.useEffect(() => {
    if (initialStock) {
      setSymbol(initialStock.symbol);
      const defaultFloor = Math.round(initialStock.currentPrice * 0.97 * 100) / 100;
      setThresholdValue(defaultFloor.toFixed(2));
    }
  }, [initialStock]);

  if (!isOpen) return null;

  const currentStock = stocks.find((s) => s.symbol === symbol) || stocks[0];

  const handleStockChange = (newSym: StockSymbol) => {
    setSymbol(newSym);
    const selected = stocks.find((s) => s.symbol === newSym);
    if (selected) {
      if (triggerType === 'ABSOLUTE_FLOOR') {
        const defaultFloor = Math.round(selected.currentPrice * 0.97 * 100) / 100;
        setThresholdValue(defaultFloor.toFixed(2));
      } else if (triggerType === 'VOLATILITY_PERCENT') {
        setThresholdValue('-4.5');
      } else {
        const defaultCeiling = Math.round(selected.currentPrice * 1.05 * 100) / 100;
        setThresholdValue(defaultCeiling.toFixed(2));
      }
    }
  };

  const handleTriggerTypeChange = (type: TriggerType) => {
    setTriggerType(type);
    if (type === 'ABSOLUTE_FLOOR') {
      const defaultFloor = Math.round(currentStock.currentPrice * 0.97 * 100) / 100;
      setThresholdValue(defaultFloor.toFixed(2));
    } else if (type === 'VOLATILITY_PERCENT') {
      setThresholdValue('-4.5');
    } else {
      const defaultCeiling = Math.round(currentStock.currentPrice * 1.05 * 100) / 100;
      setThresholdValue(defaultCeiling.toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(thresholdValue);
    if (isNaN(val)) return;

    onSaveRule({
      symbol,
      type: triggerType,
      thresholdValue: val,
      status: 'ACTIVE',
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded border border-slate-200 max-w-md w-full shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded text-slate-800">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-bold text-slate-900">
              Create Price Alert Rule
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Security Dropdown */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Select Security (12 PSX Blue Chips)</label>
            <select
              value={symbol}
              onChange={(e) => handleStockChange(e.target.value as StockSymbol)}
              className="w-full p-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <optgroup label="Commercial Banks">
                {stocks
                  .filter((s) => s.sector === 'Commercial Banks')
                  .map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} - {s.name} (Rs. {s.currentPrice.toFixed(2)})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Oil & Gas Exploration">
                {stocks
                  .filter((s) => s.sector === 'Oil & Gas Exploration')
                  .map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} - {s.name} (Rs. {s.currentPrice.toFixed(2)})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Fertilizers">
                {stocks
                  .filter((s) => s.sector === 'Fertilizers')
                  .map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} - {s.name} (Rs. {s.currentPrice.toFixed(2)})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Trigger Type Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Trigger Mechanism</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTriggerTypeChange('ABSOLUTE_FLOOR')}
                className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                  triggerType === 'ABSOLUTE_FLOOR'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-sans">Absolute Floor</div>
                <div className="text-[10px] text-slate-500 font-normal">
                  Triggers below PKR price
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerTypeChange('VOLATILITY_PERCENT')}
                className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                  triggerType === 'VOLATILITY_PERCENT'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-sans">Volatility Spike</div>
                <div className="text-[10px] text-slate-500 font-normal">
                  Triggers on ±% intraday move
                </div>
              </button>
            </div>
          </div>

          {/* Threshold Value Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">
              {triggerType === 'ABSOLUTE_FLOOR' ? 'Floor Target Price (PKR)' : 'Volatility Limit (%)'}
            </label>
            <div className="relative">
              <input
                type="number"
                step={triggerType === 'VOLATILITY_PERCENT' ? '0.1' : '0.5'}
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                required
                className="w-full p-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder={triggerType === 'ABSOLUTE_FLOOR' ? '535.00' : '-5.0'}
              />
              <span className="absolute right-3 top-2 text-slate-400 font-mono text-xs">
                {triggerType === 'ABSOLUTE_FLOOR' ? 'PKR' : '%'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Current price: Rs. {currentStock.currentPrice.toFixed(2)} PKR
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Strategy Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              placeholder="e.g. Dividend reinvestment target"
            />
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
              Save & Activate Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
