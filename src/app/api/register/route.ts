import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User"; 
import bcrypt from "bcrypt"; 
import connectDB from "../../../lib/connectDB"; // Adjust the path as needed

export async function POST(req: NextRequest) {
    await connectDB();  // Connect to MongoDB before processing the request

    const { name, email, password, featureFlag = false, googleCalendarToken = null } = await req.json();

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10); 

        // Create a new user
        const user = new User({
            name,
            email,
            password: passwordHash,
            featureFlag,
            googleCalendarToken,
        });

        // Save the user to the database
        await user.save();
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }
}
