import { useEffect, useState } from "react";
import dayjs from "dayjs";

// Custom icons
import clear from "../assets/weatherIcons/clear.png";
import clouds from "../assets/weatherIcons/clouds.png";
import drizzle from "../assets/weatherIcons/drizzle.png";
import humidityIcon from "../assets/weatherIcons/humidity.png";
import mist from "../assets/weatherIcons/mist.png";
import rain from "../assets/weatherIcons/rain.png";
import snow from "../assets/weatherIcons/snow.png";
import wind from "../assets/weatherIcons/wind.png";

export default function WeatherCard({ eventDate, location }) {
  const apiKey = "c4a23937b30023227056d520a20252db";
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventDate || !location) return;

    const fetchForecast = async () => {
      try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
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
          setError("Forecast not yet available for this date");
          setForecast(null);
          return;
        }

        // Find the forecast closest to midday (12:00:00)
        const targetHour = 12;
        let closest = dayForecasts.reduce((prev, curr) => {
          const prevHour = dayjs(prev.dt_txt).hour();
          const currHour = dayjs(curr.dt_txt).hour();
          return Math.abs(currHour - targetHour) <
            Math.abs(prevHour - targetHour)
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

    fetchForecast();
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
    <section className="w-11/12 max-w-md mx-auto mt-8 p-6 text-center rounded-2xl text-white bg-gradient-to-br from-teal-400 to-indigo-700 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Event Day Forecast</h3>

      {error && <p className="text-sm">{error}</p>}

      {forecast && (
        <section className="flex flex-col items-center">
          <img
            src={getWeatherIcon(forecast.weather.main)}
            alt={forecast.weather.description}
            className="w-28 sm:w-32 mt-4"
          />
          <h1 className="text-4xl font-semibold mt-2">
            {Math.round(forecast.temp)}°C
          </h1>
          <h2 className="text-xl font-medium mt-1">{forecast.city}</h2>
          <p className="capitalize text-sm">{forecast.weather.description}</p>

          {/* Details */}
          <section className="flex flex-col sm:flex-row justify-between items-center mt-6 w-full gap-6 sm:gap-0 px-4 sm:px-6">
            <section className="flex items-center">
              <img src={humidityIcon} alt="Humidity" className="w-8 mr-3" />
              <section className="text-left">
                <p className="text-lg font-medium">{forecast.humidity}%</p>
                <p className="text-xs">Humidity</p>
              </section>
            </section>

            <section className="flex items-center">
              <img src={wind} alt="Wind" className="w-8 mr-3" />
              <section className="text-left">
                <p className="text-lg font-medium">
                  {Math.round(forecast.wind)} km/h
                </p>
                <p className="text-xs">Wind Speed</p>
              </section>
            </section>
          </section>
        </section>
      )}
    </section>
  );
}
