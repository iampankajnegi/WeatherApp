import React, { useState, useEffect } from "react";
import axios from "axios";
import "./weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const apiKey = "YOUR_API_KEY";

  useEffect(() => {
    if (city.trim() === "") {
      setWeatherData(null);
      setError("Please enter a city name");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?q=${city}&key=${apiKey}`
        );
        const data = response.data;
        setWeatherData(data);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        setWeatherData(null);
      }

      setLoading(false);
    };

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      fetchData();
    }, 1000);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [city, apiKey, debounceTimer]);

  const handleSearch = () => {
    if (city.trim() === "") {
      setError("Please enter a city name.");
      return;
    }

    setDebounceTimer(null); // Clear any existing debounce timer
    setLoading(true);
    setError("");

    axios
      .get(`https://api.weatherapi.com/v1/current.json?q=${city}&key=${apiKey}`)
      .then((response) => {
        const data = response.data;
        setWeatherData(data);
      })
      .catch((error) => {
        setError("Error fetching data. Please try again later.");
        setWeatherData(null);
      })
      .finally(() => {
        setLoading(false);
      });
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
            <p>
              Temperature: <strong>{weatherData.current.temp_c}°C</strong>
            </p>
            <p>
              Humidity: <strong>{weatherData.current.humidity}%</strong>
            </p>
            <p>
              Condition: <strong>{weatherData.current.condition.text}</strong>
            </p>
            <p>
              Wind Speed:{" "}
              <strong>{weatherData.current.wind_kph} km/h</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
