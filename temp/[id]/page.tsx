// app/(protected)/admin/bookings/[id]/page.tsx
"use client"
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/ui/PageHeader";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import { Booking } from "@prisma/client";

export default function BookingDetailPage() {
    const [booking, setBooking] = useState<Booking | null>(null)
    const router = useRouter()
    const id = router.query.id as string

    useEffect(() => {
        async function getBookings() {
            const bookingData = await prisma.booking.findUnique({
                where: { id: id },
            });
            setBooking(bookingData)
        }
        getBookings()
    })

    if (!booking) notFound();

    return (
        <div>
            <PageHeader
                title={`Booking #${booking.id}`}
                subtitle={`Guest: ${booking.guestName}`}
                icon="📘"
            />
            {/* Add more booking details here */}
        </div>
    );
}
