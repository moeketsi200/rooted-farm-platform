import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Droplets, Wind } from "lucide-react";

export default function WeatherWidget({ location }: { location: string }) {
  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["/api/weather", location],
    queryFn: async () => {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    retry: false
  });

  if (isLoading) {
    return <Card className="h-full"><CardContent className="p-6">Loading weather...</CardContent></Card>;
  }

  if (error || !weather) {
    return (
      <Card className="h-full bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <CloudSun className="h-5 w-5" /> Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">Weather data unavailable for {location}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-blue-400 to-blue-600 text-white border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-5 w-5" /> {weather.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</div>
          <div className="text-right">
            <p className="capitalize font-medium">{weather.weather[0].description}</p>
            <p className="text-sm opacity-90">H: {Math.round(weather.main.temp_max)}° L: {Math.round(weather.main.temp_min)}°</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white/20 p-2 rounded">
            <Droplets className="h-4 w-4" />
            <span>{weather.main.humidity}% Humidity</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 p-2 rounded">
            <Wind className="h-4 w-4" />
            <span>{weather.wind.speed} m/s Wind</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}