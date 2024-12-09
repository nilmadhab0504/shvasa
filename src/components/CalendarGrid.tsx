import { ScrollArea } from "./ui/scroll-area"

interface CalendarGridProps {
  selectedDate: Date
  events: any[]
}

export function CalendarGrid({ selectedDate, events }: CalendarGridProps) {
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

  return (
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
                      className="absolute inset-x-1 bg-blue-500 text-white p-1 text-xs rounded relative group"
                      style={{
                        top: `${(new Date(event.startTime).getMinutes() / 60) * 100}%`,
                        height: `${(event.duration / 60) * 100}%`,
                      }}
                    >
                      {event.title}
                      {/* Tooltip showing description on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {event.description}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
