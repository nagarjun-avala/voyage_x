// app/(protected)/dashboard/bookings/page.tsx
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { CircleCheck, Eye, Loader, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    // TODO: list all booking in form of data table with pagination

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base border-b pb-4">
                    <h1 className="text-2xl font-bold">My Bookings</h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {bookings.length === 0 ? (
                    <p className="text-muted-foreground">No bookings found.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bookings.map((booking) => (
                            <Card
                                key={booking.id}
                                className="hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-base">
                                        {booking.title}
                                        <Badge
                                            className="ml-2 text-muted-foreground"
                                            variant={
                                                booking.status === "CONFIRMED" ? "success" : "outline"
                                            }
                                        >
                                            {booking.status === "CONFIRMED" ? (
                                                <CircleCheck className="fill-green-500 dark:fill-green-400" />
                                            ) : (
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            {booking.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                                        </Badge>
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {format(booking.createdAt, "p, PPP")}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Name: {booking.guestName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Email: {booking.guestEmail}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Amount: {formatCurrency(booking.amount)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Check in:{" "}
                                        {booking.checkIn
                                            ? format(new Date(booking.checkIn), "PP")
                                            : "N/A"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Check out:{" "}
                                        {booking.checkOut
                                            ? format(new Date(booking.checkOut), "PP")
                                            : "N/A"}
                                    </p>
                                    {booking.notes && (
                                        <p className="text-sm text-muted-foreground">
                                            Notes: {booking.notes}
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <div className="flex justify-between items-center space-x-2 float-end">
                                        <Link href={`/bookings/${booking.id}`}>
                                            <Button variant="outline" size="sm" className="text-xs">
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </Button>
                                        </Link>
                                        <Link href={`/bookings/${booking.id}/receipt`}>
                                            <Button variant="outline" size="sm" className="text-xs">
                                                <ScrollText className="h-4 w-4" />
                                                View Receipt
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
