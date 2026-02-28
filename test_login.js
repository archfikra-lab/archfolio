const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testLogin(email, password) {
    try {
        console.log(`Testing login for: ${email}`);
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            console.log("User not found in DB.");
            return;
        }

        if (!user.password) {
            console.log("User has no password.");
            return;
        }

        const isValid = await bcrypt.compare(password, user.password);
        console.log(`Password is valid? ${isValid}`);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testLogin("admin@archfolio.com", "password123");
