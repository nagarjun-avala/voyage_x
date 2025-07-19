import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { hash } from 'bcryptjs'

async function main() {
    const hashed = await hash('Admin@12345', 10)

    await prisma.user.create({
        data: {
            name: "Admin",
            username: "admin123",
            email: 'admin@medorms.com',
            password: hashed,
            role: 'ADMIN',
        },
    })
    console.log('Admin created')
}

main().catch(console.error).finally(() => prisma.$disconnect())