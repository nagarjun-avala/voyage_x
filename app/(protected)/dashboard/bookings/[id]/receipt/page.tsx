import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PrintReceiptButton } from "@/components/PrintReceiptButton";
import { StyledQRCode } from "@/components/StyledQRCode"

export default async function ReceiptPage({ params }: { params: { id: string } }) {
    const session = await getSession();
    const booking = await prisma.booking.findUnique({
        where: { id: params.id },
        include: { room: true },
    });

    if (!booking || booking.userId !== session?.userId) notFound();

    return (
        <div className="max-w-2xl mx-auto print:px-0 p-6 space-y-4">
            <h1 className="text-xl font-semibold">Booking Receipt</h1>
            <p>Booking ID: {booking.id}</p>
            <p>Guest: {booking.guestName} ({booking.guestEmail})</p>
            <p>Room: {booking.room.name}</p>
            <p>Check-in: {format(booking.checkIn, "dd MMM yyyy")}</p>
            <p>Check-out: {format(booking.checkOut, "dd MMM yyyy")}</p>
            <p>Adults: {booking.adults}, Children: {booking.children}</p>
            <p>Meal Plan: {booking.mealPlan}</p>
            <p>Total Amount: ₹{booking.amount}</p>
            <PrintReceiptButton />
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm">Signature:</p>
                    <div className="h-16 border-t-2 border-black w-48 mt-2" />
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-sm mb-1">Verify QR</p>
                    <StyledQRCode
                        value={`http://localhost:3000/bookings/verify/${booking.id}`}
                        size={100}
                    />
                </div>
            </div>
        </div>
    );
}
