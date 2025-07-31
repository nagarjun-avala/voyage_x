"use client";

import { useCallback, useEffect, useState } from "react";
import { changeOrderStatus, getOrderedCatering } from "@/lib/actions/orders";
import { Order, OrderStatus } from "@/lib/types";
import { CheckCircle } from "lucide-react";
import { IconHourglassHigh, IconThumbUp, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import OrderCardList from "@/components/OrderCardList";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function CateringPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [approvedOrders, setApprovedOrders] = useState(0);
    const [rejectedOrders, setRejectedOrders] = useState(0);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getOrderedCatering();
            const parsedOrders = res as unknown as Order[];
            setOrders(parsedOrders);

            let pending = 0,
                approved = 0,
                rejected = 0;
            for (const order of parsedOrders) {
                if (order.status === "PENDING") pending++;
                else if (order.status === "APPROVED") approved++;
                else if (order.status === "REJECTED") rejected++;
            }
            setPendingOrders(pending);
            setApprovedOrders(approved);
            setRejectedOrders(rejected);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = [...orders]
        .filter((order) => (filter === "ALL" ? true : order.status === filter))
        .sort((a, b) =>
            a.status === "COMPLETED" ? 1 : b.status === "COMPLETED" ? -1 : 0
        );

    const handleChangeOrderStatus = async ({
        status,
        id,
    }: {
        status: OrderStatus;
        id: string;
    }) => {
        try {
            await changeOrderStatus(status, id);
            toast.success(`Status ${status.toLowerCase()}!`);
            fetchOrders();
        } catch (err) {
            toast.error("Failed to update status.");
            console.error(err);
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case "PENDING":
                return <IconHourglassHigh className="w-3 h-3" />;
            case "APPROVED":
                return <IconThumbUp className="w-3 h-3" />;
            case "REJECTED":
                return <IconX className="w-3 h-3" />;
            case "COMPLETED":
                return <CheckCircle className="w-3 h-3" />;
            default:
                return null;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-xl md:text-2xl font-bold">Ordered Catering (Headcook View)</h1>

                    <div className="flex flex-wrap gap-4 md:gap-6 items-center text-sm">
                        <div className="flex items-center gap-1 text-orange-600">
                            {getStatusIcon("PENDING")} Pending - {pendingOrders}
                        </div>

                        <div className="flex items-center gap-1 text-emerald-500">
                            {getStatusIcon("APPROVED")} Approved - {approvedOrders}
                        </div>

                        <div className="flex items-center gap-1 text-destructive">
                            {getStatusIcon("REJECTED")} Rejected - {rejectedOrders}
                        </div>

                        <Button
                            variant="outline"
                            onClick={fetchOrders}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm disabled:opacity-50"
                        >
                            {loading ? "Refreshing..." : "🔄 Refresh"}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <Tabs
                    value={filter}
                    onValueChange={setFilter}
                    className="w-full space-y-4"
                >
                    <TabsList className="flex flex-wrap gap-2">
                        <TabsTrigger value="ALL">All</TabsTrigger>
                        <TabsTrigger value="PENDING">Pending</TabsTrigger>
                        <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                        <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
                        <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
                    </TabsList>

                    <TabsContent value={filter}>
                        {filteredOrders.length === 0 ? (
                            <div className="flex items-center justify-center h-24 text-center text-muted-foreground">
                                No catering orders found.
                            </div>
                        ) : (
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={async (event) => {
                                    const { active, over } = event;
                                    if (active?.id && over?.id && active.id !== over.id) {
                                        const draggedOrder = orders.find((o) => o.id === active.id);
                                        const droppedOnOrder = orders.find((o) => o.id === over.id);
                                        if (draggedOrder && droppedOnOrder && draggedOrder.status !== droppedOnOrder.status) {
                                            await handleChangeOrderStatus({
                                                status: droppedOnOrder.status,
                                                id: draggedOrder.id,
                                            });
                                        }
                                    }
                                }}
                            >
                                <SortableContext items={filteredOrders} strategy={verticalListSortingStrategy}>
                                    <OrderCardList
                                        isLoading={loading}
                                        orders={filteredOrders}
                                        onStatusChange={handleChangeOrderStatus}
                                    />
                                </SortableContext>
                            </DndContext>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
