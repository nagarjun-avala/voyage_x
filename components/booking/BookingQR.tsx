// File: components/booking/BookingQR.tsx
'use client'

import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { generateBookingToken } from '@/lib/bookingToken'
import { Booking } from '@prisma/client'

const logoImage = "/logo.png" // must be in public folder

type BookingQRProps = {
    booking: Pick<Booking, 'id' | 'guestName' | 'guestEmail'>
}

export function BookingQR({ booking }: BookingQRProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function generateQR() {
            const token = await generateBookingToken({
                id: booking.id,
                guestName: booking.guestName,
                guestEmail: booking.guestEmail,
            })

            const qr = new QRCodeStyling({
                width: 220,
                height: 220,
                type: 'svg',
                data: `${window.location.origin}/bookings/verify?token=${token}`,
                image: logoImage,
                dotsOptions: {
                    color: '#000',
                    type: 'rounded',
                },
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 8,
                },
            })

            ref.current?.innerHTML && (ref.current.innerHTML = '')
            qr.append(ref.current!)
        }
        generateQR()
    }, [booking])

    return (
        <div className="flex flex-col items-center space-y-2">
            <div ref={ref} />
            <p className="text-sm text-muted-foreground text-center max-w-xs">
                Scan to verify this booking with VoyageX
            </p>
        </div>
    )
}
