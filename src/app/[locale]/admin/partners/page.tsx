import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PartnersClient from "./PartnersClient";

export default async function AdminPartnersPage() {
    const partners: any[] = await (prisma as any).partner.findMany({
        orderBy: [{ tier: 'asc' }, { order: 'asc' }],
    });

    const donors: any[] = await (prisma as any).donor.findMany({
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    return (
        <div className="space-y-10 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">Partners & Donors</h1>
                    <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                        Manage platform partnerships and supporter recognition
                    </p>
                </div>
                <Link href="/en/admin" className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] hover:text-[var(--deep-teal)] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Dashboard
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/30 p-5 hover-lift">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-2">Platinum Partners</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{partners.filter(p => p.tier === 'PLATINUM').length}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-5 hover-lift">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] mb-2">Gold Partners</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{partners.filter(p => p.tier === 'GOLD').length}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Total Partners</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{partners.length}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Total Donors</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{donors.length}</p>
                </div>
            </div>

            <PartnersClient initialPartners={partners} initialDonors={donors} />
        </div>
    );
}
