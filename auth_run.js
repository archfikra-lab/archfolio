const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function createDemoAccounts() {
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
            console.log("Upserted", email);
        }
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = { createDemoAccounts };
