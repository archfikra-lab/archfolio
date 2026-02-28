'use server';

import { prisma } from "@/lib/prisma";

export async function getRegisteredUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                name: true
            },
            orderBy: {
                role: 'asc'
            }
        });
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}
