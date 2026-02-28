const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function test() {
    try {
        const email = "admin@archfolio.com";
        const password = "password123";
        console.log(`Checking DB for ${email}`);

        const user = await prisma.user.findUnique({ where: { email } });
        console.log("User found:", !!user);

        if (user) {
            console.log("Hash in DB:", user.password);
            const isValid = await bcrypt.compare(password, user.password);
            console.log("bcryptjs compare result:", isValid);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
