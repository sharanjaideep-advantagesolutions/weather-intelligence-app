import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudHail,
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = 'w-6 h-6',
}) => {
  const info = getWeatherCodeInfo(code, isDay);

  switch (info.iconName) {
    case 'sun':
      return <Sun className={`${className} text-amber-400`} aria-hidden="true" />;
    case 'moon':
      return <Moon className={`${className} text-indigo-300`} aria-hidden="true" />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-300`} aria-hidden="true" />;
    case 'cloud-moon':
      return <CloudMoon className={`${className} text-indigo-200`} aria-hidden="true" />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-300`} aria-hidden="true" />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-slate-400`} aria-hidden="true" />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-cyan-400`} aria-hidden="true" />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-sky-400`} aria-hidden="true" />;
    case 'cloud-snow':
      return <CloudSnow className={`${className} text-sky-200`} aria-hidden="true" />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-amber-400`} aria-hidden="true" />;
    case 'cloud-hail':
      return <CloudHail className={`${className} text-cyan-300`} aria-hidden="true" />;
    default:
      return <Cloud className={`${className} text-slate-300`} aria-hidden="true" />;
  }
};
