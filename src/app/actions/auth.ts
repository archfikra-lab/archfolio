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

export async function registerUserAction(formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const name = formData.get('name') as string;
        const password = formData.get('password') as string;

        if (!email || !password || !name) {
            return { success: false, error: "Missing required fields." };
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, error: "An account with this email already exists." };
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Try to find the free tier, assuming it's called 'Academic License' or similar
        // The user's seed script created: 'Academic License', 'Professional Tier', 'Enterprise Portfolio'
        const freePlan = await prisma.subscriptionPlan.findFirst({
            where: { name: 'Academic License' }
        });

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: passwordHash,
                role: "AUTHOR", // Default starting role
                subscriptionPlanId: freePlan?.id || null
            }
        });

        // Track user registration
        const { logActivity } = await import('@/lib/activity');
        await logActivity(newUser.id, "REGISTER");

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

