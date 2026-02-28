const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users in the database.`);
    for (const u of users) {
        console.log(`- ${u.email} | Role: ${u.role} | HasPassword: ${!!u.password}`);
        if (u.email === 'admin@archfolio.com' && u.password) {
            const matches = await bcrypt.compare('password123', u.password);
            console.log(`  Password matches 'password123': ${matches}`);
        }
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
