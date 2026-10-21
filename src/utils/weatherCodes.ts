export interface WeatherCodeInfo {
  code: number;
  label: string;
  description: string;
  iconName: 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'cloud-fog' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-snow' | 'cloud-lightning' | 'cloud-hail';
  isPrecipitation: boolean;
  isRain: boolean;
  isSnow: boolean;
  isThunderstorm: boolean;
}

export function getWeatherCodeInfo(code: number, isDay: boolean = true): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: 'Clear sky',
        description: isDay ? 'Sunny and clear conditions' : 'Clear night sky',
        iconName: isDay ? 'sun' : 'moon',
        isPrecipitation: false,
        isRain: false,
        isSnow: false,
        isThunderstorm: false,
      };
    case 1:
      return {
        code,
        label: 'Mainly clear',
        description: isDay ? 'Scattered clouds, mostly sunny' : 'Mainly clear night',
        iconName: isDay ? 'cloud-sun' : 'cloud-moon',
        isPrecipitation: false,
        isRain: false,
        isSnow: false,
        isThunderstorm: false,
      };
    case 2:
      return {
        code,
        label: 'Partly cloudy',
        description: 'Intermittent clouds and sunshine',
        iconName: isDay ? 'cloud-sun' : 'cloud-moon',
        isPrecipitation: false,
        isRain: false,
        isSnow: false,
        isThunderstorm: false,
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Heavy cloud cover throughout',
        iconName: 'cloud',
        isPrecipitation: false,
        isRain: false,
        isSnow: false,
        isThunderstorm: false,
      };
    case 45:
      return {
        code,
        label: 'Fog',
        description: 'Reduced visibility due to dense fog',
        iconName: 'cloud-fog',
        isPrecipitation: false,
        isRain: false,
        isSnow: false,
        isThunderstorm: false,
      };
    case 48:
      return {
        code,
        label: 'Depositing rime fog',
        description: 'Freezing fog coating surfaces in rime',
        iconName: 'cloud-fog',
        isPrecipitation: false,
        isRain: false,
        isSnow: false,
        isThunderstorm: false,
      };
    case 51:
      return {
        code,
        label: 'Light drizzle',
        description: 'Fine mist and gentle drizzle',
        iconName: 'cloud-drizzle',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 53:
      return {
        code,
        label: 'Moderate drizzle',
        description: 'Steady light precipitation',
        iconName: 'cloud-drizzle',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 55:
      return {
        code,
        label: 'Dense drizzle',
        description: 'Heavy mist and sustained drizzle',
        iconName: 'cloud-drizzle',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing drizzle',
        description: 'Sub-zero freezing drizzle causing icy surfaces',
        iconName: 'cloud-drizzle',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 61:
      return {
        code,
        label: 'Slight rain',
        description: 'Scattered light rain showers',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 63:
      return {
        code,
        label: 'Moderate rain',
        description: 'Consistent moderate rainfall',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 65:
      return {
        code,
        label: 'Heavy rain',
        description: 'Intense and persistent rainfall',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing rain',
        description: 'Freezing rainfall creating glazed ice',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 71:
      return {
        code,
        label: 'Slight snow fall',
        description: 'Light flurries and gentle snowflakes',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isRain: false,
        isSnow: true,
        isThunderstorm: false,
      };
    case 73:
      return {
        code,
        label: 'Moderate snow fall',
        description: 'Steadier snowfall accumulating on ground',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isRain: false,
        isSnow: true,
        isThunderstorm: false,
      };
    case 75:
      return {
        code,
        label: 'Heavy snow fall',
        description: 'Dense snowfall and reduced road visibility',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isRain: false,
        isSnow: true,
        isThunderstorm: false,
      };
    case 77:
      return {
        code,
        label: 'Snow grains',
        description: 'Small opaque ice grains falling',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isRain: false,
        isSnow: true,
        isThunderstorm: false,
      };
    case 80:
      return {
        code,
        label: 'Slight rain showers',
        description: 'Passing brief rain showers',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 81:
      return {
        code,
        label: 'Moderate rain showers',
        description: 'Brisk and intermittent rain showers',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 82:
      return {
        code,
        label: 'Violent rain showers',
        description: 'Torrential downpours and heavy gusts',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: false,
      };
    case 85:
      return {
        code,
        label: 'Slight snow showers',
        description: 'Brief passing snow flurries',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isRain: false,
        isSnow: true,
        isThunderstorm: false,
      };
    case 86:
      return {
        code,
        label: 'Heavy snow showers',
        description: 'Heavy squalls of snow and wind',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isRain: false,
        isSnow: true,
        isThunderstorm: false,
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Lightning activity with rain gusts',
        iconName: 'cloud-lightning',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: true,
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with hail',
        description: 'Severe storm with hail and intense winds',
        iconName: 'cloud-hail',
        isPrecipitation: true,
        isRain: true,
        isSnow: false,
        isThunderstorm: true,
      };
    default:
      return {
        code,
        label: 'Variable weather',
        description: 'Current atmospheric conditions',
        iconName: 'cloud',
        isPrecipitation: false,
        isRain: false,
        isSnow: false,
        isThunderstorm: false,
      };
  }
}

export function formatTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTemperatureValue(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: 'kmh' | 'mph'): string {
  if (unit === 'mph') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph * 10) / 10} mph`;
  }
  return `${Math.round(kmh * 10) / 10} km/h`;
}
