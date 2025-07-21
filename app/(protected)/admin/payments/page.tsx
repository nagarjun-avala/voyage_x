// File: app/(protected)/admin/payments/page.tsx
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


export const generateMetadata = () => ({
    title: "Payments | VoyageX",
});


export default async function AdminPaymentsPage() {
    const payments = await prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true },
        take: 20,
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="px-2 py-2">User</th>
                            <th className="px-2 py-2">Amount</th>
                            <th className="px-2 py-2">Provider</th>
                            <th className="px-2 py-2">Method</th>
                            <th className="px-2 py-2">Status</th>
                            <th className="px-2 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-2 py-2 text-center">
                                    No payments found
                                </td>
                            </tr>
                        ) : (
                            payments.map((p) => (
                                <tr key={p.id} className="border-b hover:bg-muted/40">
                                    <td className="px-2 py-2">{p.user?.name || "Unknown"}</td>
                                    <td className="px-2 py-2">₹{p.amount}</td>
                                    <td className="px-2 py-2">{p.provider}</td>
                                    <td className="px-2 py-2">{p.method || "N/A"}</td>
                                    <td className="px-2 py-2">
                                        <Badge variant={p.status === "SUCCESS" ? "success" : "destructive"}>
                                            {p.status}
                                        </Badge>
                                    </td>
                                    <td className="px-2 py-2 text-muted-foreground">
                                        {format(p.createdAt, "PPpp")}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
