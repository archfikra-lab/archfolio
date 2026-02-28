'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPartners() {
    return await (prisma as any).partner.findMany({
        where: { active: true },
        orderBy: [{ tier: 'asc' }, { order: 'asc' }],
    });
}

export async function getAllPartners() {
    return await (prisma as any).partner.findMany({
        orderBy: [{ tier: 'asc' }, { order: 'asc' }],
    });
}

export async function createPartner(data: {
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    tier?: string;
    order?: number;
}) {
    const partner = await (prisma as any).partner.create({
        data: {
            name: data.name,
            logoUrl: data.logoUrl || null,
            websiteUrl: data.websiteUrl || null,
            tier: data.tier || 'SILVER',
            order: data.order || 0,
        },
    });
    revalidatePath('/admin/partners');
    revalidatePath('/en');
    return partner;
}

export async function updatePartner(id: string, data: {
    name?: string;
    logoUrl?: string;
    websiteUrl?: string;
    tier?: string;
    active?: boolean;
    order?: number;
}) {
    const partner = await (prisma as any).partner.update({
        where: { id },
        data,
    });
    revalidatePath('/admin/partners');
    revalidatePath('/en');
    return partner;
}

export async function deletePartner(id: string) {
    await (prisma as any).partner.delete({ where: { id } });
    revalidatePath('/admin/partners');
    revalidatePath('/en');
}
