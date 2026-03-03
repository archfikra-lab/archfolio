'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reviewProjectAction(
    projectId: string,
    newStatus: "APPROVED" | "REJECTED" | "DRAFT",
    feedbackParams?: { content: string, urlContext: string, type: string }
) {
    if (!projectId) throw new Error("Missing project ID");

    try {
        const project = await prisma.project.update({
            where: { id: projectId },
            data: {
                status: newStatus,
                // In a real app we'd set reviewerId from the session here
                reviewer: {
                    connectOrCreate: {
                        where: { email: 'reviewer@fikra.test' },
                        create: { email: 'reviewer@fikra.test', name: 'Mock Reviewer', role: 'EXPERT' }
                    }
                }
            }
        });

        // If feedback was provided (e.g., during rejection/requesting revisions)
        if (feedbackParams && feedbackParams.content) {
            await prisma.feedback.create({
                data: {
                    content: feedbackParams.content,
                    urlContext: feedbackParams.urlContext,
                    type: feedbackParams.type,
                    projectId: projectId,
                    authorId: project.authorId // Linking it back so the author sees it
                }
            });
        }

        // Reward System Engine
        if (newStatus === "APPROVED" && project.authorId) {
            const settings = await prisma.systemSettings.findUnique({ where: { id: "global" } });

            if (settings && settings.rewardUploadsRequired > 0 && settings.rewardDownloadsGranted > 0) {
                // Count author's total approved projects
                const totalApproved = await prisma.project.count({
                    where: {
                        authorId: project.authorId,
                        status: "APPROVED"
                    }
                });

                // Check if this latest approval hits the required threshold multiplier
                if (totalApproved > 0 && totalApproved % settings.rewardUploadsRequired === 0) {
                    await prisma.user.update({
                        where: { id: project.authorId },
                        data: {
                            earnedDownloads: { increment: settings.rewardDownloadsGranted }
                        }
                    });

                    const { logActivity } = await import('@/lib/activity');
                    await logActivity(
                        project.authorId,
                        "REWARD_EARNED",
                        JSON.stringify({
                            granted: settings.rewardDownloadsGranted,
                            triggerProject: project.id,
                            totalApproved
                        })
                    );
                }
            }
        }

        revalidatePath('/expert');
        revalidatePath('/academic');
        revalidatePath('/author');
        revalidatePath('/');

        // Also revalidate the specific project route
        revalidatePath(`/en/project/${projectId}`);

        return { success: true, project };
    } catch (error) {
        console.error("Failed to review project: ", error);
        throw new Error("Failed to review project");
    }
}
