// File: app/api/orders/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session";

type OrderItem = {
    productId: string;
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
};

export async function POST(req: Request) {
    try {
        const session = await getSession();

        if (!session || session.role !== "VOYAGER") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { items, totalPrice, type = "CATERING" } = await req.json()
        // return NextResponse.json({ success: true, items, session })

        if (!items || items.length === 0 || typeof totalPrice !== "number") {
            return new NextResponse("Invalid request", { status: 400 })
        }

        const newOrder = await prisma.order.create({
            data: {
                status: "PENDING",
                userId: typeof session!.id === "string" ? session!.id : "", // !Error: It is either "UNDEFINED" or " "
                type,
                totalPrice,
                items: {
                    create: (items as OrderItem[]).map((item: OrderItem) => ({
                        quantity: item.quantity,
                        unit: item.unit,
                        notes: item.notes,
                        product: {
                            connect: { id: item.productId }
                        }
                    })),
                },
            },
        })

        return NextResponse.json({ success: true, order: newOrder })
    } catch (error) {
        console.error("Order POST error:", error)
        return new NextResponse(`Internal Server Error: ${error}`, { status: 500 })
    }
}

export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== "VOYAGER") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: { userId: typeof session.id === "string" ? session.id : "" },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        })

        return NextResponse.json({ success: true, message: "Order created successfullt!", orders })
    } catch (error) {
        console.error("Order GET error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
