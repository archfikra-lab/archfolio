'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function downloadCaseStudyAction(projectId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscriptionPlan: true }
        });

        if (!user) return { success: false, error: "User not found." };

        const plan = user.subscriptionPlan;
        if (!plan) {
            return { success: false, error: "No active subscription plan found. Please explore the Pricing plans." };
        }

        if (plan.downloadLimit === 0) {
            return { success: false, error: "Your current plan does not include downloads. Please upgrade to a higher tier." };
        }

        // Handle unlimited downloads
        if (plan.downloadLimit === -1) {
            await prisma.user.update({
                where: { id: user.id },
                data: { downloadCount: { increment: 1 } }
            });

            const { logActivity } = await import('@/lib/activity');
            await logActivity(user.id, "DOWNLOAD", JSON.stringify({ projectId, type: "unlimited_tier" }));

            return {
                success: true,
                url: `/api/download/${projectId}`,
                features: {
                    canDownloadHighRes: plan.canDownloadHighRes,
                    canDownloadCad: plan.canDownloadCad,
                    canDownloadBim: plan.canDownloadBim
                }
            };
        }

        // Evaluate remaining standard downloads
        let usedEarned = false;
        if (user.downloadCount >= plan.downloadLimit) {
            // Check if they have earned rewards
            if (user.earnedDownloads > 0) {
                usedEarned = true;
            } else {
                return {
                    success: false,
                    error: `You have reached your limit of ${plan.downloadLimit} downloads per month, and have 0 Reward Downloads. Please upgrade your plan or upload more case studies.`,
                    requiresUpgrade: true
                };
            }
        }

        // Proceed and deduct
        await prisma.user.update({
            where: { id: user.id },
            data: usedEarned
                ? { earnedDownloads: { decrement: 1 } }
                : { downloadCount: { increment: 1 } }
        });

        const { logActivity } = await import('@/lib/activity');
        await logActivity(user.id, "DOWNLOAD", JSON.stringify({ projectId, type: usedEarned ? "reward_spent" : "standard" }));

        // In a real app this would sign a URL to S3 or similar. 
        // For the current setup, we just return success to let the UI know it can proceed.
        return {
            success: true,
            url: `/api/download/${projectId}`,
            features: {
                canDownloadHighRes: plan.canDownloadHighRes,
                canDownloadCad: plan.canDownloadCad,
                canDownloadBim: plan.canDownloadBim
            }
        };

    } catch (error: any) {
        console.error("Download Error:", error);
        return { success: false, error: "Failed to process download request." };
    }
}
