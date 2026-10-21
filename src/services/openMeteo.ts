import {
  GeocodingResponse,
  GeocodingResult,
  WeatherApiResponse,
  WeatherIntelligenceData,
  WeatherRecommendation,
} from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1';

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string, count: number = 8): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding request failed with status: ${response.status}`);
  }

  const data: GeocodingResponse = await response.json();
  return data.results || [];
}

/**
 * Fallback / Reverse geocoding approximate lookup or geolocation coordinate resolution
 */
export async function getCityByCoordinates(latitude: number, longitude: number): Promise<GeocodingResult> {
  // Use bigdatacloud free client-side reverse geocoding or open-meteo nearest approximation
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        id: Math.floor(latitude * 1000 + longitude * 100),
        name: cityName,
        latitude,
        longitude,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch {
    // fallback if reverse lookup fails
  }

  return {
    id: 1,
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    country_code: '',
  };
}

/**
 * Retrieves full weather intelligence dataset from Open-Meteo Forecast API
 */
export async function fetchWeatherData(location: GeocodingResult): Promise<WeatherIntelligenceData> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation',
    'rain',
    'weather_code',
    'cloud_cover',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'is_day',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'sunrise',
    'sunset',
    'uv_index_max',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'weather_code',
    'precipitation_probability',
    'wind_speed_10m',
    'is_day',
  ].join(',');

  const url = `${FORECAST_BASE_URL}/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=${currentParams}&daily=${dailyParams}&hourly=${hourlyParams}&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather forecast request failed with status: ${response.status}`);
  }

  const data: WeatherApiResponse = await response.json();

  if (!data.current || !data.daily) {
    throw new Error('Incomplete weather data received from Open-Meteo');
  }

  return {
    location,
    current: data.current,
    daily: data.daily,
    hourly: data.hourly,
    timezone: data.timezone || 'auto',
    fetchedAt: new Date(),
  };
}

/**
 * Analyzes meteorological criteria and generates intelligence recommendations
 */
export function generateRecommendations(data: WeatherIntelligenceData): WeatherRecommendation[] {
  const recommendations: WeatherRecommendation[] = [];
  const current = data.current;
  const todayMaxTemp = data.daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayMinTemp = data.daily.temperature_2m_min?.[0] ?? current.temperature_2m;
  const todayPrecipSum = data.daily.precipitation_sum?.[0] ?? 0;
  const todayPrecipProb = data.daily.precipitation_probability_max?.[0] ?? 0;
  const todayCode = data.daily.weather_code?.[0] ?? current.weather_code;
  const todayCodeInfo = getWeatherCodeInfo(todayCode, true);
  const currentCodeInfo = getWeatherCodeInfo(current.weather_code, current.is_day === 1);
  const todayUv = data.daily.uv_index_max?.[0] ?? 0;
  const maxWind = data.daily.wind_speed_10m_max?.[0] ?? current.wind_speed_10m;

  // 1. Rain / Umbrella Recommendation
  // "Carry an umbrella if rain is expected."
  const isRainExpected =
    current.precipitation > 0 ||
    currentCodeInfo.isRain ||
    todayCodeInfo.isRain ||
    todayPrecipSum >= 0.5 ||
    todayPrecipProb >= 35;

  if (isRainExpected) {
    recommendations.push({
      id: 'umbrella-alert',
      type: 'rain',
      severity: current.precipitation > 1 || todayPrecipProb > 70 ? 'advisory' : 'warning',
      title: 'Carry an umbrella',
      description: current.precipitation > 0
        ? `Active rainfall detected (${current.precipitation} mm/h). Keep waterproof protection handy.`
        : `Rain is expected today with an estimated ${todayPrecipProb}% probability (${todayPrecipSum} mm).`,
      actionText: 'Keep umbrella or rain shell on hand',
    });
  }

  // 2. Heat / Hydration Recommendation
  // "Stay hydrated if temperature exceeds 30°C."
  const isHighHeat = current.temperature_2m >= 30 || todayMaxTemp >= 30;
  if (isHighHeat) {
    recommendations.push({
      id: 'hydration-alert',
      type: 'heat',
      severity: current.temperature_2m >= 35 || todayMaxTemp >= 35 ? 'advisory' : 'warning',
      title: 'Stay hydrated',
      description: current.temperature_2m >= 30
        ? `Current temperature is ${Math.round(current.temperature_2m)}°C (peaks at ${Math.round(todayMaxTemp)}°C). Drink plenty of water and seek shade during midday.`
        : `Temperature is projected to reach ${Math.round(todayMaxTemp)}°C later today. Prepare hydration and limit prolonged sun exposure.`,
      actionText: 'Drink water frequently & avoid heat exhaustion',
    });
  }

  // 3. Cold / Warm Clothing Recommendation
  // "Wear warm clothing if temperature is below 10°C."
  const isCold = current.temperature_2m < 10 || todayMinTemp < 10;
  if (isCold) {
    recommendations.push({
      id: 'warmth-alert',
      type: 'cold',
      severity: current.temperature_2m <= 2 || todayMinTemp <= 0 ? 'advisory' : 'warning',
      title: 'Wear warm clothing',
      description: current.temperature_2m < 10
        ? `Current ambient temperature is ${Math.round(current.temperature_2m)}°C (wind chill feels like ${Math.round(current.apparent_temperature)}°C). Layer with thermal insulation or a heavy coat.`
        : `Temperatures drop to a low of ${Math.round(todayMinTemp)}°C today. Dress in warm layers if heading out early or in the evening.`,
      actionText: 'Layer up with thermal outerwear & scarf',
    });
  }

  // 4. UV Protection Alert (if UV index exceeds 6)
  if (todayUv >= 6) {
    recommendations.push({
      id: 'uv-alert',
      type: 'uv',
      severity: todayUv >= 8 ? 'advisory' : 'info',
      title: 'High UV Radiation',
      description: `Peak UV Index reaches ${todayUv.toFixed(1)} today. Unprotected skin can burn quickly under direct sunlight.`,
      actionText: 'Apply SPF 30+ sunscreen & wear UV-rated sunglasses',
    });
  }

  // 5. High Wind Warning (if wind speed exceeds 35 km/h)
  if (maxWind >= 35 || current.wind_speed_10m >= 32) {
    recommendations.push({
      id: 'wind-alert',
      type: 'wind',
      severity: maxWind >= 50 ? 'advisory' : 'info',
      title: 'Brisk wind gusts',
      description: `Winds peaking at ${Math.round(maxWind)} km/h. Secure loose outdoor belongings and be cautious on exposed cycling routes.`,
      actionText: 'Secure outdoor items & exercise caution cycling',
    });
  }

  // 6. Optimal Conditions (if mild, dry, clear/partly cloudy)
  if (
    !isRainExpected &&
    !isHighHeat &&
    current.temperature_2m >= 17 &&
    current.temperature_2m <= 26 &&
    current.wind_speed_10m < 28
  ) {
    recommendations.push({
      id: 'optimal-conditions',
      type: 'optimal',
      severity: 'info',
      title: 'Optimal outdoor conditions',
      description: `Comfortable ${Math.round(current.temperature_2m)}°C with mild breeze and calm skies. Excellent timing for outdoor recreation and commuting.`,
      actionText: 'Great day for outdoor walks and open-air activities',
    });
  }

  return recommendations;
}
