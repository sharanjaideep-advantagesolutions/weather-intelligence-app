import React from 'react';
import { CloudSun, Navigation } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onQuickCitySelect: (city: string) => void;
  onLocateUser: () => void;
  isLocating: boolean;
}

const QUICK_CITIES = ['London', 'Tokyo', 'New York', 'Paris', 'Sydney'];

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onQuickCitySelect,
  onLocateUser,
  isLocating,
}) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark, single-line text */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <CloudSun className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Weather Intelligence
          </span>
        </div>

        {/* Zone 2: Clean single-line quick selection links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          {QUICK_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onQuickCitySelect(city)}
              className="hover:text-slate-100 transition-colors cursor-pointer whitespace-nowrap text-xs uppercase tracking-wider font-semibold py-1"
            >
              {city}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary action cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onLocateUser}
            disabled={isLocating}
            title="Use current GPS location"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleUnit}
            aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white transition-colors cursor-pointer whitespace-nowrap tabular-nums shrink-0"
          >
            <span className={unit === 'celsius' ? 'text-sky-400 font-bold' : 'text-slate-500'}>°C</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className={unit === 'fahrenheit' ? 'text-sky-400 font-bold' : 'text-slate-500'}>°F</span>
          </button>
        </div>
      </div>
    </header>
  );
};
