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

type NavItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
    roles: Role[];
};

export const sidebarLinks: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        roles: ["ADMIN", "MANAGER", "HEADCOOK", "SUPERVISOR"],
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: <Users className="w-5 h-5" />,
        roles: ["ADMIN"],
    },
    {
        title: "Payments",
        href: "/admin/payments",
        icon: <CreditCard className="w-5 h-5" />,
        roles: ["ADMIN"],
    },
    {
        title: "Logs",
        href: "/admin/logs",
        icon: <ClipboardList className="w-5 h-5" />,
        roles: ["ADMIN"],
    },
    {
        title: "Voyages",
        href: "/manager/voyages",
        icon: <BookOpen className="w-5 h-5" />,
        roles: ["MANAGER"],
    },
    {
        title: "Crew Control",
        href: "/headcook/crew",
        icon: <UserCog className="w-5 h-5" />,
        roles: ["HEADCOOK"],
    },
    {
        title: "Bookings",
        href: "/dashboard/bookings",
        icon: <CalendarIcon className="w-5 h-5" />,
        roles: ["VOYAGER", "ADMIN"]
    }

];
