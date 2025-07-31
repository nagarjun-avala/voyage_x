export type GenderTypes =
    | "MALE"
    | "FEMALE"
    | "OTHER"

export interface User {
    id: string;
    name: string;
    username: string;
    email: string | null;
    avatar: string | null;
    isActive: boolean;
    role: "ADMIN";
    gender: GenderTypes;
    contact: string | null
    lastLogin: string | null
}

export type OrderStatus =
    | "PENDING"
    | "APPROVED"
    | "COMPLETED"
    | "REJECTED"
    | "RECEIVED"

export interface Order {
    id: string;
    status: OrderStatus;
    userId: string;
    orderedBy: User;
    items: OrderItem[];
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}



export type ProductCategory =
    | 'CATERING'
    | 'STATIONERY'
    | 'GIFT'
    | 'CHOCOLATE'
    | 'BOOK'
    | 'OTHER';

export interface Product {
    id: string;
    name: string;
    description: string | null
    category: ProductCategory;
    price: number;
    stock: number;
    imageUrl: string | null
    metadata: Record<string, unknown> | null
    createdAt: string;
    updatedAt: string;

}



export interface OrderItem {
    id: string;
    unit: string | null;
    notes: string | null;
    productId: string;
    product: Product;
    quantity: number;
    orderId: string | null;
}

export type RoomType =
    | 'SINGLE'
    | 'DOUBLE'
    | 'FAMILY'
    | 'SUITE'

export interface Room {
    id: string;
    name: string;
    type: RoomType;
    capacity: number;
    pricePerAdult: number;
    pricePerChild: number;
    createdAt: string;
    updatedAt: string;
}
