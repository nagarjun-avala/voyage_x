// File: app/api/bookings/token/route.ts
import { NextResponse } from 'next/server';
import { generateBookingToken } from '@/lib/bookingToken';

export async function POST(req: Request) {
    const body = await req.json();

    if (!body?.id || !body?.guestName || !body?.guestEmail) {
        return new NextResponse("Invalid data", { status: 400 });
    }

    const token = await generateBookingToken(body);
    return NextResponse.json({ token });
}
