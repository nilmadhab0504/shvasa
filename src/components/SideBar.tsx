import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface CalendarSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate: Date
  onDateChange: (date: Date | undefined) => void
}

export function CalendarSidebar({
  className,
  selectedDate,
  onDateChange,
}: CalendarSidebarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  useEffect(() => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

    if (selectedDate.getTime() !== firstDayOfMonth.getTime()) {
      onDateChange(firstDayOfMonth)
    }
  }, [currentMonth])

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onDateChange(date)
    }
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Calendar
            mode="single"
            className="w-full"
            selected={selectedDate}
            onSelect={handleDateChange}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
          />
          <Separator className="my-4" />
        </div>
      </ScrollArea>
    </div>
  )
}
