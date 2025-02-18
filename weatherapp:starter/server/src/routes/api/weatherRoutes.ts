import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// ✅ POST: Get weather data & save city to history
router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch weather data
    const weatherData = await WeatherService.getWeatherForCity(city);
    console.log('Weather Data:', weatherData);

    // Save city to search history
    await HistoryService.addCity(city);

    return res.json(weatherData); 
  } catch (error: unknown) {  
    console.error('Error fetching weather data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
});

// ✅ GET: Retrieve search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    return res.json(history);
  } catch (error: unknown) {  
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
});

// ✅ DELETE: Remove city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    return res.json({ message: 'City deleted from history' }); 
  } catch (error: unknown) {  
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
});

export default router;
