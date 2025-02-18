import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface Forecast {
  date: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  description: string;
  icon: string;
}

class WeatherService {
  private baseGeoURL = 'http://api.openweathermap.org/geo/1.0';
  private baseWeatherURL = 'https://api.openweathermap.org/data/2.5/weather';
  private baseForecastURL = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiKey = process.env.WEATHER_API_KEY || '';

  // Fetch location data
  private async fetchLocationData(city: string): Promise<{ lat: number; lon: number; name: string }> {
    try {
      const response = await axios.get(
        `${this.baseGeoURL}/direct?q=${city}&limit=1&appid=${this.apiKey}`
      );
  
      if (!response.data.length) throw new Error('Location not found');
  
      const { lat, lon, name } = response.data[0]; // Extract and return name
      return { lat, lon, name };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch location data: ${errorMessage}`);
    }
  }
  

  // Fetch current weather data
  private async fetchWeatherData(
    coordinates: { lat: number; lon: number; name: string }
  ): Promise<Weather> {
    try {
      console.log('API KEY:', this.apiKey);
      const response = await axios.get(
        `${this.baseWeatherURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`
      );
  
      const { main, weather, wind } = response.data;
  
      return {
        city: coordinates.name, // Use the correct name from fetchLocationData
        temperature: main.temp,
        description: weather[0].description,
        humidity: main.humidity,
        windSpeed: wind.speed,
        icon: weather[0].icon,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch weather data: ${errorMessage}`);
    }
  }

  // Fetch 5-day forecast
  private async fetchForecastData(coordinates: Coordinates): Promise<Forecast[]> {
    try {
      const response = await axios.get(
        `${this.baseForecastURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`
      );

      // Filter data to only include one forecast per day (at 12:00 PM)
      const forecastList = response.data.list
        .filter((entry: any) => entry.dt_txt.includes('12:00:00'))
        .map((entry: any) => ({
          date: entry.dt_txt.split(' ')[0],
          temperature: entry.main.temp,
          windSpeed: entry.wind.speed,
          humidity: entry.main.humidity,
          description: entry.weather[0].description,
          icon: entry.weather[0].icon,
        }));

      return forecastList;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch forecast data: ${errorMessage}`);
    }
  }

  // Get weather for a city (current + forecast)
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Forecast[] }> {
    try {
      console.log('Fetching weather for:', city);
      const locationData = await this.fetchLocationData(city); // Get lat, lon, name
      const currentWeather = await this.fetchWeatherData(locationData); // Pass correct name
      const forecast = await this.fetchForecastData(locationData);
  
      return { current: currentWeather, forecast };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error retrieving weather: ${errorMessage}`);
    }
  }
}

export default new WeatherService();
