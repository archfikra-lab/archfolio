'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

export async function getSubscribersAction() {
    try {
        const users = await prisma.user.findMany({
            include: {
                subscriptionPlan: true,
                activityLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const settings = await prisma.systemSettings.findUnique({
            where: { id: "global" }
        });

        // Initialize settings if they don't exist
        const safeSettings = settings || await prisma.systemSettings.create({
            data: { id: "global", rewardUploadsRequired: 1, rewardDownloadsGranted: 5 }
        });

        return { success: true, users, settings: safeSettings };
    } catch (error: any) {
        console.error("Failed to fetch subscribers:", error);
        return { success: false, error: "Failed to fetch subscribers" };
    }
}

export async function updateSubscriberPlanAction(userId: string, planId: string | null) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { subscriptionPlanId: planId }
        });

        await logActivity(userId, "PLAN_CHANGED", JSON.stringify({ newPlanId: planId }));
        revalidatePath('/en/admin/subscribers');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: "Failed to update subscriber plan" };
    }
}

export async function updateRewardSettingsAction(uploadsRequired: number, downloadsGranted: number) {
    try {
        await prisma.systemSettings.upsert({
            where: { id: "global" },
            update: {
                rewardUploadsRequired: uploadsRequired,
                rewardDownloadsGranted: downloadsGranted
            },
            create: {
                id: "global",
                rewardUploadsRequired: uploadsRequired,
                rewardDownloadsGranted: downloadsGranted
            }
        });

        revalidatePath('/en/admin/subscribers');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: "Failed to update reward settings" };
    }
}
