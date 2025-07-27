// File: lib/actions/orders.ts
import { prisma } from "@/lib/prisma";

export async function getOrderedStationery() {
    return await prisma.order.findMany({
        where: {
            type: "STATIONERY",
            status: {
                in: ["PENDING", "APPROVED", "REJECTED"],
            },
        },
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
        orderBy: { createdAt: "desc" },
    });
}

export async function getOrderedCatering() {
    return await prisma.order.findMany({
        where: {
            type: "CATERING",
            status: {
                in: ["PENDING", "APPROVED", "REJECTED"],
            },
        },
        include: {
            orderedBy: {
                omit: {
                    password: true,
                }
            },
        },
        orderBy: { createdAt: "desc" },
    });
}