import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.booking.update({
            where: { id: params.id },
            data: { status: "CANCELLED" },
        });

        return NextResponse.redirect(new URL("/bookings", req.url));
    } catch {
        return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
    }
}
