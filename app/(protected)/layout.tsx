// File: app/(protected)/layout.tsx
"use client";
import DashboardHeader from "@/components/DashboardHeader";
import SidebarNav from "@/components/SidebarNav";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/ui/DynamicBreadcrumb";
import PageHeader from "@/components/ui/PageHeader";

function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    if (!segments.length) return null;

    return (
        <nav className="text-xs text-muted-foreground mb-2">
            {segments.map((seg, idx) => (
                <span key={idx} className="capitalize">
                    {seg.replace("-", " ")}
                    {idx < segments.length - 1 && <span className="mx-1">/</span>}
                </span>
            ))}
        </nav>
    );
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <DashboardHeader />
            <div className="flex flex-1 overflow-hidden">
                <SidebarNav />
                <main className="flex-1 p-4 overflow-y-auto">
                    <DynamicBreadcrumb />
                    <PageHeader />
                    {children}
                </main>
            </div>
        </div>
    );
}
