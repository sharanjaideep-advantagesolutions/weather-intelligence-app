import React from 'react';
import { AlertCircle, RotateCcw, MapPinOff } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  cityName?: string;
  onRetry: () => void;
  onSelectSuggestedCity: (city: string) => void;
}

const POPULAR_RECOVERIES = ['London', 'Tokyo', 'New York', 'Paris', 'Singapore', 'Sydney'];

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  cityName,
  onRetry,
  onSelectSuggestedCity,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center space-y-5">
      <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        {cityName ? <MapPinOff className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-white">
          {cityName ? `Location "${cityName}" not found` : 'Unable to Retrieve Weather Data'}
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          {message || 'The specified city could not be found. Please check your spelling or try searching for a different city or region.'}
        </p>
      </div>

      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          <span>Try Again</span>
        </button>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <span className="text-xs text-slate-500 block mb-2.5">
          Or explore weather intelligence for popular global hubs:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_RECOVERIES.map((hub) => (
            <button
              key={hub}
              type="button"
              onClick={() => onSelectSuggestedCity(hub)}
              className="px-3 py-1 text-xs font-medium bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              {hub}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
