import { prisma } from "@/lib/prisma";

export async function logActivity(userId: string | null | undefined, action: string, details?: string) {
    try {
        await prisma.activityLog.create({
            data: {
                userId: userId || undefined,
                action,
                details
            }
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
