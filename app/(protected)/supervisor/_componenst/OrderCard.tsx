"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleCheck, CircleX } from "lucide-react";
import { formatCurrency } from "@/lib/utils"; // or wherever your util lives

import React from "react";
import { Order, OrderStatus } from "@/lib/types";

type Props = {
    order: Order;
    onStatusChange: (payload: { id: string; status: OrderStatus }) => void;
    className?: string;
};


export default function OrderCard({ order, onStatusChange, className }: Props) {
    return (
        <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg py-4 px-6 shadow-sm mb-3 min-h-44 ${className ?? ""}`}

        >
            <div className="bg-white dark:bg-gray-900">
                <h2 className="text-lg font-semibold inline">
                    Ordered by:{" "}
                    <span className="text-primary">{order.orderedBy.name}</span>
                    <span className="text-sm text-muted-foreground mb-2 inline">
                        &nbsp;( Ordered on: {format(order.createdAt, "PPP")}, Status :{" "}
                        {order.status})
                    </span>
                </h2>

                <ul className="list-decimal list-inside pl-5 space-y-1 text-sm mt-2">
                    {order.items.map((item) => (
                        <li key={item.id}>
                            {item.product.name} : {item.quantity}{" "}
                            {item.unit ? item.unit : ""} — {item.quantity} *{" "}
                            {formatCurrency(item.product.price)} ={" "}
                            {formatCurrency(item.quantity * item.product.price)}
                        </li>
                    ))}
                </ul>
            </div>

            {order.status !== "COMPLETED" ? (
                <div className="flex flex-col items-end justify-between">
                    {order.status !== "APPROVED" ? (
                        <Button
                            variant={"outline"}
                            onClick={() => onStatusChange({ id: order.id, status: "APPROVED" })}
                            className="text-blue-500 cursor-pointer"
                        >
                            <CircleCheck className="mr-1 h-4 w-4" /> Approve
                        </Button>
                    ) : (
                        <Button
                            variant={"outline"}
                            onClick={() => onStatusChange({ id: order.id, status: "COMPLETED" })}
                            className="text-emerald-500 cursor-pointer"
                        >
                            <CheckCircle className="mr-1 h-4 w-4" /> Completed
                        </Button>
                    )}

                    <Button
                        className="text-destructive cursor-pointer"
                        variant={"outline"}
                        onClick={() => onStatusChange({ id: order.id, status: "REJECTED" })}
                    >
                        <CircleX className="mr-1 h-4 w-4" /> Reject
                    </Button>
                </div>
            ) : (
                <div className="text-emerald-500 flex justify-end gap-2">
                    <CheckCircle /> Order Completed
                </div>
            )}
        </div>
    );
}
