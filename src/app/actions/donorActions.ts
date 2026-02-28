'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDonors() {
    return await (prisma as any).donor.findMany({
        where: { active: true },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
}

export async function getAllDonors() {
    return await (prisma as any).donor.findMany({
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
}

export async function createDonor(data: {
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    amount?: number;
    message?: string;
    featured?: boolean;
}) {
    const donor = await (prisma as any).donor.create({
        data: {
            name: data.name,
            logoUrl: data.logoUrl || null,
            websiteUrl: data.websiteUrl || null,
            amount: data.amount || null,
            message: data.message || null,
            featured: data.featured || false,
        },
    });
    revalidatePath('/admin/partners');
    revalidatePath('/en');
    return donor;
}

export async function updateDonor(id: string, data: {
    name?: string;
    logoUrl?: string;
    websiteUrl?: string;
    amount?: number;
    message?: string;
    featured?: boolean;
    active?: boolean;
}) {
    const donor = await (prisma as any).donor.update({
        where: { id },
        data,
    });
    revalidatePath('/admin/partners');
    revalidatePath('/en');
    return donor;
}

export async function deleteDonor(id: string) {
    await (prisma as any).donor.delete({ where: { id } });
    revalidatePath('/admin/partners');
    revalidatePath('/en');
}
