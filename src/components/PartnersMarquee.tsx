'use client';

import { useTranslations } from 'next-intl';

interface Partner {
    id: string;
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    tier: string;
}

interface PartnersMarqueeProps {
    partners: Partner[];
}

export default function PartnersMarquee({ partners }: PartnersMarqueeProps) {
    const t = useTranslations('Partners');
    if (partners.length === 0) return null;

    // Double the list for seamless loop
    const doubled = [...partners, ...partners];

    const tierBorder: Record<string, string> = {
        PLATINUM: 'border-[var(--mustard-gold)]/40',
        GOLD: 'border-[var(--electric-teal)]/30',
        SILVER: 'border-[var(--ink-line)]',
    };

    const tierLabel: Record<string, string> = {
        PLATINUM: 'text-[var(--mustard-gold)]',
        GOLD: 'text-[var(--electric-teal)]',
        SILVER: 'text-[var(--paper-plane-grey)]',
    };

    return (
        <section className="py-12 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 mb-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-[var(--ink-line)]" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--paper-plane-grey)] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-[var(--mustard-gold)]">handshake</span>
                        {t('ourPartners')}
                    </h3>
                    <div className="h-px flex-1 bg-[var(--ink-line)]" />
                </div>
            </div>

            {/* Scrolling marquee */}
            <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--drafting-white)] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--drafting-white)] to-transparent z-10 pointer-events-none" />

                <div className="flex animate-marquee hover:[animation-play-state:paused]">
                    {doubled.map((partner, index) => (
                        <a
                            key={`${partner.id}-${index}`}
                            href={partner.websiteUrl || '#'}
                            target={partner.websiteUrl ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className={`flex-shrink-0 mx-3 group`}
                        >
                            <div className={`w-48 h-24 tracing-paper border ${tierBorder[partner.tier] || tierBorder.SILVER} flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-lg`}>
                                {partner.logoUrl ? (
                                    <img
                                        src={partner.logoUrl}
                                        alt={partner.name}
                                        className="max-h-10 max-w-32 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined text-2xl text-[var(--paper-plane-grey)] group-hover:text-[var(--deep-teal)] transition-colors">
                                        business
                                    </span>
                                )}
                                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] group-hover:text-[var(--deep-teal)] transition-colors">
                                    {partner.name}
                                </span>
                                <span className={`text-[8px] uppercase tracking-widest font-bold ${tierLabel[partner.tier] || tierLabel.SILVER}`}>
                                    {partner.tier}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
