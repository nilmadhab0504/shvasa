import { useState } from "react"
import { ScrollArea } from "./ui/scroll-area"

interface Event {
  id: string
  title: string
  description: string
  startTime: string
  duration: number
}

interface CalendarGridProps {
  selectedDate: Date
  events: Event[]
}

export function CalendarGrid({ selectedDate, events }: CalendarGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const startOfWeek = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate() - selectedDate.getDay()
  )

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const closePopup = () => {
    setSelectedEvent(null)
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-8.5rem)]">
        <div className="relative grid grid-cols-8">
          <div className="flex flex-col items-center border-r py-2 text-sm">
            {hours.map((hour) => (
              <div
                key={hour}
                className="relative flex h-12 items-center justify-center text-right text-sm text-muted-foreground"
              >
                <span>
                  {hour === 0 ? "12" : hour > 12 ? hour - 12 : hour} {hour >= 12 ? "PM" : "AM"}
                </span>
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="relative border-r">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="relative h-12 border-b border-dashed"
                >
                  {events
                    .filter((event) => {
                      const eventDate = new Date(event.startTime)
                      return (
                        eventDate.toDateString() === day.toDateString() &&
                        eventDate.getHours() === hour
                      )
                    })
                    .map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="absolute bg-blue-500 text-white text-xs rounded relative group cursor-pointer"
                        style={{
                          top: `${(new Date(event.startTime).getMinutes() / 60) * 100}%`,
                          height: `${(event.duration / 60) * 100}%`,
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Event Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold">{selectedEvent.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{selectedEvent.description}</p>
            <p className="text-sm text-gray-600 mt-2">
              Time:{" "}
              {new Date(selectedEvent.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(
                new Date(selectedEvent.startTime).getTime() + selectedEvent.duration * 60000
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
