import { connectDB } from "@/lib/mongo";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST( request: Request) {

    await connectDB();

    const {name, email, password} = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json(({message: 'Missing required fields'}), {status: 400});
    }

    if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(({message: 'Email already in use'}), {status: 400});
            //return NextResponse.redirect('/login');
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return NextResponse.json(({message: 'User registered successfully'}), {status: 201});
}