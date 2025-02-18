import fs from 'fs/promises';
import path from 'path';

// Define a City class
class City {
  constructor(public id: string, public name: string) {}
}

// Define the file path for storing history
const filePath = path.join(__dirname, '../../data/searchHistory.json');

class HistoryService {
  // Read from the JSON file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      return []; // Return an empty array if file doesn't exist or is empty
    }
  }

  // Write to the JSON file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(cities, null, 2), 'utf-8');
  }

  // Get all stored cities
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // Add a new city to history
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(Date.now().toString(), cityName);
    cities.push(newCity);
    await this.write(cities);
  }

  // Remove a city by ID
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
