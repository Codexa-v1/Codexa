import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getAllEvents } from "@/backend/api/EventData";

const Calendar = ({ onDayClick }) => {
  const eventColors = React.useMemo(
    () => ({
      Wedding: "bg-pink-500",
      Birthday: "bg-blue-500",
      Party: "bg-red-500",
      Conference: "bg-yellow-500",
      Meeting: "bg-green-500",
      Sport: "bg-purple-500",
      Concert: "bg-indigo-500",
      Festival: "bg-orange-500",
      Workshop: "bg-teal-500",
      Networking: "bg-lime-500",
      Holiday: "bg-rose-500",
      Fundraiser: "bg-amber-500",
      Graduation: "bg-cyan-500",
      Other: "bg-gray-500",
    }),
    []
  );

  const getBgColor = React.useCallback(
    (category) => eventColors[category] || eventColors["Other"],
    [eventColors]
  );

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthsOfYear = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    setCurrentYear((y) => (currentMonth === 0 ? y - 1 : y));
  };

  const nextMonth = () => {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    setCurrentYear((y) => (currentMonth === 11 ? currentYear + 1 : y));
  };

  const { user, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then((data) => {
          setEvents(
            data.map((ev) => ({ ...ev, bgColor: getBgColor(ev.category) }))
          );
        })
        .catch((err) => console.error("Failed to fetch events:", err));
    }
  }, [isAuthenticated, user, getBgColor]);

  return (
    <section className="w-full h-full px-1 sm:px-4">
      {/* Month & Year Navigation */}
      <section className="flex flex-col sm:flex-row items-center gap-2 my-6 sm:my-12">
        <h2 className="text-xl sm:text-3xl font-bold pl-2 sm:pl-5 text-green-900">
          {monthsOfYear[currentMonth]},
        </h2>
        <h2 className="text-xl sm:text-3xl font-bold text-green-900">
          {currentYear}
        </h2>

        <section className="flex gap-2 sm:gap-4 ml-auto">
          <button
            onClick={prevMonth}
            className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-100 rounded-full flex justify-center items-center text-lg sm:text-2xl text-gray-800 hover:bg-gray-200"
          >
            <HiChevronLeft />
          </button>
          <button
            onClick={nextMonth}
            className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-100 rounded-full flex justify-center items-center text-lg sm:text-2xl text-gray-800 hover:bg-gray-200"
          >
            <HiChevronRight />
          </button>
        </section>
      </section>

      {/* Weekdays */}
      <section className="grid grid-cols-7 my-4 sm:my-8">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className="font-bold uppercase text-gray-800 tracking-wider flex justify-center items-center text-xs sm:text-base h-8 sm:h-10"
          >
            {day}
          </span>
        ))}
      </section>

      {/* Days Grid */}
      <section className="grid grid-cols-7 gap-1">
        {/* Empty slots for padding */}
        {[...Array(firstDayOfMonth).keys()].map((_, i) => (
          <span
            key={`empty-${i}`}
            className="h-10 sm:h-12 flex justify-center items-center text-gray-800 text-xs sm:text-sm border border-gray-200 rounded"
          />
        ))}
        {/* Actual days */}
        {[...Array(daysInMonth).keys()].map((day) => {
          const dateObj = new Date(currentYear, currentMonth, day + 1);
          const dateStr = dayjs(dateObj).format("YYYY-MM-DD");
          const eventsForDay = events.filter(
            (ev) => dayjs(ev.date).format("YYYY-MM-DD") === dateStr
          );
          return (
            <span
              key={day + 1}
              onClick={() => onDayClick && onDayClick(dateObj)}
              className="
                h-10 sm:h-12 flex flex-col justify-center items-center
                text-gray-800 text-xs sm:text-sm cursor-pointer
                hover:bg-gray-100 rounded border border-gray-300 relative group
              "
            >
              <span>{day + 1}</span>

              {eventsForDay.length > 0 && (
                <span className="flex gap-0.5 sm:gap-1 mt-1">
                  {eventsForDay.map((ev, idx) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${ev.bgColor}`}
                    ></span>
                  ))}
                </span>
              )}

              {eventsForDay.length > 0 && (
                <section
                  className="
                    absolute left-1/2 -translate-x-1/2 top-full mt-1 sm:mt-2
                    z-10 bg-white border border-gray-300 rounded shadow-lg
                    p-1 sm:p-2 min-w-[140px] sm:min-w-[180px]
                    text-[10px] sm:text-xs text-gray-800
                    opacity-0 group-hover:opacity-100
                    pointer-events-none group-hover:pointer-events-auto
                    transition-opacity duration-200
                  "
                >
                  <div className="font-bold mb-1">Events:</div>
                  <ul>
                    {eventsForDay.map((ev, idx) => (
                      <li key={idx} className="mb-0.5 sm:mb-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1 sm:mr-2 align-middle ${ev.bgColor}`}
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