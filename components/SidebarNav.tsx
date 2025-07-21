// File: components/SidebarNav.tsx
"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

const navItems: Record<string, string[]> = {
    ADMIN: ["/admin", "/dashboard", "/payments", "/reports"],
    MANAGER: ["/manager", "/dashboard"],
    HEADCOOK: ["/headcook", "/dashboard"],
    SUPERVISOR: ["/supervisor", "/dashboard"],
    RECEPTIONIST: ["/dashboard"],
};

export default function SidebarNav() {
    const { user } = useSession();

    const links = user?.role ? navItems[user.role] || ["/dashboard"] : [];
    // console.log(links)

    return (
        <aside className="w-64 border-r p-4 bg-muted h-full">
            <nav className="flex flex-col gap-2">
                {links.map((href) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "text-sm font-medium text-muted-foreground hover:text-primary",
                            {
                                "text-primary": typeof window !== "undefined" && window.location.pathname === href,
                            }
                        )}
                    >
                        {href.replace("/", "").toUpperCase() || "HOME"}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}