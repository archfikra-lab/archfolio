const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testUpsert() {
    try {
        const passwordHash = await bcrypt.hash("password123", 10);
        const roles = ["ADMIN", "CONTRIBUTOR", "ACADEMIC", "EXPERT"];

        for (const role of roles) {
            const email = `${role.toLowerCase()}@archfolio.com`;

            await prisma.user.upsert({
                where: { email },
                update: { password: passwordHash },
                create: {
                    email,
                    name: `Demo ${role}`,
                    role,
                    password: passwordHash
                }
            });
            console.log(`Upserted ${role} successfully`);
        }
    } catch (e) {
        console.error("UPSERT ERROR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testUpsert();
