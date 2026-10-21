export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  country_id?: number;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  precipitation: string;
  rain: string;
  weather_code: string;
  cloud_cover: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  surface_pressure: string;
}

export interface CurrentWeatherData {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  surface_pressure: number;
  is_day: number;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  is_day: number[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentWeatherUnits;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  hourly: HourlyWeatherData;
}

export interface WeatherIntelligenceData {
  location: GeocodingResult;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  hourly: HourlyWeatherData;
  timezone: string;
  fetchedAt: Date;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface WeatherRecommendation {
  id: string;
  type: 'rain' | 'heat' | 'cold' | 'uv' | 'wind' | 'optimal';
  severity: 'info' | 'warning' | 'advisory';
  title: string;
  description: string;
  actionText: string;
}
