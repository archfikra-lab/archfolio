'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitFeedback(formData: FormData) {
    const content = formData.get("content") as string;
    const urlContext = formData.get("urlContext") as string;

    if (!content) return { success: false, error: "Content is required" };

    try {
        await prisma.feedback.create({
            data: {
                content,
                urlContext
            }
        });

        revalidatePath(urlContext);
        return { success: true };
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return { success: false, error: "Failed to submit feedback" };
    }
}
