// File: app/(protected)/admin/products/add/page.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductCategory } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const categories: ProductCategory[] = [
    "CATERING",
    "STATIONERY",
    "GIFT",
    "CHOCOLATE",
    "BOOK",
    "OTHER",
]

export default function AddProductPage() {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "CATERING",
        price: "",
        stock: "",
        imageUrl: ""
    })

    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    stock: parseInt(form.stock)
                })
            })

            if (!res.ok) throw new Error("Failed to add product")

            toast.success("Product added successfully!")
            router.push("/admin/products")
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    function updateField(field: string, value: string) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={form.name} onChange={e => updateField("name", e.target.value)} required />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea value={form.description} onChange={e => updateField("description", e.target.value)} />
                    </div>
                    <div>
                        <Label>Category</Label>
                        <Select value={form.category} onValueChange={(value) => updateField("category", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Price (₹)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={form.price}
                            onChange={e => updateField("price", e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label>Stock</Label>
                        <Input
                            type="number"
                            value={form.stock}
                            onChange={e => updateField("stock", e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label>Image URL</Label>
                        <Input
                            value={form.imageUrl}
                            onChange={e => updateField("imageUrl", e.target.value)}
                            placeholder="/images/product.jpg"
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Add Product"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
