// File: app/(protected)/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, User, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Metadata } from "next";
import { formatCurrency } from "@/lib/utils";

export const generateMetadata = (): Metadata => ({
    title: "Admin | VoyageX",
});

export default async function AdminPage() {
    const [userCount, logsCount, revenue] = await Promise.all([
        prisma.user.count(),
        prisma.auditLog.count(),
        prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: { status: "APPROVED" },
        }),
    ]);

    const recentLogs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: true },
    });

    const stats = [
        {
            icon: <User className="w-5 h-5" />,
            label: "Active Users",
            value: userCount,
        },
        {
            icon: <IndianRupee className="w-5 h-5" />,
            label: "Total Revenue",
            value: formatCurrency(revenue._sum.totalPrice ?? 0),
        },
        {
            icon: <Activity className="w-5 h-5" />,
            label: "Audit Logs",
            value: logsCount,
        },
    ];

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
                <div className="bg-white dark:bg-muted rounded-md border divide-y">
                    {recentLogs.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground">No recent activity</div>
                    ) : (
                        recentLogs.map((log) => (
                            <div key={log.id} className="flex justify-between items-center px-4 py-3 text-sm">
                                <span>
                                    <strong>{log.user?.name || "Unknown User"}</strong> {log.action}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {format(log.createdAt, "PPpp")}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
