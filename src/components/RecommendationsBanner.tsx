import React from 'react';
import { Umbrella, Droplets, ThermometerSnowflake, ShieldAlert, Wind, Sparkles } from 'lucide-react';
import { WeatherRecommendation } from '../types/weather';

interface RecommendationsBannerProps {
  recommendations: WeatherRecommendation[];
}

export const RecommendationsBanner: React.FC<RecommendationsBannerProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return null;
  }

  const getIcon = (type: WeatherRecommendation['type']) => {
    switch (type) {
      case 'rain':
        return <Umbrella className="w-5 h-5 text-sky-400 shrink-0" />;
      case 'heat':
        return <Droplets className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'cold':
        return <ThermometerSnowflake className="w-5 h-5 text-cyan-300 shrink-0" />;
      case 'uv':
        return <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-indigo-300 shrink-0" />;
      case 'optimal':
        return <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  const getCardBorder = (type: WeatherRecommendation['type']) => {
    switch (type) {
      case 'rain':
        return 'border-sky-500/30 bg-sky-950/20';
      case 'heat':
        return 'border-amber-500/30 bg-amber-950/20';
      case 'cold':
        return 'border-cyan-500/30 bg-cyan-950/20';
      case 'uv':
        return 'border-amber-500/30 bg-amber-950/20';
      case 'wind':
        return 'border-indigo-500/30 bg-indigo-950/20';
      case 'optimal':
        return 'border-emerald-500/30 bg-emerald-950/20';
      default:
        return 'border-slate-800 bg-slate-900/60';
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Weather Intelligence & Advisories
        </h2>
        <span className="text-xs text-slate-500">Contextual guidance based on forecast</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border ${getCardBorder(item.type)} transition-all hover:border-slate-700 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                {getIcon(item.type)}
                <h3 className="font-semibold text-slate-100 text-sm">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium text-slate-200">{item.actionText}</span>
              <span className="text-slate-500 font-mono capitalize">{item.severity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
