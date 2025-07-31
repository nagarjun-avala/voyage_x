// File: prisma/seed.ts
import { PrismaClient, Role, ProductCategory, RoomType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const testUsers = [
    {
        name: "Admin",
        username: "admin",
        email: "admin@medorms.com",
        password: "Admin@12345",
        role: Role.ADMIN
    },
    {
        name: "Alice",
        username: "alice",
        email: "admin@voyagex.dev",
        password: "Admin@12345",
        role: Role.VOYAGER
    },
    {
        name: "Mark Manager",
        username: "manager",
        email: "manager@voyagex.dev",
        password: "Manager@12345",
        role: Role.MANAGER
    },
    {
        name: "Henry Headcook",
        username: "headcook",
        email: "headcook@voyagex.dev",
        password: "Headcook@12345",
        role: Role.HEADCOOK
    },
    {
        name: "Sophie Supervisor",
        username: "supervisor",
        email: "supervisor@voyagex.dev",
        password: "Supervisor@12345",
        role: Role.SUPERVISOR
    },
    {
        name: "Rachel Receptionist",
        username: "reception",
        email: "reception@voyagex.dev",
        password: "Reception@12345",
        role: Role.ADMIN
    },
];

const testProducts = [
    // Catering
    {
        name: "Buffet Dinner",
        description: "Multi-cuisine buffet with desserts",
        category: ProductCategory.CATERING,
        price: 799,
        stock: 30,
    },
    {
        name: "Cocktail Beverages",
        description: "Refreshing mocktails & cocktails",
        category: ProductCategory.CATERING,
        price: 399,
        stock: 50,
    },

    // Stationery
    {
        name: "VoyageX Notepad",
        description: "Eco-friendly notepad for journaling",
        category: ProductCategory.STATIONERY,
        price: 49,
        stock: 200,
    },
    {
        name: "Ocean Ink Pen Set",
        description: "Pack of 5 smooth-writing gel pens",
        category: ProductCategory.STATIONERY,
        price: 99,
        stock: 150,
    },

    // Gifts
    {
        name: "Mini VoyageX Globe",
        description: "3D souvenir globe with cruise routes",
        category: ProductCategory.GIFT,
        price: 249,
        stock: 40,
    },

    // Chocolate
    {
        name: "Belgian Chocolate Box",
        description: "Assorted chocolates crafted onboard",
        category: ProductCategory.CHOCOLATE,
        price: 349,
        stock: 60,
    },

    // Books
    {
        name: "Tales from the Ocean",
        description: "A collection of seafaring stories",
        category: ProductCategory.BOOK,
        price: 199,
        stock: 80,
    },

    // Other
    {
        name: "Reusable Travel Cup",
        description: "Insulated cup with anti-spill lid",
        category: ProductCategory.OTHER,
        price: 129,
        stock: 100,
    },
]

const testRooms = [
    { name: "Ocean View Suite", type: RoomType.SUITE, capacity: 5, pricePerAdult: 3000, pricePerChild: 1500 },
    { name: "Standard Double", type: RoomType.DOUBLE, capacity: 2, pricePerAdult: 2000, pricePerChild: 1000 },
    { name: "Family Room", type: RoomType.FAMILY, capacity: 4, pricePerAdult: 2500, pricePerChild: 1200 },
]

async function main() {
    // 🧹 Clear existing records
    await prisma.auditLog.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.room.deleteMany();
    await prisma.order.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    console.log("🧹✅ Existing records cleared.");

    // 🧑‍🤝‍🧑 Seed test users
    for (const user of testUsers) {
        const hashed = await bcrypt.hash(user.password, 10);
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                name: user.name,
                username: user.username,
                email: user.email,
                password: hashed,
                role: user.role,
                isActive: true,
            },
        });
        console.log("User created or updated:", user.email);
    }

    console.log("✅ Test users seeded.");
    await prisma.room.createMany({
        data: testRooms,
    });
    console.log("✅ Rooms seeded.");

    await prisma.product.createMany({
        data: testProducts,
    });
    console.log("✅ Seeded initial products.");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
