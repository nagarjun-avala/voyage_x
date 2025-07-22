import { SignJWT, jwtVerify } from "jose";

const secret = process.env.JWT_SECRET || "supersecretkey";
const key = new TextEncoder().encode(secret);

type BookingTokenPayload = {
    id: string;
    guestName: string;
    guestEmail: string;
};

export async function generateBookingToken(data: BookingTokenPayload) {
    const token = await new SignJWT(data)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(key);
    return token;
}

export async function decodeBookingToken(token: string): Promise<BookingTokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload as BookingTokenPayload;
    } catch (err) {
        console.error("Invalid booking token", err);
        return null;
    }
}
