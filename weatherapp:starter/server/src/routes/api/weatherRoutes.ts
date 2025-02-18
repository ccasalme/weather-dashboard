import { Router } from 'express';
import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';

const router = Router();

// ✅ POST: Get weather data & save city to history
router.post('/', async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch weather data
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save city to search history
    await HistoryService.addCity(city);

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error retrieving weather data' });
  }
});

// ✅ GET: Retrieve search history
router.get('/history', async (req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving search history' });
  }
});

// ✅ DELETE: Remove city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.json({ message: 'City deleted from history' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting city' });
  }
});

export default router;
