'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getActiveAds(placement?: string) {
    const now = new Date();
    return await (prisma as any).ad.findMany({
        where: {
            active: true,
            ...(placement ? { placement } : {}),
            OR: [
                { startDate: null, endDate: null },
                { startDate: { lte: now }, endDate: null },
                { startDate: null, endDate: { gte: now } },
                { startDate: { lte: now }, endDate: { gte: now } },
            ],
        },
        orderBy: [{ tier: 'asc' }, { createdAt: 'desc' }],
    });
}

export async function getAllAds() {
    return await (prisma as any).ad.findMany({
        orderBy: [{ createdAt: 'desc' }],
    });
}

export async function createAd(data: {
    title: string;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    placement?: string;
    tier?: string;
    startDate?: string;
    endDate?: string;
}) {
    const ad = await (prisma as any).ad.create({
        data: {
            title: data.title,
            content: data.content || null,
            imageUrl: data.imageUrl || null,
            linkUrl: data.linkUrl || null,
            placement: data.placement || 'HOMEPAGE',
            tier: data.tier || 'SILVER',
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
        },
    });
    revalidatePath('/admin/ads');
    revalidatePath('/en');
    return ad;
}

export async function updateAd(id: string, data: {
    title?: string;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    placement?: string;
    tier?: string;
    active?: boolean;
    startDate?: string;
    endDate?: string;
}) {
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    const ad = await (prisma as any).ad.update({
        where: { id },
        data: updateData,
    });
    revalidatePath('/admin/ads');
    revalidatePath('/en');
    return ad;
}

export async function deleteAd(id: string) {
    await (prisma as any).ad.delete({ where: { id } });
    revalidatePath('/admin/ads');
    revalidatePath('/en');
}

export async function trackAdImpression(id: string) {
    await (prisma as any).ad.update({
        where: { id },
        data: { impressions: { increment: 1 } },
    });
}

export async function trackAdClick(id: string) {
    await (prisma as any).ad.update({
        where: { id },
        data: { clicks: { increment: 1 } },
    });
}
