import React, { useState } from "react";
import dayjs from "dayjs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Calendar = () => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the number of days in the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Get the first day of the month (0-6, where 0 is Sunday)

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? currentYear + 1 : prevYear
    );
  };

  // Sample events data
  const events = [
    {
      type: "Wedding",
      title: "Emily & Jake’s Wedding",
      date: "2025-08-18T09:00:00",
      location: "Riverside Mansion",
      bgColor: "bg-pink-500",
    },
    {
      type: "Conference",
      title: "Business Conference",
      date: "2025-08-18T11:00:00",
      location: "Wits Sport Conference Center",
      bgColor: "bg-yellow-700",
    },
    {
      type: "Birthday",
      title: "John’s 30th Birthday",
      date: "2025-08-26T15:00:00",
      location: "The Beach",
      bgColor: "bg-blue-500",
    },
  ];

  return (
    <section className="w-full h-full">
      {/* Month & Year Navigation */}
      <section className="flex items-center gap-2 my-14">
        <h2 className="text-2xl sm:text-3xl font-bold pl-5 text-green-900">
          {monthsOfYear[currentMonth]},
        </h2>
        <h2 className="text-2xl sm:text-3xl font-bold text-green-900">
          {currentYear}
        </h2>

        <section className="flex gap-4 ml-auto">
          <button
            onClick={prevMonth}
            className="w-14 h-14 bg-gray-100 rounded-full flex justify-center items-center text-2xl text-gray-800 hover:bg-gray-200"
          >
            <HiChevronLeft />
          </button>
          <button
            onClick={nextMonth}
            className="w-14 h-14 bg-gray-100 rounded-full flex justify-center items-center text-2xl text-gray-800 hover:bg-gray-200"
          >
            <HiChevronRight />
          </button>
        </section>
      </section>

      {/* Weekdays */}
      <section className="grid grid-cols-7 my-12">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className="font-bold uppercase text-gray-800 tracking-wider flex justify-center items-center text-sm sm:text-base h-10"
          >
            {day}
          </span>
        ))}
      </section>

      {/* Days */}
      <section className="grid grid-cols-7 gap-1">
        {[...Array(firstDayOfMonth).keys()].map((_, index) => (
          <span
            key={`empty-${index}`}
            className="h-12 flex justify-center items-center text-gray-800 text-base sm:text-lg rounded border border-gray-300"
          />
        ))}
        {[...Array(daysInMonth).keys()].map((day) => {
          const dateStr = dayjs(new Date(currentYear, currentMonth, day + 1)).format("YYYY-MM-DD");
          const eventsForDay = events.filter(ev => dayjs(ev.date).format("YYYY-MM-DD") === dateStr);
          return (
            <span
              key={day + 1}
              className="h-12 flex flex-col justify-center items-center text-gray-800 text-base sm:text-lg cursor-pointer hover:bg-gray-100 rounded border border-gray-400 relative group"
            >
              <span>{day + 1}</span>
              {eventsForDay.length > 0 && (
                <span className={`w-4 h-1 mt-1 rounded ${eventsForDay[0].bgColor}`}></span>
              )}
              {/* Tooltip for events */}
              {eventsForDay.length > 0 && (
                <section className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 bg-white border border-gray-300 rounded shadow-lg p-2 min-w-[180px] text-xs text-gray-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                  <div className="font-bold mb-1">Events:</div>
                  <ul>
                    {eventsForDay.map((ev, idx) => (
                      <li key={idx} className="mb-1">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 align-middle ${ev.bgColor}`}></span>
                        <span className="font-semibold">{ev.title}</span> <span className="text-gray-500">({ev.type})</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </span>
          );
        })}
      </section>
    </section>
  );
};

export default Calendar;
