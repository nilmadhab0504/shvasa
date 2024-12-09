"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { AddEventForm } from "@/components/AddEventForm"
import { CalendarSidebar } from "@/components/SideBar"
import { CalendarGrid } from "../components/CalendarGrid"
import { CalendarHeader } from "../components/CalendarHead"

export default function Home() {
  const [openAddEventCart, setOpenAddEventCart] = useState(false)
  const [events, setEvents] = useState<any[]>([]) 
  const [selectedDate, setSelectedDate] = useState(new Date())
  const {data:session}=useSession();

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events?userId=${session?.user.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      const transformedEvents = data.events.map((event: any) => ({
        id: event._id,
        title: event.title,
        startTime: new Date(`${event.date}T${event.time}`).toISOString(), 
        duration: event.duration,
        description: event.description,
      }))
      setEvents(transformedEvents)
    } catch (error) {
      console.error(error)
    }
  }
  const handleAddEvent = () => {
    fetchEvents()
  }

  useEffect(() => {
    if(session?.user){
    fetchEvents()
    }
  }, [session])



  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto ">
        <div className="flex h-full">
          <div className="border-l border-r border-b items-center flex flex-col pb-4">
            <CalendarSidebar
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />{
              session?.user &&
            <Dialog open={openAddEventCart} onOpenChange={setOpenAddEventCart}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  onClick={() => setOpenAddEventCart(true)}
                  className="flex items-center space-x-2"
                >
                  <span>Add New Event</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new event.
                  </DialogDescription>
                </DialogHeader>
                <AddEventForm
                  onClose={() => setOpenAddEventCart(false)}
                  onAddEvent={handleAddEvent}
                  events={events}
                />
              </DialogContent>
            </Dialog>}
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
