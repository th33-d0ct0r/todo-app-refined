import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import User from "@/models/userSchema";

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const { clerkId, createdAt } = await request.json();
        const existingUser = await User.findOne({ clerkId : clerkId });
        if (!existingUser) {
            return NextResponse.json({ message: "User not found", user: existingUser }, {status: 404});
        }

        const todos = existingUser.todos;
        const newTodos = []
        for (let i = 0; i < todos.length; i++) {
            if (new Date(createdAt).toISOString() === todos[i].createdAt.toISOString()) {
                continue;
            }
            newTodos.push(todos[i])
        }

        await User.findOneAndUpdate({ clerkId }, {$set: { todos: newTodos }});

        return NextResponse.json({ message: "Todo successfully deleted. Refresh to see changes." }, {status: 200});
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: "An error occured while updating todo." }, {status: 500});
    }
}