// File: app/(protected)/supervisor/stationery/page.tsx
import { getOrderedStationery } from "@/lib/actions/orders";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function StationeryPage() {
    const orders = await getOrderedStationery();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base border-b pb-4">
                    <h1 className="text-2xl font-bold">Ordered Stationery</h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className="w-full h-[500px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No stationery orders found.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {orders.map(order => (
                            <li key={order.id} className="border p-3 rounded-md">
                                <div className="font-medium">{order.orderedBy.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    Qty: {order.items.map(item => item.quantity).join(", ")} | Status: {order.status}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
