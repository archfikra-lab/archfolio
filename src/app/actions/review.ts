'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reviewProjectAction(projectId: string, newStatus: "APPROVED" | "REJECTED" | "DRAFT") {
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

        revalidatePath('/expert');
        revalidatePath('/academic');
        revalidatePath('/contributor');
        revalidatePath('/');

        return { success: true, project };
    } catch (error) {
        console.error("Failed to review project: ", error);
        throw new Error("Failed to review project");
    }
}
