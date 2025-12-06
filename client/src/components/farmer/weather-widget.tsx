import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Eye,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  name: string;
}

interface WeatherWidgetProps {
  location?: string;
}

export default function WeatherWidget({
  location = "San Francisco",
}: WeatherWidgetProps) {
  const {
    data: weather,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/weather", location],
    queryFn: async () => {
      const response = await fetch(
        `/api/weather?location=${encodeURIComponent(location)}`,
      );
      if (!response.ok) {
        throw new Error("Weather data unavailable");
      }
      return response.json();
    },
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "clouds":
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const getWeatherAdvice = (weather: WeatherData) => {
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const weatherMain = weather.weather[0].main.toLowerCase();

    if (weatherMain === "rain") {
      return "Good for irrigation - natural watering today";
    } else if (temp > 30) {
      return "High temperature - ensure adequate watering";
    } else if (humidity < 40) {
      return "Low humidity - monitor soil moisture closely";
    } else if (temp >= 20 && temp <= 25 && humidity >= 50) {
      return "Perfect growing conditions today";
    } else {
      return "Monitor crops and adjust care as needed";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5" />
            <span>Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5" />
            <span>Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Weather data currently unavailable</p>
          <p className="text-sm text-gray-400 mt-2">
            Check your location settings or try again later
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="h-5 w-5" />
          <span>Weather - {weather.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main weather display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getWeatherIcon(weather.weather[0].main)}
              <div>
                <div className="text-3xl font-bold">
                  {Math.round(weather.main.temp)}°C
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {weather.weather[0].description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Feels like</div>
              <div className="text-lg font-semibold">
                {Math.round(weather.main.feels_like)}°C
              </div>
            </div>
          </div>

          {/* Weather details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>Humidity: {weather.main.humidity}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span>Wind: {weather.wind.speed} m/s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span>Pressure: {weather.main.pressure} hPa</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>
                Visibility: {(weather.visibility / 1000).toFixed(1)} km
              </span>
            </div>
          </div>

          {/* Farming advice */}
          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-rooted-primary">
            <p className="text-sm font-medium text-rooted-primary">
              🌱 Farming Tip: {getWeatherAdvice(weather)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
