// File: app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';


export async function POST(req: Request) {
    const { username, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    await createSession(user.id, user.role);
    return NextResponse.json({ message: 'Login successful', user });
}