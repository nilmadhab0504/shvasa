import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User"; 
import bcrypt from "bcrypt"; 
import connectDB from "../../../lib/connectDB"; 

export async function POST(req: NextRequest) {
    await connectDB(); 

    const { name, email, password, featureFlag = false, googleCalendarToken = null } = await req.json();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10); 

        const user = new User({
            name,
            email,
            password: passwordHash,
            featureFlag,
            googleCalendarToken,
        });

        await user.save();
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }
}
