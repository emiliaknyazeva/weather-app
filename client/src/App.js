import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://weather-app-t5ye.onrender.com';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const res = await axios.get(`${API_URL}/favorites`);
    setFavorites(res.data);
  };

  const getWeather = async (targetCity = city) => {
    if (!targetCity) return;
    try {
      const res = await axios.get(
        `${API_URL}/weather?city=${encodeURIComponent(targetCity)}`
      );
      setWeather(res.data);
      setError('');
    } catch (err) {
      setWeather(null);
      setError('Город не найден');
    }
  };

  const addFavorite = async () => {
    if (!weather) return;
    const alreadyExists = favorites.some(
      (f) => f.city.toLowerCase() === weather.city.toLowerCase()
    );
    if (alreadyExists) return;

    const res = await axios.post(`${API_URL}/favorites`, weather);
    setFavorites([...favorites, res.data]);
  };

  const deleteFavorite = async (id) => {
    await axios.delete(`${API_URL}/favorites/${id}`);
    setFavorites(favorites.filter((f) => f._id !== id));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: '20px',
          }}
        >
          🌤 Weather App
        </h1>

        {/* Поле ввода */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              outline: 'none',
            }}
            type="text"
            placeholder="Введите город..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getWeather()}
          />
          <button
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: 'none',
              background: '#4facfe',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onClick={() => getWeather()}
            onMouseEnter={(e) => (e.target.style.background = '#00f2fe')}
            onMouseLeave={(e) => (e.target.style.background = '#4facfe')}
          >
            Показать
          </button>
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <p style={{ textAlign: 'center', color: 'red', marginBottom: '20px' }}>
            ❌ {error}
          </p>
        )}

        {/* Погода */}
        {weather && (
          <div
            style={{
              background: '#f5faff',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ margin: '10px 0' }}>
              {weather.city}, {weather.country}
            </h2>
            <p style={{ fontSize: '20px' }}>
              🌡 <b>{weather.temperature}°C</b>
            </p>
            <p style={{ fontStyle: 'italic' }}>☁ {weather.weather}</p>

            {favorites.some(
              (fav) => fav.city.toLowerCase() === weather.city.toLowerCase()
            ) ? (
              <button
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#c3f7c3',
                  fontSize: '14px',
                  cursor: 'default',
                  color: '#2e7d32',
                }}
                disabled
              >
                ✅ В избранном
              </button>
            ) : (
              <button
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ffd43b',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
                onClick={addFavorite}
              >
                ⭐ Добавить в избранное
              </button>
            )}
          </div>
        )}

        {/* Избранные */}
        <h2 style={{ textAlign: 'center', margin: '20px 0' }}>
          ⭐ Избранные города
        </h2>
        {favorites.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Пока нет избранных городов
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {favorites.map((fav) => (
              <li
                key={fav._id}
                style={{
                  background: '#fff8e1',
                  padding: '10px 15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setCity(fav.city);
                  getWeather(fav.city);
                }}
              >
                <span>
                  🏙 <b>{fav.city}</b> ({fav.country}) – {fav.temperature}°C
                </span>
                <button
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#ff6b6b',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFavorite(fav._id);
                  }}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
