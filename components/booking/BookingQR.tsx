// File: components/booking/BookingQR.tsx
"use client";

import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Booking } from '@prisma/client';

const logoImage = "/logo.png";

type BookingQRProps = {
    booking: Pick<Booking, 'id' | 'guestName' | 'guestEmail'>;
    width?: number;
    height?: number;
};

export function BookingQR({ booking, width = 220, height = 220 }: BookingQRProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function renderQR() {
            const res = await fetch('/api/bookings/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking),
            });

            const { token } = await res.json();

            const qr = new QRCodeStyling({
                width: width,
                height: height,
                type: "svg",
                data: `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/verify?token=${token}`,
                image: logoImage,
                dotsOptions: {
                    color: "#000000",
                    type: "rounded",
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 10,
                },
            });

            if (ref.current) {
                ref.current.innerHTML = "";
                qr.append(ref.current);
            }
        }

        renderQR();
    }, [booking, height, width]);

    return (
        <div className="flex flex-col items-center space-y-2">
            <div ref={ref} className="w-[220px] h-[220px]" />
            <p className="text-sm text-muted-foreground text-center max-w-xs">
                Scan to verify this booking with VoyageX
            </p>
        </div>
    );
}
