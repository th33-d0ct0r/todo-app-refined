import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import User from "@/models/userSchema";

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const { clerkId } = await request.json();
        console.log(clerkId)
        const existingUser = await User.findOne({ clerkId : clerkId });
        if (existingUser) {
            return NextResponse.json({ message: "User found", user: existingUser }, {status: 200});
        }
        return NextResponse.json({ message: "User not found" }, {status: 404});
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: "An error occured while fetching user." }, {status: 500});
    }
}