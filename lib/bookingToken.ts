// File: lib/bookingToken.ts
"use server";

import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

export async function generateBookingToken(payload: {
    id: string;
    guestName: string;
    guestEmail: string;
}) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifyBookingToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as {
            id: string;
            guestName: string;
            guestEmail: string;
        };
    } catch {
        return null;
    }
}
