'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function submitProjectAction(formData: FormData) {
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const mapLink = formData.get('mapLink') as string;

    // Get JSON layers
    const crossDisciplinaryJson = formData.get('crossDisciplinaryJson') as string;
    const architecturalJson = formData.get('architecturalJson') as string;
    const structuralJson = formData.get('structuralJson') as string;
    const mepJson = formData.get('mepJson') as string;
    const electricalJson = formData.get('electricalJson') as string;

    const latStr = formData.get('latitude') as string;
    const lngStr = formData.get('longitude') as string;
    const latitude = latStr ? parseFloat(latStr) : null;
    const longitude = lngStr ? parseFloat(lngStr) : null;

    if (!title || !location) {
        throw new Error("Missing required fields");
    }

    // Process files
    const files = formData.getAll('files') as File[];
    const uploadedAttachments = [];

    if (files.length > 0 && files[0].size > 0) {
        const uploadDir = join(process.cwd(), 'public/uploads');
        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if exists
        }

        for (const file of files) {
            if (file.size === 0) continue;

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate unique filename
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);

            uploadedAttachments.push({
                url: `/uploads/${filename}`,
                type: file.type.startsWith('image/') ? 'photo' : 'document',
                description: file.name
            });
        }
    }

    // Process Prizes
    const selectedPrizesStr = formData.get('selectedPrizes') as string;
    let selectedPrizes: string[] = [];
    try {
        if (selectedPrizesStr) {
            selectedPrizes = JSON.parse(selectedPrizesStr);
        }
    } catch (e) { console.error('Failed to parse selectedPrizes', e); }

    try {
        const project = await prisma.project.create({
            data: {
                title,
                location,
                typology: 'Analyzed Case Study', // Default until detailed categorisation
                year: new Date().getFullYear(),
                shortDescription,
                mapLink,
                latitude,
                longitude,
                status: 'PENDING_REVIEW', // Automatically set to pending
                // Author is hardcoded for now until we have real auth session
                author: {
                    connectOrCreate: {
                        where: { email: 'author@fikra.test' },
                        create: { email: 'author@fikra.test', name: 'Mock Author', role: 'AUTHOR' }
                    }
                },
                disciplines: {
                    create: [
                        { type: 'Architectural Details', contentJson: architecturalJson || '{}' }
                    ]
                },
                prizes: {
                    create: selectedPrizes.map((prizeId) => ({
                        prizeType: { connect: { id: prizeId } }
                    }))
                },
                attachments: {
                    create: uploadedAttachments
                }
            }
        });

        revalidatePath('/');
        revalidatePath('/author');
        revalidatePath('/expert');
        revalidatePath('/academic');

        return { success: true, projectId: project.id };
    } catch (error) {
        console.error("Failed to submit project: ", error);
        throw new Error("Failed to submit project");
    }
}
