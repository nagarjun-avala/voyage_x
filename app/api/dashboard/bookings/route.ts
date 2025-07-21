import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
        where: {
            userId: session.role === "VOYAGER" ? session.userId : undefined,
        },
        include: { room: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
}


export async function POST(req: Request) {
    const body = await req.json();
    const session = await getSession();
    if (!session || session.role !== "VOYAGER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
        title,
        guestName,
        guestEmail,
        checkIn,
        checkOut,
        roomId,
        adults,
        children,
        mealPlan,
        notes,
        amount,
    } = body;


    try {
        await prisma.booking.create({
            data: {
                title,
                guestName,
                guestEmail,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                roomId,
                userId: String(session.userId),
                adults,
                children,
                amount,
                mealPlan,
                notes,
            },
        });


        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}
