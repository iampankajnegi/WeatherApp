import { useState, useEffect } from "react";
import axios from "axios";
import "./weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "37454a6382fc47caab2111239240605";

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (city.trim() === "") {
        setWeatherData(null);
        setError("Please enter the city name");
        return;
      }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [city]);

  const getWeather = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?q=${city}&key=${apiKey}`
      );
      const data = await response.data;
      setWeatherData(data);
    } catch (error) {
      setError("Error fetching data. Please try again later.");
      setWeatherData(null);
    }

    setLoading(false);
  };

  const handleSearch = () => {
    if (city.trim() === "") {
      setError("Please enter the city name.");
      return;
    }
    getWeather();
  };

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="weather-container">
      <div className="weather-bar">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleChange}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>
      {loading && <p className="loading-msg">Loading data...</p>}
      {error && <p className="error-msg">{error}</p>}
      <div className="weather-cards">
        {weatherData && (
          <div className="weather-card">
            <p>Temperature: <span>{weatherData.current.temp_c}°C</span></p>
            <p>Humidity: <span>{weatherData.current.humidity}%</span></p>
            <p>Condition: <span>{weatherData.current.condition.text}</span></p>
            <p>Wind Speed: <span>{weatherData.current.wind_kph} km/h</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
