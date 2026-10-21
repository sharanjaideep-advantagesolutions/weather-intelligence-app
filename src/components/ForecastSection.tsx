import React, { useState } from 'react';
import { DailyWeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { formatTemperature, formatWindSpeed, getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, SunMedium, Calendar } from 'lucide-react';

interface ForecastSectionProps {
  daily: DailyWeatherData;
  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({
  daily,
  unit,
  windUnit,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Compute 7 days of forecast
  const daysCount = Math.min(daily.time.length, 7);
  const dayIndices = Array.from({ length: daysCount }, (_, i) => i);

  // Overall min and max for temperature bar calculations
  const allMins = daily.temperature_2m_min.slice(0, 7);
  const allMaxs = daily.temperature_2m_max.slice(0, 7);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(globalMax - globalMin, 1);

  const formatDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString([], { weekday: 'short' });
  };

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const selectedDay = {
    date: daily.time[selectedDayIndex],
    maxTemp: daily.temperature_2m_max[selectedDayIndex],
    minTemp: daily.temperature_2m_min[selectedDayIndex],
    apparentMax: daily.apparent_temperature_max?.[selectedDayIndex] ?? daily.temperature_2m_max[selectedDayIndex],
    code: daily.weather_code[selectedDayIndex],
    precipProb: daily.precipitation_probability_max?.[selectedDayIndex] ?? 0,
    precipSum: daily.precipitation_sum?.[selectedDayIndex] ?? 0,
    windMax: daily.wind_speed_10m_max?.[selectedDayIndex] ?? 0,
    uvMax: daily.uv_index_max?.[selectedDayIndex] ?? 0,
    sunrise: daily.sunrise?.[selectedDayIndex],
    sunset: daily.sunset?.[selectedDayIndex],
  };

  const selectedDayInfo = getWeatherCodeInfo(selectedDay.code, true);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            7-Day Meteorological Outlook
          </h2>
        </div>
        <span className="text-xs text-slate-500">Select any day for detailed breakdown</span>
      </div>

      {/* 7 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {dayIndices.map((idx) => {
          const dateStr = daily.time[idx];
          const isSelected = idx === selectedDayIndex;
          const code = daily.weather_code[idx];
          const info = getWeatherCodeInfo(code, true);
          const max = daily.temperature_2m_max[idx];
          const min = daily.temperature_2m_min[idx];
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const wind = daily.wind_speed_10m_max?.[idx] ?? 0;

          // Bar positioning percentage
          const leftPercent = Math.max(0, ((min - globalMin) / tempRange) * 100);
          const widthPercent = Math.max(8, ((max - min) / tempRange) * 100);

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-sky-500/80 shadow-md shadow-sky-950/40 ring-1 ring-sky-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                    {formatDayName(dateStr, idx)}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatDateLabel(dateStr)}
                  </span>
                </div>

                <div className="my-2.5 flex items-center justify-between">
                  <WeatherIcon code={code} isDay={true} className="w-8 h-8" />
                  <div className="text-right">
                    <div className="text-base font-bold text-white font-mono tabular-nums">
                      {formatTemperature(max, unit)}
                    </div>
                    <div className="text-xs text-slate-400 font-mono tabular-nums">
                      {formatTemperature(min, unit)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-medium truncate mb-2" title={info.label}>
                  {info.label}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {/* Visual Temperature Range Bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                {/* Micro indicators */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1" title="Precipitation probability">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    {precipProb}%
                  </span>
                  <span className="flex items-center gap-1" title="Peak wind speed">
                    <Wind className="w-3 h-3 text-slate-500" />
                    {Math.round(wind)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspector Panel */}
      <div className="p-4 sm:p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <WeatherIcon code={selectedDay.code} isDay={true} className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>{formatDayName(selectedDay.date, selectedDayIndex)}</span>
                <span aria-hidden="true">·</span>
                <span>{formatDateLabel(selectedDay.date)}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {selectedDayInfo.label} — {selectedDayInfo.description}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0 font-mono text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Day High</span>
              <span className="text-lg font-bold text-amber-300 tabular-nums">
                {formatTemperature(selectedDay.maxTemp, unit)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Night Low</span>
              <span className="text-lg font-bold text-cyan-300 tabular-nums">
                {formatTemperature(selectedDay.minTemp, unit)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block mb-0.5">Precipitation Risk</span>
            <span className="text-sm font-bold text-white font-mono tabular-nums">
              {selectedDay.precipProb}% ({selectedDay.precipSum} mm)
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block mb-0.5">Max Wind Speed</span>
            <span className="text-sm font-bold text-white font-mono tabular-nums">
              {formatWindSpeed(selectedDay.windMax, windUnit)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block mb-0.5">Max UV Index</span>
            <span className="text-sm font-bold text-white font-mono tabular-nums flex items-center gap-1">
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              {selectedDay.uvMax.toFixed(1)} {selectedDay.uvMax > 6 ? '(High)' : '(Moderate)'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block mb-0.5">Daylight Cycle</span>
            <span className="text-xs font-mono text-slate-200 tabular-nums">
              {selectedDay.sunrise ? new Date(selectedDay.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'} to{' '}
              {selectedDay.sunset ? new Date(selectedDay.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
