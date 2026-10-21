import React, { useState, useEffect, useCallback } from 'react';
import {
  GeocodingResult,
  TemperatureUnit,
  WeatherIntelligenceData,
  WindSpeedUnit,
} from './types/weather';
import {
  fetchWeatherData,
  generateRecommendations,
  getCityByCoordinates,
  searchCities,
} from './services/openMeteo';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { RecommendationsBanner } from './components/RecommendationsBanner';
import { ForecastSection } from './components/ForecastSection';
import { HourlyTimeline } from './components/HourlyTimeline';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorDisplay } from './components/ErrorDisplay';
import { RefreshCw, History, ShieldCheck } from 'lucide-react';

const DEFAULT_CITY: GeocodingResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  country: 'United Kingdom',
  country_code: 'GB',
  admin1: 'England',
};

const STORAGE_KEY_UNIT = 'weather_intel_unit';
const STORAGE_KEY_RECENT = 'weather_intel_recent_cities';

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_UNIT);
    return saved === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  });

  const [windUnit, setWindUnit] = useState<WindSpeedUnit>(() => {
    return unit === 'fahrenheit' ? 'mph' : 'kmh';
  });

  const [weatherData, setWeatherData] = useState<WeatherIntelligenceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedQuery, setFailedQuery] = useState<string | undefined>(undefined);
  const [recentCities, setRecentCities] = useState<GeocodingResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep wind unit in sync with temperature unit toggle
  const handleToggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'celsius' ? 'fahrenheit' : 'celsius';
      localStorage.setItem(STORAGE_KEY_UNIT, next);
      setWindUnit(next === 'fahrenheit' ? 'mph' : 'kmh');
      return next;
    });
  };

  const saveRecentCity = useCallback((city: GeocodingResult) => {
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.name.toLowerCase() !== city.name.toLowerCase());
      const updated = [city, ...filtered].slice(0, 5);
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const loadWeatherForLocation = useCallback(async (location: GeocodingResult) => {
    setIsLoading(true);
    setErrorMessage(null);
    setFailedQuery(undefined);

    try {
      // If the location has invalid coordinates (e.g. synthetic marker from not found)
      if (location.latitude === 0 && location.longitude === 0 && location.id === -1) {
        setFailedQuery(location.name);
        setErrorMessage(`No geographic coordinates found for "${location.name}". Please verify spelling or try another city.`);
        setIsLoading(false);
        return;
      }

      const data = await fetchWeatherData(location);
      setWeatherData(data);
      saveRecentCity(location);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while fetching weather data';
      setErrorMessage(message);
      setFailedQuery(location.name);
    } finally {
      setIsLoading(false);
    }
  }, [saveRecentCity]);

  const handleSearchCityByName = async (cityName: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setFailedQuery(undefined);

    try {
      const results = await searchCities(cityName, 1);
      if (!results || results.length === 0) {
        setFailedQuery(cityName);
        setErrorMessage(`No matching city found for "${cityName}". Please check the spelling or search for another location.`);
        setIsLoading(false);
        return;
      }
      await loadWeatherForLocation(results[0]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to query Open-Meteo Geocoding service';
      setFailedQuery(cityName);
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const loc = await getCityByCoordinates(latitude, longitude);
          await loadWeatherForLocation(loc);
        } catch {
          setErrorMessage('Could not determine local weather for your position.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve location coordinates.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please use the search bar above to look up your city.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Initial load
  useEffect(() => {
    loadWeatherForLocation(DEFAULT_CITY);
  }, [loadWeatherForLocation]);

  const recommendations = weatherData ? generateRecommendations(weatherData) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Strict Top Bar Contract Header */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onQuickCitySelect={handleSearchCityByName}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search & Intelligence Sub-header */}
        <section className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Weather Intelligence Engine
            </h1>
            <p className="text-sm text-slate-400">
              High-resolution meteorological modeling & lifestyle advisories powered by Open-Meteo
            </p>
          </div>

          {/* Interactive Search Bar */}
          <SearchBar
            onSelectCity={loadWeatherForLocation}
            isLoading={isLoading}
          />

          {/* Recent Search History if present */}
          {recentCities.length > 0 && !errorMessage && (
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-slate-500">
                <History className="w-3.5 h-3.5" />
                Recent:
              </span>
              {recentCities.map((c) => (
                <button
                  key={`${c.id}-${c.latitude}`}
                  type="button"
                  onClick={() => loadWeatherForLocation(c)}
                  className="hover:text-sky-400 underline decoration-slate-700 hover:decoration-sky-400 underline-offset-4 transition-colors cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Dynamic State Rendering */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : errorMessage ? (
          <ErrorDisplay
            message={errorMessage}
            cityName={failedQuery}
            onRetry={() => {
              if (failedQuery) {
                handleSearchCityByName(failedQuery);
              } else if (weatherData) {
                loadWeatherForLocation(weatherData.location);
              } else {
                loadWeatherForLocation(DEFAULT_CITY);
              }
            }}
            onSelectSuggestedCity={(city) => handleSearchCityByName(city)}
          />
        ) : weatherData ? (
          <div className="space-y-8">
            {/* 1. Hero Current Weather Display */}
            <CurrentWeatherCard
              data={weatherData}
              unit={unit}
              windUnit={windUnit}
            />

            {/* 2. Weather Intelligence & Lifestyle Recommendations */}
            <RecommendationsBanner recommendations={recommendations} />

            {/* 3. 24-Hour Timeline */}
            <HourlyTimeline
              hourly={weatherData.hourly}
              unit={unit}
            />

            {/* 4. 7-Day Outlook */}
            <ForecastSection
              daily={weatherData.daily}
              unit={unit}
              windUnit={windUnit}
            />

            {/* Metadata Footer bar for refresh / data citation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Source: Open-Meteo API (WMO Weather Standards) · Timezone: {weatherData.timezone}
                </span>
              </div>
              <button
                type="button"
                onClick={() => loadWeatherForLocation(weatherData.location)}
                className="flex items-center gap-1.5 hover:text-slate-300 transition-colors cursor-pointer"
                title="Refresh current meteorological readings"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Updated {weatherData.fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </button>
            </div>
          </div>
        ) : null}
      </main>

      {/* Quiet Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Weather Intelligence · Meteorological forecasting and actionable advisories</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>No API key required</span>
            <span aria-hidden="true">·</span>
            <span>WMO Interpretation</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
