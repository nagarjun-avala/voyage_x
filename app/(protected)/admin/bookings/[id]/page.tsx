// app/(protected)/admin/bookings/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/ui/PageHeader";

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

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
    const booking = await prisma.booking.findUnique({
        where: { id: params.id },
    });

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
