// File: middleware.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { roleRedirectMap } from "@/lib/roleRedirect";

const protectedRoutes = [
    "/admin",
    "/manager",
    "/headcook",
    "/supervisor",
    "/dashboard"
];

type SessionPayload = {
    userId: string;
    role: string;
    expiresAt: string;
};


const publicRoutes = ["/", "/login", "/register", "/bookings/verify/[id]", "/bookings/verify"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((r) => path.startsWith(r));
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie) as SessionPayload | null;

    // console.log("SESSION: ", { session, isPublicRoute, isProtectedRoute, path });

    // User is not logged in and trying to access a protected route
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // User is logged in and accessing a public route
    if (isPublicRoute && session?.userId) {
        const redirectPath = roleRedirectMap[session.role] || "/dashboard";
        return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
    }
    // User is logged in but trying to access a different role's route
    if (
        session?.userId &&
        !publicRoutes.includes(path) &&
        !path.startsWith(roleRedirectMap[session.role])
    ) {
        const correctPath = roleRedirectMap[session.role] || "/dashboard";
        return NextResponse.redirect(new URL(correctPath, req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
