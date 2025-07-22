import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
    const session = await getSession();
    const booking = await prisma.booking.findUnique({
        where: { id: params.id },
    });

    if (!booking || session?.userId !== booking.userId) notFound();

    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
            <p>Title: {booking.title}</p>
            <p>Guest: {booking.guestName}</p>
            <p>Status: {booking.status}</p>

            <form action={`/api/dashboard/bookings/${params.id}/cancel`} method="POST">
                <Button variant="destructive" type="submit">
                    Cancel Booking
                </Button>
            </form>

            <Link href="/dashboard/bookings" className="text-blue-600 text-sm">
                ← Back to bookings
            </Link>
        </div>
    );
}
