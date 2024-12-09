interface CalendarHeaderProps {
  selectedDate: Date
}

export function CalendarHeader({ selectedDate }: CalendarHeaderProps) {
  const startOfWeek = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate() - selectedDate.getDay() 
  )

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  return (
    <div className="grid grid-cols-8 border-b">
       <div
         
          className="flex flex-col items-center border-r py-2 text-sm"
        >
          <span className="text-muted-foreground">Time</span>
        
        </div>
      {days.map((day, index) => (
        <div
          key={day}
          className="flex flex-col items-center border-r py-2 text-sm"
        >
          <span className="text-muted-foreground">{day}</span>
          <span className="text-xl">{dates[index].getDate()}</span>
        </div>
      ))}
    </div>
  )
}
