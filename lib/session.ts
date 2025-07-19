// File: lib/session.ts
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers';


export type SessionPayload = {
    userId: string;
    role: string;
};

const secretKey = process.env.JWT_SECRET ?? "default_secret_key";
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(userId: string, role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const session = await encrypt({ userId, role });

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        path: '/',
    });

    return session;
}

export async function getSession() {
    const cookie = (await cookies()).get('session');
    if (!cookie?.value) return null;
    return await decrypt(cookie.value);
}

export async function encrypt(payload: SessionPayload): Promise<string> {
    const token = new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
    return token;
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session', error)
        return null
    }
}
