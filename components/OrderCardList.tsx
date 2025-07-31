"use client";

import { Order, OrderStatus } from "@/lib/types";
import { CheckCircle, X, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function OrderCardList({ orders, onStatusChange, isLoading = false }: { orders: Order[]; onStatusChange: ({ status, id }: { status: OrderStatus; id: string }) => void, isLoading?: boolean }) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                    <Card key={idx} className="shadow-sm border">
                        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-4 w-1/3" />
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <Skeleton className="h-3 w-1/4" />
                                    <Skeleton className="h-3 w-1/4" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[...Array(2)].map((_, itemIdx) => (
                                <div key={itemIdx} className="flex justify-between items-center">
                                    <Skeleton className="h-3 w-1/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            ))}
                            <div className="flex justify-end gap-2 mt-4">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.id} className="shadow-sm border">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">Order #{order.id.slice(-4)}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                                <p>Ordered by: <span className="font-medium text-foreground">{order.orderedBy.name}</span></p>
                                <p>Date: <span className="font-medium text-foreground">{format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}</span></p>
                                <span className="flex items-center gap-1">{getStatusIcon(order.status)} {order.status}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost">
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-muted border border-muted rounded-md mt-2">
                            {order.items.map((item) => (
                                <li key={item.id} className="px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-1">
                                    <div className="font-medium text-muted-foreground">
                                        {item.product.name} ({item.quantity} {item.unit ?? ""})
                                    </div>
                                    <div className="text-right text-muted-foreground sm:text-left">
                                        {item.quantity} × {formatCurrency(item.product.price)} = <span className="font-semibold text-foreground">{formatCurrency(item.quantity * item.product.price)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4">
                            {order.status !== "COMPLETED" ? (
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {order.status !== "APPROVED" ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => onStatusChange({ id: order.id, status: "APPROVED" })}
                                            className="text-blue-500"
                                        >
                                            <Check className="mr-1 h-4 w-4" /> Approve
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => onStatusChange({ id: order.id, status: "COMPLETED" })}
                                            className="text-emerald-500"
                                        >
                                            <CheckCircle className="mr-1 h-4 w-4" /> Completed
                                        </Button>
                                    )}

                                    <Button
                                        className="text-destructive"
                                        variant="outline"
                                        onClick={() => onStatusChange({ id: order.id, status: "REJECTED" })}
                                    >
                                        <X className="mr-1 h-4 w-4" /> Reject
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-emerald-500 flex justify-end gap-2">
                                    <CheckCircle /> Order Completed
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function getStatusIcon(status: OrderStatus) {
    switch (status) {
        case "PENDING":
            return <Clock className="w-4 h-4 text-orange-500" />;
        case "APPROVED":
            return <Check className="w-4 h-4 text-emerald-500" />;
        case "REJECTED":
            return <X className="w-4 h-4 text-destructive" />;
        case "COMPLETED":
            return <CheckCircle className="w-4 h-4 text-blue-500" />;
        default:
            return null;
    }
}

export default OrderCardList;
