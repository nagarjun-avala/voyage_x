
// File: app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieSet = await cookies()

    cookieSet.delete('voyagex-session');

    return NextResponse.json({ message: 'Logged out' });
}
