// File: lib/actions/orders.ts
"use server"
import { prisma } from "@/lib/prisma";
import { ProductCategory } from "@prisma/client";
import { OrderStatus } from "../types";
import { getSession, SessionPayload } from "../session";


export const getOrderedCatering = async () => {
    const rawOrders = await prisma.order.findMany({
        include: {
            orderedBy: {
                omit: {
                    password: true,
                }
            },
            items: {
                include: {
                    product: true, // Include product details
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });


    const allowedCategories: ProductCategory[] = ['CATERING'];

    const filteredOrders = rawOrders.map(order => {
        const filteredItems = order.items.filter(item =>
            allowedCategories.includes(item.product?.category)
        );

        return {
            ...order,
            items: filteredItems,
        };
    }).filter(order => order.items.length > 0); // remove orders that had nothing valid

    return filteredOrders
}
export const getOrderedStationery = async () => {
    const rawOrders = await prisma.order.findMany({
        include: {
            orderedBy: {
                omit: {
                    password: true,
                }
            },
            items: {
                include: {
                    product: true, // Include product details
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });


    const allowedCategories: ProductCategory[] = ['STATIONERY', 'BOOK', 'CHOCOLATE', 'GIFT', 'OTHER'];

    const filteredOrders = rawOrders.map(order => {
        const filteredItems = order.items.filter(item =>
            allowedCategories.includes(item.product?.category)
        );

        return {
            ...order,
            items: filteredItems,
        };
    }).filter(order => order.items.length > 0); // remove orders that had nothing valid

    return filteredOrders
}

export const changeOrderStatus = async (status: OrderStatus, id: string) => {
    const session = await getSession() as SessionPayload;

    if (!session || session == undefined || session.role !== "VOYAGER") {
        console.log("Unauthorized")
    }
    const order = await prisma.order.update({
        where: {
            id
        },
        data: {
            status: status,
        },
    })
    return order
}