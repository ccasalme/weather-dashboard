import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ ES Module Fix: Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../../data/searchHistory.json');

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
// Read from the JSON file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // If the file doesn't exist, create it with an empty array
        await fs.writeFile(filePath, '[]', 'utf-8');
        return [];
      }
    throw error;
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
