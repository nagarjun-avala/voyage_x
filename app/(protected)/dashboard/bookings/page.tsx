// app/(protected)/dashboard/bookings/page.tsx
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VoyagerBookingsPage() {
    const session = await getSession();

    if (!session?.userId) {
        return <div className="text-red-500">Unauthorized</div>;
    }

    const bookings = await prisma.booking.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">My Bookings</h1>

            {bookings.length === 0 ? (
                <p className="text-muted-foreground">No bookings found.</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.map((booking) => (
                        <Card key={booking.id}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {booking.title}
                                    <Badge className="ml-2" variant="outline">
                                        {booking.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1">
                                <p>
                                    <strong>Guest: </strong> {booking.guestName}
                                </p>
                                <p>
                                    <strong>Check-in: </strong> {format(booking.checkIn, "PPP")}
                                </p>
                                <p>
                                    <strong>Check-out: </strong> {format(booking.checkOut, "PPP")}
                                </p>
                                <p>
                                    <strong>Amount: </strong> {formatCurrency(booking.amount)}
                                </p>
                                <Link
                                    href={`/dashboard/bookings/${booking.id}/receipt`}
                                    className="text-sm text-blue-600 underline"
                                >
                                    View Receipt
                                </Link>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
