// File: app/(protected)/dashboard/products/page.tsx

"use client"

import { useEffect, useState } from "react"
import { ProductCategory, Product } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "./ProductCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductGalleryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<(ProductCategory | "ALL")[]>([])

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch("/api/products")
            const data = await res.json()
            setProducts(data)
            const uniqueCategories = Array.from(
                new Set(data.map((p: Product) => p.category))
            ) as ProductCategory[]
            setCategories(["ALL", ...uniqueCategories])
        }
        fetchProducts()
    }, [])

    const filteredProducts = (category: ProductCategory | "ALL") => {
        return category === "ALL"
            ? products
            : products.filter((p) => p.category === category)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl font-bold">Available Products</h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="ALL" className="w-full">
                    <TabsList className="mb-5">
                        {categories.map((category) => (
                            <TabsTrigger
                                key={category}
                                value={category}
                                className="capitalize"
                            >
                                {category.toLowerCase()}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map((category) => (
                        <TabsContent key={category} value={category}>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {filteredProducts(category).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>

    )
}
