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
}

class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.WEATHER_API_KEY || '';

  // Fetch location data
  private async fetchLocationData(city: string): Promise<Coordinates> {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
      );
      if (!response.data.length) throw new Error('Location not found');

      const { lat, lon } = response.data[0];
      return { lat, lon };
    } catch (error) {
      throw new Error(`Failed to fetch location data: ${error.message}`);
    }
  }

  // Fetch weather data
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
    try {
      const response = await axios.get(
        `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`
      );

      const { name, main, weather, wind } = response.data;
      return {
        city: name,
        temperature: main.temp,
        description: weather[0].description,
        humidity: main.humidity,
        windSpeed: wind.speed
      };
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  // Get weather for a city
  async getWeatherForCity(city: string): Promise<Weather> {
    try {
      const coordinates = await this.fetchLocationData(city);
      return await this.fetchWeatherData(coordinates);
    } catch (error) {
      throw new Error(`Error retrieving weather: ${error.message}`);
    }
  }
}

export default new WeatherService();
