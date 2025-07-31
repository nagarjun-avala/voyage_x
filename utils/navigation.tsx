// File: utils/navigation.ts
import {
    LayoutDashboard,
    Users,
    CreditCard,
    ClipboardList,
    UserCog,
    BookOpen,
    CalendarIcon,
    List,
    ScrollText,
    SquareMenu,
    ChefHat,
} from "lucide-react";

export type Role = "ADMIN" | "MANAGER" | "HEADCOOK" | "SUPERVISOR" | "VOYAGER";

export type SidebarItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
    active?: boolean;
};

export type SidebarSection = {
    label: string;
    items: SidebarItem[];
};

export const sidebarConfig: Record<Role, SidebarSection[]> = {
    VOYAGER: [
        {
            label: "Orders",
            items: [
                {
                    title: "Orders",
                    href: "/voyager",
                    icon: <List className="w-5 h-5" />
                },
                {
                    title: "Order catering",
                    href: "/voyager/catering",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
                {
                    title: "Order stationery",
                    href: "/voyager/stationery",
                    icon: <CalendarIcon className="w-5 h-5" />
                }
            ]
        },
        {
            label: "Bookings",
            items: [
                {
                    title: "Bookings",
                    href: "/voyager",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
                {
                    title: "New Booking",
                    href: "/voyager/new",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
                {
                    title: "Book movie",
                    href: "/voyager/movie",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
                {
                    title: "Book saloon",
                    href: "/voyager/saloon",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
                {
                    title: "Book fitness center",
                    href: "/voyager/fitness",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
                {
                    title: "Book party hall",
                    href: "/voyager/party",
                    icon: <CalendarIcon className="w-5 h-5" />
                },
            ]
        }
    ],
    ADMIN: [
        {
            label: "General",
            items: [
                {
                    title: "Dashboard",
                    href: "/admin",
                    icon: <LayoutDashboard className="w-5 h-5" />,
                },
                {
                    title: "Bookings",
                    href: "/admin/bookings",
                    icon: <CalendarIcon className="w-5 h-5" />,
                },
                {
                    title: "Products Menu",
                    href: "/admin/products",
                    icon: <SquareMenu className="w-5 h-5" />,
                },
                {
                    title: "Add Product",
                    href: "/admin/products/new",
                    icon: <List className="w-5 h-5" />,
                },
                {
                    title: "Edit/Delete Product",
                    href: "/admin/products/[id]",
                    icon: <List className="w-5 h-5" />,
                },
                {
                    title: "Maintain Menu Items",
                    href: "/admin/menu",
                    icon: <ScrollText className="w-5 h-5" />,
                },
            ]
        },
        {
            label: "Management",
            items: [
                {
                    title: "Voyage registration",
                    href: "/admin/voyages/new",
                    icon: <Users className="w-5 h-5" />,
                },
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
                    title: "Headcook Orders",
                    href: "/headcook",
                    icon: <ChefHat className="w-5 h-5" />,
                },
            ]
        }
    ],
    SUPERVISOR: [
        {
            label: "General",
            items: [
                {
                    title: "Stationery Orders",
                    href: "/supervisor",
                    icon: <ClipboardList className="w-5 h-5" />,
                    active: false,
                }
            ]
        }
    ],

};
