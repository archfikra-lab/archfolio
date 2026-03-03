'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPrizesAction(activeOnly = false) {
    try {
        const prizes = await prisma.prizeType.findMany({
            where: activeOnly ? { active: true } : undefined,
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: prizes };
    } catch (error) {
        console.error("Failed to fetch prizes:", error);
        return { error: "Failed to fetch prizes" };
    }
}

export async function createPrizeAction(name: string, description: string) {
    if (!name) return { error: "Name is required" };

    try {
        await prisma.prizeType.create({
            data: { name, description }
        });
        revalidatePath('/[locale]/admin/prizes');
        revalidatePath('/[locale]/author/submit');
        return { success: true };
    } catch (error) {
        console.error("Failed to create prize:", error);
        return { error: "Failed to create prize" };
    }
}

export async function togglePrizeStatusAction(id: string, active: boolean) {
    try {
        await prisma.prizeType.update({
            where: { id },
            data: { active }
        });
        revalidatePath('/[locale]/admin/prizes');
        revalidatePath('/[locale]/author/submit');
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle prize status:", error);
        return { error: "Failed to update prize" };
    }
}
