'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getLayers() {
    try {
        const layers = await prisma.analyticalLayer.findMany({
            orderBy: { order: 'asc' }
        });
        return { success: true, layers };
    } catch (error: any) {
        console.error("Failed to fetch analytical layers:", error);
        return { success: false, error: error.message };
    }
}

export async function createLayer(data: {
    icon: string;
    titleEn: string;
    titleAr: string;
    subtitleEn: string;
    subtitleAr: string;
    descEn: string;
    descAr: string;
    color: string;
    order: number;
}) {
    try {
        const layer = await prisma.analyticalLayer.create({ data });
        revalidatePath('/');
        revalidatePath('/en/admin/layers');
        revalidatePath('/ar/admin/layers');
        return { success: true, layer };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateLayer(id: string, data: Partial<{
    icon: string;
    titleEn: string;
    titleAr: string;
    subtitleEn: string;
    subtitleAr: string;
    descEn: string;
    descAr: string;
    color: string;
    order: number;
    active: boolean;
}>) {
    try {
        const layer = await prisma.analyticalLayer.update({
            where: { id },
            data
        });
        revalidatePath('/');
        revalidatePath('/en/admin/layers');
        revalidatePath('/ar/admin/layers');
        return { success: true, layer };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteLayer(id: string) {
    try {
        await prisma.analyticalLayer.delete({ where: { id } });
        revalidatePath('/');
        revalidatePath('/en/admin/layers');
        revalidatePath('/ar/admin/layers');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
