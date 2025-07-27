import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { ProductCategory } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import { format } from 'date-fns'
import Image from 'next/image'
import React from 'react'

type ProductCardTypes = {
    product:
    {
        id: string
        imageUrl: string | null
        name: string
        stock: number
        description: string | null
        price: number
        category: ProductCategory
        metadata: JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }
}

const ProductCard = ({ product }: ProductCardTypes) => {
    return (
        <Card key={product.id} className="hover:shadow-md transition-all">
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
            <CardContent>
                <CardTitle className="text-base font-semibold mb-1">
                    {product.name} (<span className='text-muted-foreground'>{product.category.toLocaleLowerCase()}</span>)
                </CardTitle>
                <p className="text-sm text-muted-foreground truncate">
                    {product.description}
                </p>
                <p className="text-sm font-medium text-primary mt-2">
                    {formatCurrency(product.price)}
                    <Badge
                        variant="outline"
                        className="float-end bg-white/80 text-xs"
                    >
                        Stock: {product.stock}
                    </Badge>
                </p>
            </CardContent>
        </Card>
    )
}

export default ProductCard