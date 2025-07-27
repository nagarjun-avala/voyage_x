// File: app/api/auth/me/route.ts
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
    const session = await getSession();

    if (!session?.userId) {
        (await cookies()).delete("session"); // Clear session cookie if user is not logged in
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: String(session?.userId) },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true,
            avatar: true,
        },
    });

    if (!user) {
        (await cookies()).delete("session"); // Clear session cookie if user is not logged in
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}
