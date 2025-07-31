// app/(protected)/admin/bookings/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/ui/PageHeader";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import { Booking } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const booking = await prisma.booking.findUnique({
        where: { id: await params.id },
        select: { id: true, title: true },
    });

    return {
        title: booking ? `${booking.title} | VoyageX` : "Booking Not Found | VoyageX",
    };
}

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
