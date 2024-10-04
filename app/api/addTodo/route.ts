import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/utils/connectDb';
import User from '@/models/userSchema';

export async function POST(req: NextRequest) {
    await connectDb();
    try {
        const body = await req.json();
        const { email, todo } = body;

        if (!email || !todo) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await User.findOneAndUpdate({ email }, { $push: { todos: {
            todo,
            completed: false,
            createdAt: new Date(),
        }}});

        return NextResponse.json({ message: "Todo added successfully", success: true }, { status: 201 });
    
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json({ message: 'An error occurred while adding todo' }, { status: 500 });
    }

}