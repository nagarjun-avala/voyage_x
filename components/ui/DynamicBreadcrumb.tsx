"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./breadcrumb";
import React from "react";

// const routeLabelMap: Record<string, string> = {
//     admin: "Admin",
//     manager: "Manager",
//     headcook: "Head Cook",
//     supervisor: "Supervisor",
//     dashboard: "Dashboard",
//     users: "Users",
//     payments: "Payments",
//     voyages: "Voyages",
//     logs: "Logs",
// };

// DynamicBreadcrumb.tsx

import {
    LayoutDashboard,
    Users,
    CreditCard,
    ClipboardList,
    UserCog,
    BookOpen,
    UserCircle,
} from "lucide-react";

// Updated mapping
const routeMetaMap: Record<string, { label: string; icon?: React.ReactNode; subtitle?: string }> = {
    admin: { label: "Admin", icon: <UserCircle className="w-5 h-5" />, subtitle: "Platform overview and controls" },
    dashboard: { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    users: { label: "Users", icon: <Users className="w-5 h-5" /> },
    payments: { label: "Payments", icon: <CreditCard className="w-5 h-5" />, subtitle: "Transaction history & stats" },
    logs: { label: "Logs", icon: <ClipboardList className="w-5 h-5" /> },
    voyages: { label: "Voyages", icon: <BookOpen className="w-5 h-5" /> },
    headcook: { label: "Head Cook", icon: <UserCog className="w-5 h-5" /> },
};

export function getPageMetaFromPath(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    const last = segments.at(-1) ?? "";
    return routeMetaMap[last] || { label: last };
}

const isId = (value: string) => /^[a-f\d]{24}$/i.test(value) || /^\d+$/.test(value);

export function getBreadcrumbLabel(segment: string): string {
    if (isId(segment)) return `#${segment}`;
    return routeMetaMap[segment]?.label || decodeURIComponent(segment);
}


export default function DynamicBreadcrumb() {
    const path = usePathname();
    const segments = path.split("/").filter(Boolean);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((seg, idx) => {
                    const isLast = idx === segments.length - 1;
                    const href = "/" + segments.slice(0, idx + 1).join("/");
                    const label = getBreadcrumbLabel(seg);


                    return (
                        <React.Fragment key={seg}>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}