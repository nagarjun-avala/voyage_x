// File: app/(protected)/voyager/page.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Product, ProductCategory } from "@prisma/client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

export default function VoyagerMenuWithCartPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<(ProductCategory | "ALL")[]>([])
    const [selectedCategory, setSelectedCategory] = useState("ALL")
    const [cart, setCart] = useState<{ [productId: string]: number }>({})
    const [checkoutOpen, setCheckoutOpen] = useState(false)

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch("/api/products")
            const data = await res.json()
            setProducts(data)
            const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category)))
            setCategories(["ALL", ...uniqueCategories as ProductCategory[]])
        }
        fetchProducts()

        const savedCart = localStorage.getItem("voyager_cart")
        if (savedCart) setCart(JSON.parse(savedCart))
    }, [])

    useEffect(() => {
        localStorage.setItem("voyager_cart", JSON.stringify(cart))
    }, [cart])

    const filteredProducts =
        selectedCategory === "ALL"
            ? products
            : products.filter((p) => p.category === selectedCategory)

    const addToCart = (id: string) => {
        setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    }

    const removeFromCart = (id: string) => {
        setCart((prev) => {
            const updated = { ...prev }
            if (updated[id] > 1) updated[id]--
            else delete updated[id]
            return updated
        })
    }

    const totalAmount = Object.entries(cart).reduce((acc, [id, qty]) => {
        const product = products.find((p) => p.id === id)
        return acc + (product ? product.price * qty : 0)
    }, 0)

    const checkoutItems = Object.entries(cart).map(([id, qty]) => {
        const product = products.find((p) => p.id === id)
        return product ? { ...product, quantity: qty } : null
    }).filter(Boolean)

    const handlePlaceOrder = async () => {
        const payload = {
            type: "CATERING",
            items: checkoutItems.map((item) => ({
                productId: item?.id,
                name: item?.name,
                quantity: item?.quantity,
                unit: "pcs",
                notes: item?.description || ""
            })),
            totalPrice: totalAmount,
        }

        const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            toast.success("Order placed successfully!")
            const { id } = await res.json()
            setCart({})
            localStorage.removeItem("voyager_cart")
            setCheckoutOpen(false)
            // window.location.href = `/voyager/orders/${id}`
        } else {
            toast.error("Something went wrong.")
        }
    }


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Voyager Menu</h1>
                <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="relative">
                            <ShoppingCart />
                            <Badge
                                className="absolute -right-1.5 -top-1.5 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                                variant="destructive"
                            >
                                {Object.values(cart).reduce((a, b) => a + b, 0)}
                            </Badge>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg w-full">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold mb-4">Cart Summary </DialogTitle>
                        </DialogHeader>
                        {checkoutItems.length === 0 ? (
                            <p className="text-muted-foreground">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-3">
                                {checkoutItems.map((item) => (
                                    <div key={item!.id} className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{item!.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatCurrency(item!.price)} × {item!.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold">{formatCurrency(item!.price * item!.quantity)}</p>
                                    </div>
                                ))}
                                <hr />
                                <div className="flex justify-between font-semibold text-lg">
                                    <p>Total</p>
                                    <p>{formatCurrency(totalAmount)}</p>
                                </div>
                                <Button className="w-full" onClick={handlePlaceOrder}>Place Order</Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <Tabs defaultValue="ALL" value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList>
                    {categories.map((category) => (
                        <TabsTrigger key={category} value={category} className="capitalize">
                            {category.toLowerCase()}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={selectedCategory} className="mt-4">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="relative">
                                {product.imageUrl && (
                                    <CardHeader className="relative">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            width={300}
                                            height={200}
                                            className="rounded-md w-full object-cover h-40"
                                        />
                                    </CardHeader>
                                )}
                                <CardContent className="space-y-2">
                                    <CardTitle className="text-base font-semibold">
                                        {product.name}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {product.description}
                                    </p>
                                    <p className="text-sm font-medium text-primary font-mono">
                                        {formatCurrency(product.price)}
                                    </p>
                                    <div className="flex items-center gap-3 float-end">
                                        <Button
                                            size="sm"
                                            onClick={() => removeFromCart(product.id)}
                                            variant="outline"
                                            disabled={!cart[product.id]}
                                        >
                                            -
                                        </Button>
                                        <span className="text-sm font-semibold">
                                            {cart[product.id] || 0}
                                        </span>
                                        <Button size="sm" onClick={() => addToCart(product.id)}>
                                            +
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
