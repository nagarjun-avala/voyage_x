// File: prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const testUsers = [
    {
        name: "Admin",
        username: "admin123",
        email: "admin@medorms.com",
        password: "Admin@123",
        role: Role.ADMIN
    },
    {
        name: "Alice Admin",
        username: "alice",
        email: "admin@voyagex.dev",
        password: "Admin@123",
        role: Role.VOYAGER
    },
    {
        name: "Mark Manager",
        username: "manager",
        email: "manager@voyagex.dev",
        password: "Manager@123",
        role: Role.MANAGER
    },
    {
        name: "Henry Headcook",
        username: "headcook",
        email: "headcook@voyagex.dev",
        password: "Headcook@123",
        role: Role.HEADCOOK
    },
    {
        name: "Sophie Supervisor",
        username: "supervisor",
        email: "supervisor@voyagex.dev",
        password: "Supervisor@123",
        role: Role.SUPERVISOR
    },
    {
        name: "Rachel Receptionist",
        username: "reception",
        email: "reception@voyagex.dev",
        password: "Reception@123",
        role: Role.ADMIN
    },
];

async function main() {
    // 🧹 Clear existing records
    await prisma.auditLog.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.message.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    console.log("🧹✅ Existing records cleared.");
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
        data: [
            { name: "Ocean View Suite", type: "SUITE", capacity: 5, pricePerAdult: 3000, pricePerChild: 1500 },
            { name: "Standard Double", type: "DOUBLE", capacity: 2, pricePerAdult: 2000, pricePerChild: 1000 },
            { name: "Family Room", type: "FAMILY", capacity: 4, pricePerAdult: 2500, pricePerChild: 1200 },
        ],
    });
    console.log("✅ Rooms seeded.");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
