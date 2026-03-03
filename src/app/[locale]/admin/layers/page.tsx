import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import LayersClient from './LayersClient';
import { getTranslations } from 'next-intl/server';

export default async function LayersAdminPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/en/login');
    }

    const t = await getTranslations('Admin');
    const layers: any[] = await (prisma as any).analyticalLayer.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="space-y-10 page-enter">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[var(--deep-teal)] uppercase tracking-tight">Analytical Layers</h1>
                    <p className="text-[var(--paper-plane-grey)] text-sm tracking-widest uppercase mt-1">Manage Homepage Disciplines</p>
                </div>
            </div>

            <LayersClient initialLayers={layers} />
        </div>
    );
}
