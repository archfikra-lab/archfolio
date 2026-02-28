import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdsClient from "./AdsClient";

export default async function AdminAdsPage() {
    const ads: any[] = await (prisma as any).ad.findMany({
        orderBy: [{ createdAt: 'desc' }],
    });

    const activeAds = ads.filter(a => a.active);
    const totalImpressions = ads.reduce((sum: number, a: any) => sum + (a.impressions || 0), 0);
    const totalClicks = ads.reduce((sum: number, a: any) => sum + (a.clicks || 0), 0);
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

    return (
        <div className="space-y-10 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">Ads Management</h1>
                    <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                        Create and manage platform advertisements
                    </p>
                </div>
                <Link href="/en/admin" className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] hover:text-[var(--deep-teal)] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Dashboard
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-5 hover-lift">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] mb-2">Active Ads</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{activeAds.length}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Total Impressions</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{totalImpressions.toLocaleString()}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Total Clicks</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{totalClicks.toLocaleString()}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/30 p-5 hover-lift">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-2">Click-Through Rate</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{ctr}%</p>
                </div>
            </div>

            <AdsClient initialAds={ads} />
        </div>
    );
}
