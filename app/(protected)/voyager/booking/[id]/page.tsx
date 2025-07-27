import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Eye, Loader, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from "next";
import { mealPlanRates } from "@/lib/validations/booking";
import { BookingQR } from "@/components/booking/BookingQR";
// import ReceiptPrint from "@/components/booking/PrintReceipt";

export const generateMetadata = (): Metadata => ({
    title: `Admin | VoyageX`,
});

type PageProps = {
    params: {
        id: string;
    };
};

export default async function BookingDetailPage({ params }: PageProps) {
    const session = await getSession();
    if (!session?.userId) {
        return <div className="text-red-500">Unauthorized</div>;
    }
    const bookingId = await params.id;
    if (!bookingId) {
        return notFound();
    }
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            room: true,
        },
    });

    if (!booking || session?.userId !== booking.userId) notFound();


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base border-b pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Booking Details <span className="hidden md:inline-block">- #{booking.id}</span></h2>
                        <p className="text-sm text-muted-foreground">
                            timestamp: {format(booking.createdAt, "p, PPP")}
                        </p>
                    </div>
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
            </CardHeader>
            <CardContent className="flex item-center flex-col md:flex-row justify-between gap-4">

                <div className="flex-1 space-y-2">
                    <table>
                        <tbody>
                            <tr>
                                <td className="pr-4">Title:</td>
                                <td>{booking.title}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Guest:</td>
                                <td>{booking.guestName}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Email:</td>
                                <td>{booking.guestEmail}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Status:</td>
                                <td>{booking.status}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Check in:</td>
                                <td>{booking.checkIn
                                    ? format(new Date(booking.checkIn), "PP")
                                    : "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Check out:</td>
                                <td>{booking.checkOut
                                    ? format(new Date(booking.checkOut), "PP")
                                    : "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Room:</td>
                                <td>{booking.room?.name || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Room Type:</td>
                                <td>{booking.room?.type || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Room Capacity:</td>
                                <td>{booking.room?.capacity || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Total Adults:</td>
                                <td>{booking.adults}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Total Children:</td>
                                <td>{booking.children}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Room Price (Adults):</td>
                                <td>{booking.room?.pricePerAdult
                                    ? formatCurrency(booking.room.pricePerAdult)
                                    : "N/A"} * {booking.adults} = {booking.room?.pricePerAdult ? formatCurrency(booking.room.pricePerAdult * booking.adults) : "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Room Price (Children):</td>
                                <td>{booking.room?.pricePerChild
                                    ? formatCurrency(booking.room.pricePerChild)
                                    : "N/A"} * {booking.children} = {booking.room?.pricePerChild ? formatCurrency(booking.room.pricePerChild * booking.children) : "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Meal Plan:</td>
                                <td>{booking.mealPlan || "None"} = &nbsp;{booking.mealPlan ? formatCurrency(mealPlanRates[booking.mealPlan]) : "N/A"}</td>
                            </tr>
                        </tbody>
                        <tfoot className="border-t-2 border-gray-200">
                            <tr className="font-bold border-y-2 py-4 border-y-gray-200">
                                <td className="pr-4">Total Amount:</td>
                                <td>{formatCurrency(booking.amount)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {booking.notes && (
                        <p className="text-sm text-muted-foreground">
                            Notes: {booking.notes}
                        </p>
                    )}
                    <form action={`/api/bookings/${bookingId}/cancel`} method="POST" className="float-end md:float-left mt-3">
                        <Button variant="destructive" type="submit" className="cursor-pointer text-xs" size="sm">
                            <Trash2 className="h-4 w-4" />
                            Cancel Booking
                        </Button>
                    </form>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <BookingQR booking={{ id: booking.id, guestName: booking.guestName, guestEmail: booking.guestEmail }} />
                </div>
            </CardContent>
        </Card >
    );
}
