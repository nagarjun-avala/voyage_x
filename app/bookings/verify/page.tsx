import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { decodeBookingToken } from "@/lib/bookingToken";

export default async function VerifyBookingPage({ params }: { params: { id: string } }) {
    const token = params.id;
    const decoded = await decodeBookingToken(token);

    const booking = await prisma.booking.findUnique({
        where: { id: decoded?.id },
        include: { room: true },
    });

    if (!booking) return notFound()

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-semibold text-center text-green-600">✅ Booking Verified</h1>
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Guest:</strong> {booking.guestName}</p>
            <p><strong>Room:</strong> {booking.room.name}</p>
            <p><strong>Check-in:</strong> {format(booking.checkIn, "dd MMM yyyy")}</p>
            <p><strong>Check-out:</strong> {format(booking.checkOut, "dd MMM yyyy")}</p>
            <p><strong>Status:</strong> Confirmed</p>
        </div>
    )
}
