import { WeatherType } from './world';

/**
 * Fetches real-time weather for a location using:
 *  1. Open-Meteo Geocoding API  (city name → lat/lon)
 *  2. Open-Meteo Forecast API   (lat/lon → WMO weather code)
 *
 * Both APIs are free and require NO API key.
 * Returns undefined on any error so the caller can use its own activity-based logic.
 */
export async function fetchRealWeather(location: string): Promise<WeatherType | undefined> {
  if (!location || location.trim() === '') return undefined;

  try {
    // Step 1: Geocode city name
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location.trim())}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) return undefined;

    const geoJson = await geoRes.json() as { results?: { latitude: number; longitude: number; name: string }[] };
    if (!geoJson.results || geoJson.results.length === 0) {
      console.warn(`[GitWorld] Location "${location}" not found, using activity-based weather.`);
      return undefined;
    }

    const { latitude, longitude, name } = geoJson.results[0];
    console.log(`[GitWorld] 🌍 Resolved: ${name} (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);

    // Step 2: Fetch current weather code
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
    const wRes = await fetch(weatherUrl);
    if (!wRes.ok) return undefined;

    const wJson = await wRes.json() as { current_weather?: { weathercode: number; temperature: number } };
    if (!wJson.current_weather) return undefined;

    const { weathercode, temperature } = wJson.current_weather;
    const type = mapWMOCode(weathercode, temperature);
    console.log(`[GitWorld] 🌡️  ${name}: WMO code=${weathercode}, temp=${temperature}°C → ${type}`);
    return type;

  } catch (err) {
    console.warn(`[GitWorld] Weather fetch failed: ${err}. Using activity-based fallback.`);
    return undefined;
  }
}

/**
 * Maps WMO weather codes to WeatherType.
 * https://open-meteo.com/en/docs#weathervariables
 *
 * 0        = clear sky
 * 1–3      = mainly clear / partly cloudy / overcast
 * 45,48    = fog
 * 51–67    = drizzle / rain
 * 71–77    = snow
 * 80–82    = rain showers
 * 85,86    = snow showers
 * 95–99    = thunderstorm
 */
function mapWMOCode(code: number, temperature: number): WeatherType {
  // Explicit snow codes
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  // Sub-zero precipitation → snow
  if (temperature < 2 && [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'snow';
  // Rain: drizzle, rain, showers, thunderstorm
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return 'rain';
  return 'clear';
}
