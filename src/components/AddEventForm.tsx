import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"

interface AddEventFormProps {
  onClose: () => void
  onAddEvent: () => void
  events: any[] 
}

export function AddEventForm({ onClose, onAddEvent, events }: AddEventFormProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("")
  const [error, setError] = useState("")
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const numericDuration = Number(duration)
    if (numericDuration <= 0 || isNaN(numericDuration)) {
      setError("Duration must be a positive number.")
      return
    }

    // Check for overlapping events
    const eventTime = new Date(`${date}T${time}`)
    const eventEndTime = new Date(eventTime.getTime() + numericDuration * 60000)

    const overlappingEvent = events.find((event) => {
      const existingEventStart = new Date(event.startTime)
      const existingEventEnd = new Date(existingEventStart.getTime() + event.duration * 60000)
      return (
        (eventTime >= existingEventStart && eventTime < existingEventEnd) ||
        (eventEndTime > existingEventStart && eventEndTime <= existingEventEnd) ||
        (existingEventStart >= eventTime && existingEventStart < eventEndTime) ||
        (existingEventEnd > eventTime && existingEventEnd <= eventEndTime)
      )
    })

    if (overlappingEvent) {
      setError("The event time overlaps with an existing event.")
      return
    }

    try {
      const userId = session?.user.id

      const eventData = {
        title,
        date,
        time,
        description,
        duration: numericDuration,
        userId,
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to add event")
      }

      const data = await response.json()
      console.log("Event added:", data)

      onAddEvent() 

      onClose() 
    } catch (error: any) {
      console.error("Error adding event:", error)
      setError(error.message || "An error occurred while adding the event.")
    }
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!/^\d*$/.test(value)) return
    setDuration(value)
    if (Number(value) <= 0) {
      setError("Duration must be a positive number.")
    } else {
      setError("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (in minutes)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          value={duration}
          onChange={handleDurationChange}
          placeholder="Enter event duration"
          required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about the event"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  )
}
