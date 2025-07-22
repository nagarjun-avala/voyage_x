import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PrintReceiptButton } from "@/components/PrintReceiptButton";
import { BookingQR } from "@/components/booking/BookingQR";
import { formatCurrency } from "@/lib/utils";

export default async function ReceiptPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getSession();
    const booking = await prisma.booking.findUnique({
        where: { id: await params.id },
        include: { room: true },
    });

    if (!booking || booking.userId !== session?.userId) notFound();

    return (
        <div className="flex justify-between max-w-2xl mx-auto print:px-0 p-6 bg-white shadow-md rounded-md space-y-4">
            <div className="space-y-4">
                <h1 className="text-xl font-semibold">Booking Receipt</h1>
                <p>Booking ID: {booking.id}</p>
                <p>
                    Guest: {booking.guestName} ({booking.guestEmail})
                </p>
                <p>Room: {booking.room.name}</p>
                <p>Check-in: {format(booking.checkIn, "dd MMM yyyy")}</p>
                <p>Check-out: {format(booking.checkOut, "dd MMM yyyy")}</p>
                <p>
                    Adults: {booking.adults}, Children: {booking.children}
                </p>
                <p>Meal Plan: {booking.mealPlan}</p>
                <p>Total Amount: {formatCurrency(booking.amount)}</p>
                <PrintReceiptButton />
            </div>
            <div className="flex flex-col items-center justify-between space-y-4">
                <div className="flex flex-col items-center">
                    <p className="text-sm mb-1">Verify QR</p>
                    <BookingQR booking={{ id: booking.id, guestName: booking.guestName, guestEmail: booking.guestEmail }} />

                </div>
                <div className="flex flex-col justify-between space-y-4">
                    <p className="text-sm">Signature:</p>
                    <div className="h-16 border-t-2 border-black w-48 mt-2" />
                </div>
            </div>
        </div>
    );
}
