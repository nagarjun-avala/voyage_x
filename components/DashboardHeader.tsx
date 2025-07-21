// File: components/DashboardHeader.tsx
"use client";

import { useSession } from "@/hooks/useSession";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "@/components/LogoutButton";

export default function DashboardHeader() {
    const { user, loading } = useSession();

    if (loading) {
        return (
            <div className="flex items-center justify-between p-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <header className="flex items-center justify-between p-4 bg-muted rounded-md">
            <div className="space-y-1">
                <p className="text-sm font-medium">Welcome, {user?.name}</p>
                <p className="text-xs text-muted-foreground">Role: {user?.role}</p>
            </div>
            <LogoutButton />
        </header>
    );
}
