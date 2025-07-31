// File: lib/actions/orders.ts
"use server"
import { prisma } from "@/lib/prisma";
import { ProductCategory } from "@prisma/client";


export async function getOrderedStationery() {
    const allowedCategories: ProductCategory[] = ['STATIONERY', 'BOOK', 'CHOCOLATE', 'GIFT', 'OTHER'];
    const rawOrders = await prisma.order.findMany({
        where: {
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

    const filteredOrders = rawOrders.filter(order =>
        order.items.some(item =>
            allowedCategories.includes(item.product.category)
        ) &&
        !order.items.some(item => item.product.category === 'CATERING')
    );
    return filteredOrders;
}

export async function getOrderedCatering() {
    return await prisma.order.findMany({
        where: {
            items: {
                some: {
                    product: {
                        category: 'CATERING'
                    }
                }
            },
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

export const getOrdersTest = async () => {
    const rawOrders = await prisma.order.findMany({
        include: {
            orderedBy: {
                omit: {
                    password: true
                }
            },
            items: {
                include: {
                    product: {
                        select: {
                            category: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });


    const allowedCategories = ['STATIONERY', 'BOOK', 'CHOCOLATE', 'GIFT', 'OTHER'];

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