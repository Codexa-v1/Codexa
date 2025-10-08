"use client"

import React, { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import dayjs from "dayjs"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { getAllEvents } from "@/backend/api/EventData"

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
    [],
  )

  const getBgColor = React.useCallback((category) => eventColors[category] || eventColors["Other"], [eventColors])

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
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
  ]

  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const prevMonth = () => {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1))
    setCurrentYear((y) => (currentMonth === 0 ? y - 1 : y))
  }

  const nextMonth = () => {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1))
    setCurrentYear((y) => (currentMonth === 11 ? currentYear + 1 : y))
  }

  const { user, isAuthenticated } = useAuth0()
  const [events, setEvents] = useState([])

  React.useEffect(() => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then((data) => {
          setEvents(data.map((ev) => ({ ...ev, bgColor: getBgColor(ev.category) })))
        })
        .catch((err) => console.error("Failed to fetch events:", err))
    }
  }, [isAuthenticated, user, getBgColor])

  return (
    <section className="w-full h-full px-2 sm:px-4">
      {/* Month & Year Navigation */}
      <section className="flex flex-col sm:flex-row items-center gap-3 my-6 sm:my-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-teal-900 tracking-tight">
          {monthsOfYear[currentMonth]}, {currentYear}
        </h2>

        <section className="flex gap-3 ml-auto">
          <button
            onClick={prevMonth}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-50 rounded-xl flex justify-center items-center text-xl text-teal-700 hover:bg-teal-100 hover:shadow-md transition-all duration-200 border border-teal-100"
          >
            <HiChevronLeft />
          </button>
          <button
            onClick={nextMonth}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-50 rounded-xl flex justify-center items-center text-xl text-teal-700 hover:bg-teal-100 hover:shadow-md transition-all duration-200 border border-teal-100"
          >
            <HiChevronRight />
          </button>
        </section>
      </section>

      {/* Weekdays */}
      <section className="grid grid-cols-7 my-4 sm:my-6 bg-teal-50 rounded-lg py-3">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className="font-bold uppercase text-teal-800 tracking-wider flex justify-center items-center text-xs sm:text-sm"
          >
            {day}
          </span>
        ))}
      </section>

      {/* Days Grid */}
      <section className="grid grid-cols-7 gap-2">
        {/* Empty slots for padding */}
        {[...Array(firstDayOfMonth).keys()].map((_, i) => (
          <span
            key={`empty-${i}`}
            className="h-12 sm:h-16 flex justify-center items-center text-gray-400 text-xs sm:text-sm bg-gray-50 rounded-lg"
          />
        ))}
        {/* Actual days */}
        {[...Array(daysInMonth).keys()].map((day) => {
          const dateObj = new Date(currentYear, currentMonth, day + 1)
          const dateStr = dayjs(dateObj).format("YYYY-MM-DD")
          const eventsForDay = events.filter((ev) => dayjs(ev.date).format("YYYY-MM-DD") === dateStr)
          const isToday = dayjs(dateObj).isSame(dayjs(), "day")

          return (
            <span
              key={day + 1}
              onClick={() => onDayClick && onDayClick(dateObj)}
              className={`
                h-12 sm:h-16 flex flex-col justify-center items-center
                text-gray-800 text-sm sm:text-base cursor-pointer font-medium
                hover:bg-teal-50 hover:shadow-md rounded-lg border transition-all duration-200
                ${isToday ? "bg-teal-100 border-teal-300 ring-2 ring-teal-200" : "bg-white border-gray-200"}
                relative group
              `}
            >
              <span>{day + 1}</span>

              {eventsForDay.length > 0 && (
                <span className="flex gap-1 mt-1">
                  {eventsForDay.slice(0, 3).map((ev, idx) => (
                    <span key={idx} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${ev.bgColor} shadow-sm`}></span>
                  ))}
                </span>
              )}

              {eventsForDay.length > 0 && (
                <section
                  className="
                    absolute left-1/2 -translate-x-1/2 top-full mt-2
                    z-10 bg-white border border-gray-200 rounded-xl shadow-2xl
                    p-3 min-w-[160px] sm:min-w-[200px]
                    text-xs sm:text-sm text-gray-800
                    opacity-0 group-hover:opacity-100
                    pointer-events-none group-hover:pointer-events-auto
                    transition-opacity duration-200
                  "
                >
                  <div className="font-bold mb-2 text-teal-800">Events:</div>
                  <ul className="space-y-1.5">
                    {eventsForDay.map((ev, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${ev.bgColor} flex-shrink-0`}></span>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold block truncate">{ev.title}</span>
                          <span className="text-gray-500 text-xs">({ev.category || ev.type})</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </span>
          )
        })}
      </section>
    </section>
  )
}

export default Calendar
