const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000; // оставим другой порт, чтобы не конфликтовало

// ✅ Настройки
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ✅ Подключаем MongoDB Atlas
const MONGO_URI = 'mongodb+srv://Emilia:dagzaq-zypvys-pawNy9@cluster0.t3d2n5j.mongodb.net/day6_weather?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ✅ Схема избранных городов
const favoriteSchema = new mongoose.Schema({
  city: String,
  country: String,
  temperature: Number
});
const Favorite = mongoose.model('Favorite', favoriteSchema);

// ✅ API ключ Weatherstack
const WEATHERSTACK_KEY = '9fcac51c7af4d92ae361a2c5bc33342b';

// ✅ Маршрут для получения погоды
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const response = await axios.get(
      `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_KEY}&query=${city}`
    );

    const data = response.data;

    if (!data.current) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({
      city: data.location.name,
      country: data.location.country,
      temperature: data.current.temperature,
      weather: data.current.weather_descriptions[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Weather API error' });
  }
});

// ✅ CRUD избранных городов
app.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  res.json(favorites);
});

app.post('/favorites', async (req, res) => {
  const { city, country, temperature } = req.body;
  const fav = new Favorite({ city, country, temperature });
  await fav.save();
  res.status(201).json(fav);
});

app.delete('/favorites/:id', async (req, res) => {
  const deleted = await Favorite.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json(deleted);
});

// ✅ Запуск сервера
app.listen(PORT, () => console.log(`✅ Weather API running on http://localhost:${PORT}`));
