import { connectDB } from "@/lib/mongo";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await connectDB();

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 },
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  });

  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 },
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax", // 🔥 add this
    secure: process.env.NODE_ENV === "production",
  });
  
  return response;
}
