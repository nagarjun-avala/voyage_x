// File: app/bookings/[id]/ReceiptPrint.tsx
"use client";

import { Booking, Room } from "@prisma/client";
import Image from "next/image";
import { useRef } from "react";

type Props = {
    booking: Booking & { room: Room };
};

export default function ReceiptPrint({ booking }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (!ref.current) return;
        const content = ref.current.innerHTML;
        const win = window.open('', '', 'width=800,height=600');
        if (!win) return;
        win.document.write(`
      <html>
        <head>
          <title>Booking Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .invoice {
              border: 1px solid #ddd;
              padding: 24px;
              max-width: 600px;
              margin: auto;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 20px;
            }
            .details {
              margin-top: 24px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
        win.document.close();
        win.print();
    };

    const total = booking.amount;

    return (
        <div className="flex flex-col items-center mt-6 space-y-4">
            <div ref={ref} className="invoice bg-white rounded shadow">
                <div className="logo">
                    <Image src="/logo.png" alt="VoyageX Logo" width={100} height={100} />
                    <h2 className="text-xl font-bold mt-2">Booking Invoice</h2>
                </div>
                <div className="details">
                    <div className="row">
                        <span>Booking ID:</span>
                        <span>{booking.id}</span>
                    </div>
                    <div className="row">
                        <span>Guest Name:</span>
                        <span>{booking.guestName}</span>
                    </div>
                    <div className="row">
                        <span>Email:</span>
                        <span>{booking.guestEmail}</span>
                    </div>
                    <div className="row">
                        <span>Room Type:</span>
                        <span>{booking.room.type}</span>
                    </div>
                    <div className="row">
                        <span>Check In:</span>
                        <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="row">
                        <span>Check Out:</span>
                        <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="row">
                        <span>Meal Plan:</span>
                        <span>{booking.mealPlan || "None"}</span>
                    </div>
                    <div className="row">
                        <span>Adults:</span>
                        <span>{booking.adults}</span>
                    </div>
                    <div className="row">
                        <span>Children:</span>
                        <span>{booking.children}</span>
                    </div>
                    <div className="row font-bold border-t pt-2 mt-2">
                        <span>Total Amount:</span>
                        <span>₹{total}</span>
                    </div>
                </div>
                <div className="footer">
                    Thank you for choosing VoyageX. Have a pleasant journey!
                </div>
            </div>
            <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
                Print / Download
            </button>
        </div>
    );
}
