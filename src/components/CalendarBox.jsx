import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getAllEvents } from "@/backend/api/EventData";

const Calendar = ({ onDayClick }) => {
  // Color mapping for event categories
  const eventColors = React.useMemo(
    () => ({
      Wedding: "bg-pink-500",
      Conference: "bg-yellow-700",
      Birthday: "bg-blue-500",
      Meeting: "bg-green-500",
      Party: "bg-purple-500",
      Other: "bg-gray-400",
    }),
    []
  );

  // Helper to get color for event
  const getBgColor = React.useCallback(
    (category) => eventColors[category] || eventColors["Other"],
    [eventColors]
  );
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

  const { user, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then((data) => {
          // Add bgColor property to each event
          const mapped = data.map((ev) => ({
            ...ev,
            bgColor: getBgColor(ev.category),
          }));
          setEvents(mapped);
        })
        .catch((err) => console.error("Failed to fetch events:", err));
    }
  }, [isAuthenticated, user, getBgColor]);

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
          const dateObj = new Date(currentYear, currentMonth, day + 1);
          const dateStr = dayjs(
            new Date(currentYear, currentMonth, day + 1)
          ).format("YYYY-MM-DD");
          const eventsForDay = events.filter(
            (ev) => dayjs(ev.date).format("YYYY-MM-DD") === dateStr
          );
          return (
            <span
              key={day + 1}
              onClick={() => onDayClick && onDayClick(dateObj)}
              className="h-12 flex flex-col justify-center items-center text-gray-800 text-base sm:text-lg cursor-pointer hover:bg-gray-100 rounded border border-gray-400 relative group"
            >
              <span>{day + 1}</span>
              {/* Show color dots for each event on this day */}
              {eventsForDay.length > 0 && (
                <span className="flex gap-1 mt-1">
                  {eventsForDay.map((ev, idx) => (
                    <span
                      key={idx}
                      className={`w-3 h-3 rounded-full ${ev.bgColor}`}
                    ></span>
                  ))}
                </span>
              )}
              {/* Tooltip for events */}
              {eventsForDay.length > 0 && (
                <section className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 bg-white border border-gray-300 rounded shadow-lg p-2 min-w-[180px] text-xs text-gray-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                  <div className="font-bold mb-1">Events:</div>
                  <ul>
                    {eventsForDay.map((ev, idx) => (
                      <li key={idx} className="mb-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 align-middle ${ev.bgColor}`}
                        ></span>
                        <span className="font-semibold">{ev.title}</span>{" "}
                        <span className="text-gray-500">
                          ({ev.category || ev.type})
                        </span>
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
