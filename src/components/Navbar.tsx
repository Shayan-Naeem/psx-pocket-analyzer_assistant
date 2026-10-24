import React from 'react';
import { Bell, Volume2, VolumeX, ShieldCheck, Activity, Plus } from 'lucide-react';
import { notificationService } from '../services/notificationService';

interface NavbarProps {
  activeTab: 'terminal' | 'valuation' | 'alerts' | 'macro' | 'gemma';
  setActiveTab: (tab: 'terminal' | 'valuation' | 'alerts' | 'macro' | 'gemma') => void;
  onOpenCreateRule: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  activeAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateRule,
  soundEnabled,
  setSoundEnabled,
  activeAlertCount,
}) => {
  const [permission, setPermission] = React.useState<NotificationPermission>(
    notificationService.getPermission()
  );

  const handleRequestPermission = async () => {
    const perm = await notificationService.requestPermission();
    setPermission(perm);
    if (perm === 'granted') {
      notificationService.playAlertChime();
      notificationService.dispatchNotification(
        'PSX Pocket Advisor Connected',
        'OS desktop alerts are now active for PSX price triggers.'
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('terminal')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider">
                  PSX
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                    PSX Pocket Advisor
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans -mt-0.5 whitespace-nowrap">
                    Gemma 4 Alert Assistant
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean typography) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                activeTab === 'terminal'
                  ? 'text-slate-900 font-semibold'
                  : ''
              }`}
            >
              Market Terminal
              {activeTab === 'terminal' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('valuation')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                activeTab === 'valuation'
                  ? 'text-slate-900 font-semibold'
                  : ''
              }`}
            >
              Valuation Engine
              {activeTab === 'valuation' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'text-slate-900 font-semibold'
                  : ''
              }`}
            >
              Dual-Trigger Alerts
              {activeAlertCount > 0 && (
                <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {activeAlertCount}
                </span>
              )}
              {activeTab === 'alerts' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('macro')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                activeTab === 'macro'
                  ? 'text-slate-900 font-semibold'
                  : ''
              }`}
            >
              Macro Drivers
              {activeTab === 'macro' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('gemma')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                activeTab === 'gemma'
                  ? 'text-slate-900 font-semibold'
                  : ''
              }`}
            >
              Gemma 4 Skill
              {activeTab === 'gemma' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Actions & Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop Notification Perm Button */}
            {permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                title="Enable Native Desktop OS Alerts"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-slate-600" />
                <span>Enable Desktop Popups</span>
              </button>
            )}

            {/* Audio chime toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) notificationService.playAlertChime();
              }}
              title={soundEnabled ? 'Mute alert chime' : 'Enable alert sound'}
              aria-label="Toggle alert chime"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenCreateRule}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Alert Rule</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto text-xs font-medium text-slate-600 gap-4">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`whitespace-nowrap px-1 py-1 ${activeTab === 'terminal' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''}`}
          >
            Terminal
          </button>
          <button
            onClick={() => setActiveTab('valuation')}
            className={`whitespace-nowrap px-1 py-1 ${activeTab === 'valuation' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''}`}
          >
            Valuation
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`whitespace-nowrap px-1 py-1 ${activeTab === 'alerts' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''}`}
          >
            Alerts ({activeAlertCount})
          </button>
          <button
            onClick={() => setActiveTab('macro')}
            className={`whitespace-nowrap px-1 py-1 ${activeTab === 'macro' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''}`}
          >
            Macro
          </button>
          <button
            onClick={() => setActiveTab('gemma')}
            className={`whitespace-nowrap px-1 py-1 ${activeTab === 'gemma' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''}`}
          >
            Gemma Skill
          </button>
        </div>
      </div>
    </header>
  );
};
