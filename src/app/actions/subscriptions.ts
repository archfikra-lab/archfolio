'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSubscriptionPlansAction() {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { price: 'asc' }
        });
        return { success: true, data: plans };
    } catch (error) {
        console.error("Failed to fetch subscription plans:", error);
        return { error: "Failed to fetch subscription plans" };
    }
}

export async function createSubscriptionPlanAction(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr) || 0;
    const downloadLimitStr = formData.get('downloadLimit') as string;
    const downloadLimit = parseInt(downloadLimitStr) || 0;
    const featuresJson = formData.get('featuresJson') as string;

    const perMonth = formData.get('perMonth') === 'on';
    const canDownloadHighRes = formData.get('canDownloadHighRes') === 'on';
    const canDownloadCad = formData.get('canDownloadCad') === 'on';
    const canDownloadBim = formData.get('canDownloadBim') === 'on';

    if (!name) return { error: "Name is required" };

    try {
        await prisma.subscriptionPlan.upsert({
            where: { name },
            update: {
                description,
                price,
                downloadLimit,
                featuresJson: featuresJson || '[]',
                perMonth,
                canDownloadHighRes,
                canDownloadCad,
                canDownloadBim
            },
            create: {
                name,
                description,
                price,
                downloadLimit,
                featuresJson: featuresJson || '[]',
                perMonth,
                canDownloadHighRes,
                canDownloadCad,
                canDownloadBim
            }
        });
        revalidatePath('/[locale]/admin/subscriptions');
        revalidatePath('/[locale]/(main)/pricing');
        return { success: true };
    } catch (error) {
        console.error("Failed to create subscription plan:", error);
        return { error: "Failed to create subscription plan" };
    }
}

export async function toggleSubscriptionPlanAction(id: string, active: boolean) {
    try {
        await prisma.subscriptionPlan.update({
            where: { id },
            data: { active }
        });
        revalidatePath('/[locale]/admin/subscriptions');
        revalidatePath('/[locale]/(main)/pricing');
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle plan status:", error);
        return { error: "Failed to update plan" };
    }
}
