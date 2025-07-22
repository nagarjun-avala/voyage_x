// File: utils/navigation.ts
import {
    LayoutDashboard,
    Users,
    CreditCard,
    ClipboardList,
    UserCog,
    BookOpen,
    CalendarIcon,
} from "lucide-react";

export type Role = "ADMIN" | "MANAGER" | "HEADCOOK" | "SUPERVISOR" | "VOYAGER";

export type SidebarItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
};

export type SidebarSection = {
    label: string;
    items: SidebarItem[];
};

export const sidebarConfig: Record<Role, SidebarSection[]> = {
    ADMIN: [
        {
            label: "General",
            items: [
                {
                    title: "Dashboard",
                    href: "/dashboard",
                    icon: <LayoutDashboard className="w-5 h-5" />,
                },
                {
                    title: "Bookings",
                    href: "/dashboard/bookings",
                    icon: <CalendarIcon className="w-5 h-5" />,
                }
            ]
        },
        {
            label: "Management",
            items: [
                {
                    title: "Users",
                    href: "/admin/users",
                    icon: <Users className="w-5 h-5" />,
                },
                {
                    title: "Payments",
                    href: "/admin/payments",
                    icon: <CreditCard className="w-5 h-5" />,
                },
                {
                    title: "Logs",
                    href: "/admin/logs",
                    icon: <ClipboardList className="w-5 h-5" />,
                },
            ]
        },
    ],
    MANAGER: [
        {
            label: "General",
            items: [
                {
                    title: "Dashboard",
                    href: "/dashboard",
                    icon: <LayoutDashboard className="w-5 h-5" />,
                },
                {
                    title: "Voyages",
                    href: "/manager/voyages",
                    icon: <BookOpen className="w-5 h-5" />,
                },
            ]
        }
    ],
    HEADCOOK: [
        {
            label: "General",
            items: [
                {
                    title: "Dashboard",
                    href: "/dashboard",
                    icon: <LayoutDashboard className="w-5 h-5" />,
                },
                {
                    title: "Crew Control",
                    href: "/headcook/crew",
                    icon: <UserCog className="w-5 h-5" />,
                },
            ]
        }
    ],
    SUPERVISOR: [
        {
            label: "General",
            items: [
                {
                    title: "Dashboard",
                    href: "/dashboard",
                    icon: <LayoutDashboard className="w-5 h-5" />,
                }
            ]
        }
    ],
    VOYAGER: [
        {
            label: "Bookings",
            items: [
                {
                    title: "Bookings",
                    href: "/bookings",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
                {
                    title: "New Booking",
                    href: "/bookings/new",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
            ]
        }
    ]
};
