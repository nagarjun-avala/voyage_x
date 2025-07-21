// app/(protected)/dashboard/bookings/new/page.tsx

import BookingForm from "@/components/booking/BookingForm";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function NewBookingPage() {
    const session = await getSession();
    if (!session?.userId) redirect("/login");

    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-2xl font-bold">New Booking</h1>
            <BookingForm />
        </div>
    );
}
