'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function createDemoAccounts() {
    try {
        const passwordHash = await bcrypt.hash("password123", 10);
        const roles: Role[] = ["ADMIN", "AUTHOR", "ACADEMIC", "EXPERT"];

        for (const role of roles) {
            const email = `${role.toLowerCase()}@archfolio.com`;

            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                await prisma.user.update({
                    where: { email },
                    data: { password: passwordHash }
                });
            } else {
                await prisma.user.create({
                    data: {
                        email,
                        name: `Demo ${role}`,
                        role,
                        password: passwordHash
                    }
                });
            }
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
