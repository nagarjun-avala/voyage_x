// File: app/(protected)/supervisor/stationery/page.tsx
"use client"

import { getOrdersTest } from "@/lib/actions/orders";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrderDataTable, OrderTableType } from "./OrderCard";

// import data from "./data.json"
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { CheckCircle, Loader } from "lucide-react";
import { IconExclamationCircle } from "@tabler/icons-react";


export default function StationeryPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [tableData, setTableData] = useState<OrderTableType[]>([])
    const [pendingOrders, setPendingOrders] = useState(0)
    const [approvedOrders, setApprovedOrders] = useState(0)
    const [rejectedOrders, setRejectedOrders] = useState(0)

    useEffect(() => {
        async function fetchOrders() {
            const res = await getOrdersTest()
            setOrders(res as unknown as Order[])
        }

        fetchOrders()
    }, [])

    useEffect(() => {
        const pending = orders.filter(order => order.status === "PENDING")
        setPendingOrders(pending.length)
        const approved = orders.filter(order => order.status === "APPROVED")
        setApprovedOrders(approved.length)
        const rejected = orders.filter(order => order.status === "REJECTED")
        setRejectedOrders(rejected.length)
        const dataForTable: OrderTableType[] = orders.map(order => ({
            id: order.id,
            orderedBy: order.orderedBy.name,
            status: order.status,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
        }));
        setTableData(dataForTable)
    }, [orders])

    // const orders = await getOrderedStationery();

    // console.log("orders\n", orders)
    console.log({ orders, tableData })



    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base border-b pb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Ordered Stationery</h1>
                    <div className="flex items-center gap-2">
                        Orders: <div className="text-orange-600 flex items-center gap-1"><Loader className="animate-spin h-3 w-3" /> Pending - {pendingOrders}</div>, <div className="text-emerald-500 flex items-center gap-1"> <CheckCircle className="w-3 h-3" /> Approved - {approvedOrders}</div>,<div className="text-destructive flex items-center gap-1"><IconExclamationCircle className="w-3 h-3" /> Rejected - {rejectedOrders}</div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <OrderDataTable data={tableData} />
                <ul className="space-y-2">
                    {tableData.map(order => (
                        <li key={order.id} className="border p-3 rounded-md">
                            <div className="font-medium">{order.orderedBy}</div>
                            <div className="text-sm text-muted-foreground">
                                Total Price: {order.totalPrice} | Status: {order.status}
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
