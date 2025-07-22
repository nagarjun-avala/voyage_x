// File: app/bookings/verify/page.tsx
import { verifyBookingToken } from "@/lib/bookingToken";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Booking Verification | VoyageX",
};

type Props = {
    searchParams: { token?: string };
};

export default async function BookingVerifyPage({ searchParams }: Props) {
    const token = searchParams.token;

    if (!token) return notFound();

    const decoded = await verifyBookingToken(token);

    if (!decoded) return notFound();

    const booking = await prisma.booking.findUnique({
        where: { id: decoded.id },
    });

    if (!booking) return notFound();

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-lg bg-white shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-green-600">✅ Booking Verified</h1>
            <p><strong>Guest:</strong> {booking.guestName}</p>
            <p><strong>Email:</strong> {booking.guestEmail}</p>
            <p><strong>Check-in:</strong> {booking.checkIn.toDateString()}</p>
            <p><strong>Check-out:</strong> {booking.checkOut.toDateString()}</p>
            <p><strong>Room ID:</strong> {booking.roomId}</p>
        </div>
    );
}
