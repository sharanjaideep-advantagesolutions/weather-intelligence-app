import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Eye,
  Compass,
  ArrowUp,
  ArrowDown,
  Clock,
} from 'lucide-react';
import { WeatherIntelligenceData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { formatTemperature, formatWindSpeed, getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  data: WeatherIntelligenceData;
  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  unit,
  windUnit,
}) => {
  const { current, daily, location } = data;
  const isDay = current.is_day === 1;
  const conditionInfo = getWeatherCodeInfo(current.weather_code, isDay);

  const maxTemp = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const minTemp = daily.temperature_2m_min?.[0] ?? current.temperature_2m;
  const sunriseTime = daily.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  const sunsetTime = daily.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  // Format local observation time
  const formattedTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: City, Condition, Main Temperature */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tracking-wider">
              <span>{location.country || 'Global Location'}</span>
              <span aria-hidden="true">·</span>
              <span>{location.admin1 || `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
                {formattedTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-1">
              {location.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
            <div className="flex items-start">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tighter tabular-nums font-mono">
                {formatTemperature(current.temperature_2m, unit)}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <WeatherIcon code={current.weather_code} isDay={isDay} className="w-7 h-7" />
                <span className="text-xl sm:text-2xl font-bold text-slate-100">
                  {conditionInfo.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                {conditionInfo.description}. Feels like{' '}
                <span className="text-slate-200 font-semibold font-mono tabular-nums">
                  {formatTemperature(current.apparent_temperature, unit)}
                </span>
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-amber-300">
                  <ArrowUp className="w-3 h-3" />
                  H: {formatTemperature(maxTemp, unit)}
                </span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <ArrowDown className="w-3 h-3" />
                  L: {formatTemperature(minTemp, unit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Environmental Metrics Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800/80">
          {/* Wind Speed */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>Wind Speed</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
              {formatWindSpeed(current.wind_speed_10m, windUnit)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>Dir: {Math.round(current.wind_direction_10m)}°</span>
            </div>
          </div>

          {/* Relative Humidity */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Humidity</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
              {current.relative_humidity_2m}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {current.relative_humidity_2m > 70 ? 'High moisture' : current.relative_humidity_2m < 30 ? 'Dry air' : 'Comfortable'}
            </div>
          </div>

          {/* Barometric Pressure */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span>Pressure</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
              {Math.round(current.surface_pressure || 1013)} hPa
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {current.surface_pressure > 1015 ? 'High pressure' : current.surface_pressure < 1005 ? 'Low pressure' : 'Steady'}
            </div>
          </div>

          {/* Cloud Cover & UV */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Cloud Cover</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
              {current.cloud_cover}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {current.cloud_cover > 80 ? 'Heavy overcast' : current.cloud_cover > 40 ? 'Partly cloudy' : 'Clear skies'}
            </div>
          </div>

          {/* Solar Times strip */}
          <div className="col-span-2 pt-2.5 mt-1 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Sunrise: <strong className="text-slate-200 font-mono font-medium">{sunriseTime}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-indigo-400" />
              <span>Sunset: <strong className="text-slate-200 font-mono font-medium">{sunsetTime}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
