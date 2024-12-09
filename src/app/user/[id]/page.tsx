"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Header from "@/components/Header"
import { CalendarSidebar } from "@/components/SideBar"
import { CalendarGrid } from "../../../components/CalendarGrid"
import { CalendarHeader } from "../../../components/CalendarHead"
import { Button } from "@/components/ui/button"
import withAuth from "@/middleware/withAuth"

type Event = {
  id: string
  title: string
  startTime: string
  duration: number
  description: string
}

const UserCalendar = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [userName,setUserName] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { data: session } = useSession()
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!id) return
        const response = await fetch(`/api/events?userId=${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        const transformedEvents: Event[] = data.events.map((event: any) => ({
          id: event._id,
          title: event.title,
          startTime: new Date(`${event.date}T${event.time}`).toISOString(),
          duration: event.duration,
          description: event.description,
        }))
        setEvents(transformedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    const fetchUserName = async () =>{
      const response = await fetch(`/api/users?id=${id}`);
      const data = await response.json();
      console.log(data);
      setUserName(data.users[0].name)
    }

    if (session?.user) {
      fetchEvents()
      fetchUserName()
    }
  }, [session, id])

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto">
        <div className="flex h-full">
          <div className="border-l border-r border-b items-center flex flex-col py-4">
            <h1 className="text-xl font-bold">{userName+`'s`} calendar </h1>
            <CalendarSidebar
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
            <Button
              variant="default"
              onClick={() => router.push("/")}
              className="flex items-center space-x-2"
            >
              <span>Calendar</span>
            </Button>
          </div>
          <div className="flex-1">
            <CalendarHeader selectedDate={selectedDate} />
            <CalendarGrid selectedDate={selectedDate} events={events} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default withAuth(UserCalendar)
