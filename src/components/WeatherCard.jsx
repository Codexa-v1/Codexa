import { useEffect, useState } from "react";
import dayjs from "dayjs";
import React from "react";


// Custom icons
import clear from "../assets/weatherIcons/clear.png";
import clouds from "../assets/weatherIcons/clouds.png";
import drizzle from "../assets/weatherIcons/drizzle.png";
import humidityIcon from "../assets/weatherIcons/humidity.png";
import mist from "../assets/weatherIcons/mist.png";
import rain from "../assets/weatherIcons/rain.png";
import snow from "../assets/weatherIcons/snow.png";
import wind from "../assets/weatherIcons/wind.png";
import searchIcon from "../assets/weatherIcons/search.png";

export default function WeatherCard({ eventDate, location }) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(location || "");

  const fetchForecast = async (cityName) => {
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.cod !== "200") {
        setError("City not found");
        setForecast(null);
        return;
      }

      // Event date formatted
      const eventDay = dayjs(eventDate).format("YYYY-MM-DD");

      // Find forecast entry closest to 12:00 on eventDay
      const dayForecasts = data.list.filter((entry) =>
        entry.dt_txt.startsWith(eventDay)
      );

      if (dayForecasts.length === 0) {
        setError("Not available");
        setForecast(null);
        return;
      }

      // Find the forecast closest to midday (12:00:00)
      const targetHour = 12;
      let closest = dayForecasts.reduce((prev, curr) => {
        const prevHour = dayjs(prev.dt_txt).hour();
        const currHour = dayjs(curr.dt_txt).hour();
        return Math.abs(currHour - targetHour) < Math.abs(prevHour - targetHour)
          ? curr
          : prev;
      });

      setForecast({
        city: data.city.name,
        temp: closest.main.temp,
        humidity: closest.main.humidity,
        wind: closest.wind.speed,
        weather: closest.weather[0],
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching forecast");
    }
  };

  useEffect(() => {
    if (eventDate && location) {
      fetchForecast(location);
    }
  }, [eventDate, location]);

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case "clear":
        return clear;
      case "clouds":
        return clouds;
      case "drizzle":
        return drizzle;
      case "mist":
        return mist;
      case "rain":
        return rain;
      case "snow":
        return snow;
      default:
        return clear;
    }
  };

  return (
    <section className="w-full mx-auto p-6 text-center rounded-xl text-white bg-gradient-to-br from-teal-400 to-indigo-700 shadow-lg">
      <h3 className="header text-lg font-semibold mb-4">Event Day Forecast</h3>

      {error === "City not found" ? (
        <section>
          <section className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Enter city name"
              spellCheck="false"
              className="bg-white text-gray-700 px-5 py-3 h-10 rounded-full flex-1 mr-3 text-l outline-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              onClick={() => fetchForecast(city)}
              className="bg-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
            >
              <img src={searchIcon} alt="search" className="w-4" />
            </button>
          </section>
          <p className="text-sm">{error}</p>
        </section>
      ) : error === "Not available" ? (
        <p className="text-sm">Forecast not yet available for this date!</p>
      ) : forecast ? (
<<<<<<< HEAD
        <section className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-0 items-center w-full">
          {/* Left side: main weather */}
          <section className="flex flex-col items-center mb-4 sm:mb-0 sm:items-start">
=======
        <section className="flex justify-between">
          {/* Left side: main weather */}
          <section className="flex flex-col">
>>>>>>> ui-enhancement-server-implementation-testing
            <img
              src={getWeatherIcon(forecast.weather.main)}
              alt={forecast.weather.description}
              className="w-16 sm:w-18 mt-1"
            />
<<<<<<< HEAD
            <h1 className="text-xl font-semibold mt-2">
              {Math.round(forecast.temp)}°C
            </h1>
            <h2 className="text-base font-medium mt-1">{forecast.city}</h2>
          </section>

          {/* Details */}
          <section className="flex flex-col justify-between items-center sm:items-start w-full gap-4 px-2 sm:px-6">
            <p className="capitalize text-sm font-medium mb-2 sm:mb-0 text-center sm:text-left">
              {forecast.weather.description}
            </p>
            <section className="flex items-center mb-2 sm:mb-0">
              <img src={humidityIcon} alt="Humidity" className="w-6 mr-3" />
              <section className="text-left">
                <p className="text-base font-medium">{forecast.humidity}%</p>
=======
            <h1 className="text-xl font-semibold">
              {Math.round(forecast.temp)}°C
            </h1>
            <h2 className="text-l font-medium">{forecast.city}</h2>
          </section>

          {/* Details */}
          <section className="flex flex-col justify-between items-center mt-6 w-full gap-6 sm:gap-0 px-4 sm:px-6">
            <p className="capitalize text-sm font-medium">
              {forecast.weather.description}
            </p>
            <section className="flex items-center">
              <img src={humidityIcon} alt="Humidity" className="w-6 mr-3" />
              <section className="text-left">
                <p className="text-l font-medium">{forecast.humidity}%</p>
>>>>>>> ui-enhancement-server-implementation-testing
                <p className="text-xs">Humidity</p>
              </section>
            </section>

            <section className="flex items-center">
              <img src={wind} alt="Wind" className="w-6 mr-3" />
              <section className="text-left">
<<<<<<< HEAD
                <p className="text-base font-medium">
=======
                <p className="text-l font-medium">
>>>>>>> ui-enhancement-server-implementation-testing
                  {Math.round(forecast.wind)} km/h
                </p>
                <p className="text-xs">Wind Speed</p>
              </section>
            </section>
          </section>
        </section>
      ) : (
        !error && <p className="text-sm">Loading...</p>
      )}
    </section>
  );
}
