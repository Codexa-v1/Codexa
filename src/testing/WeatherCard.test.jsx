// src/Testing/WeatherCard.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import WeatherCard from "../components/WeatherCard";
import React from "react";
import dayjs from "dayjs";

// Mock fetch globally
global.fetch = vi.fn();

describe("WeatherCard", () => {
  const eventDate = "2025-09-01T12:00:00";
  const location = "London";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders loading state initially", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ cod: "200", list: [], city: { name: "X" } }),
    });

    render(<WeatherCard eventDate={eventDate} location={location} />);
    // Use findByText for async state updates to avoid act warning
    expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders forecast when API returns valid data", async () => {
    const mockData = {
      cod: "200",
      city: { name: "London" },
      list: [
        {
          dt_txt: dayjs(eventDate).hour(12).format("YYYY-MM-DD HH:00:00"),
          main: { temp: 20, humidity: 50 },
          wind: { speed: 10 },
          weather: [{ main: "Clear", description: "clear sky" }],
        },
      ],
    };

    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockData) });

    render(<WeatherCard eventDate={eventDate} location={location} />);

    expect(await screen.findByText(/20°C/)).toBeInTheDocument();
    expect(screen.getByText(/London/)).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    expect(screen.getByText(/10 km\/h/)).toBeInTheDocument();
  });

  it("renders 'City not found' error when API returns error", async () => {
    const mockData = { cod: "404" };
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockData) });

    render(<WeatherCard eventDate={eventDate} location={location} />);

    expect(await screen.findByText(/City not found/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter city name/i)).toBeInTheDocument();
  });

  it("allows retrying search after city not found", async () => {
    fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve({ cod: "404" }) }) // First fail
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            cod: "200",
            city: { name: "Paris" },
            list: [
              {
                dt_txt: dayjs(eventDate)
                  .hour(12)
                  .format("YYYY-MM-DD HH:00:00"),
                main: { temp: 25, humidity: 60 },
                wind: { speed: 15 },
                weather: [{ main: "Clouds", description: "broken clouds" }],
              },
            ],
          }),
      });

    render(<WeatherCard eventDate={eventDate} location={location} />);

    // Error first
    expect(await screen.findByText(/City not found/i)).toBeInTheDocument();

    // Enter new city
    fireEvent.change(screen.getByPlaceholderText(/Enter city name/i), {
      target: { value: "Paris" },
    });
    fireEvent.click(screen.getByRole("button"));

    expect(await screen.findByText(/25°C/)).toBeInTheDocument();
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
  });

  it("renders 'Forecast not yet available' when no data matches event date", async () => {
    const mockData = {
      cod: "200",
      city: { name: "London" },
      list: [
        {
          dt_txt: "2025-08-31 12:00:00", // wrong date
          main: { temp: 15, humidity: 40 },
          wind: { speed: 5 },
          weather: [{ main: "Mist", description: "misty" }],
        },
      ],
    };

    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockData) });

    render(<WeatherCard eventDate={eventDate} location={location} />);

    expect(
      await screen.findByText(/Forecast not yet available/i)
    ).toBeInTheDocument();
  });

  it("renders nothing except header on fetch failure", async () => {
    // Silence expected console error for test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<WeatherCard eventDate={eventDate} location={location} />);

    expect(await screen.findByText(/Event Day Forecast/i)).toBeInTheDocument();
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/°C/)).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
