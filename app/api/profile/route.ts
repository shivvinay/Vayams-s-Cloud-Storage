import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        return NextResponse.json({ profile: decoded });
    }catch {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

}