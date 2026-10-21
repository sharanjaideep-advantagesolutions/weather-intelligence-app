import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyWeatherData, TemperatureUnit } from '../types/weather';
import { formatTemperature, getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface HourlyTimelineProps {
  hourly: HourlyWeatherData;
  unit: TemperatureUnit;
}

export const HourlyTimeline: React.FC<HourlyTimelineProps> = ({ hourly, unit }) => {
  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return null;
  }

  // Find the closest hour index to current time
  const now = new Date();
  const currentHourStr = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentHourStr));
  if (startIndex === -1) {
    startIndex = 0;
  }

  // Show next 24 hours from current
  const next24 = hourly.time.slice(startIndex, startIndex + 24);

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            24-Hour Weather Progression
          </h2>
        </div>
        <span className="text-xs text-slate-500">Hourly atmospheric conditions</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-800">
        {next24.map((timeStr, idx) => {
          const actualIndex = startIndex + idx;
          const temp = hourly.temperature_2m[actualIndex];
          const code = hourly.weather_code[actualIndex];
          const precipProb = hourly.precipitation_probability[actualIndex] ?? 0;
          const isDay = hourly.is_day ? hourly.is_day[actualIndex] === 1 : true;
          const date = new Date(timeStr);
          const timeLabel = idx === 0 ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric' });
          const codeInfo = getWeatherCodeInfo(code, isDay);

          return (
            <div
              key={timeStr}
              className="flex-shrink-0 w-20 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-between text-center gap-2"
            >
              <span className="text-xs font-semibold text-slate-300 font-mono">
                {timeLabel}
              </span>

              <WeatherIcon code={code} isDay={isDay} className="w-6 h-6 my-1" />

              <span className="text-sm font-bold text-white font-mono tabular-nums">
                {formatTemperature(temp, unit)}
              </span>

              <div
                className="flex items-center gap-0.5 text-[11px] font-mono text-sky-400 mt-0.5"
                title={`${precipProb}% chance of rain: ${codeInfo.label}`}
              >
                <Droplets className="w-3 h-3 text-sky-400" />
                <span>{precipProb}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
