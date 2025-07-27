// app/(protected)/dashboard/bookings/new/page.tsx

import BookingForm from "@/components/booking/BookingForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function NewBookingPage() {
    const session = await getSession();
    if (!session?.userId) redirect("/login");

    return (
        <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold">Create New Booking</h2>
            </CardHeader>
            <CardContent>
                <BookingForm />
            </CardContent>
        </Card >
    );
}
