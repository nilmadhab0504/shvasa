import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User"; 
import connectDB from "../../../lib/connectDB";

export async function GET(req: NextRequest) {
    await connectDB();
    const search = req.nextUrl.searchParams.get('search');
    const id = req.nextUrl.searchParams.get('id'); // Get the 'id' parameter from the query

    try {
        let users;

        // If 'id' is provided, search by _id
        if (id) {
            // Ensure it's a valid ObjectId format
            users = await User.find({ id: id });
            
        } else if (search) {
            // If 'search' is provided, search by name
            users = await User.find({
                name: { $regex: search, $options: "i" }
            });
        }

        // If no valid parameters are provided, return an error
        if (!users || users.length === 0) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }

        return NextResponse.json({ users }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
    }
}
