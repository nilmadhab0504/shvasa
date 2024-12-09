import { NextRequest, NextResponse } from "next/server";
import Event from "../../../models/Event"; 
import connectDB from "../../../lib/connectDB";

// POST: Add a new event
export async function POST(req: NextRequest) {
    await connectDB();
    const { title, date, time, description, duration, userId } = await req.json(); 

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const newEvent = new Event({
            title,
            date,
            time,
            description,
            duration,
            userId, 
        });

        await newEvent.save();
        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error adding event" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await connectDB();
    const userId = req.nextUrl.searchParams.get('userId'); 

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const events = await Event.find({ userId }); 
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
    }
}
