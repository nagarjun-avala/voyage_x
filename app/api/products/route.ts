// File: app/api/products/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { category: "asc" },
        })
        return NextResponse.json(products)
    } catch (error) {
        console.error("Failed to fetch products:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
