'use client';

import { useEffect, useState, useRef } from 'react';

interface Ad {
    id: string;
    title: string;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    tier: string;
    placement: string;
}

interface AnimatedAdProps {
    ads: Ad[];
    placement?: string;
}

export default function AnimatedAd({ ads, placement = 'HOMEPAGE' }: AnimatedAdProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredAds = ads.filter(ad => ad.placement === placement);

    useEffect(() => {
        if (filteredAds.length === 0) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.3 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [filteredAds.length]);

    useEffect(() => {
        if (filteredAds.length <= 1 || !isVisible || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % filteredAds.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [filteredAds.length, isVisible, isPaused]);

    if (filteredAds.length === 0) return null;

    const currentAd = filteredAds[currentIndex];
    const tierStyles: Record<string, string> = {
        PLATINUM: 'border-[var(--mustard-gold)] bg-gradient-to-r from-[var(--mustard-gold)]/5 to-transparent',
        GOLD: 'border-[var(--electric-teal)]/60 bg-[var(--card-bg)]',
        SILVER: 'border-[var(--ink-line)] bg-[var(--card-bg)]',
    };

    const tierBadge: Record<string, string> = {
        PLATINUM: 'bg-[var(--mustard-gold)] text-white',
        GOLD: 'bg-[var(--electric-teal)] text-white',
        SILVER: 'bg-[var(--paper-plane-grey)] text-white',
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden border transition-all duration-700 tracing-paper ${tierStyles[currentAd.tier] || tierStyles.SILVER}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Ad Content with slide animation */}
            <div
                className="p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 transition-all duration-500"
                style={{
                    animation: isVisible ? 'slideInFromRight 0.6s ease-out' : 'none',
                }}
                key={currentAd.id}
            >
                {/* Tier Badge */}
                <span className={`text-[9px] font-bold uppercase tracking-[0.4em] px-3 py-1 shrink-0 ${tierBadge[currentAd.tier] || tierBadge.SILVER}`}>
                    {currentAd.tier === 'PLATINUM' ? 'Platinum Partner' :
                        currentAd.tier === 'GOLD' ? 'Gold Sponsor' : 'Sponsored'}
                </span>

                {/* Image */}
                {currentAd.imageUrl && (
                    <div className="w-12 h-12 shrink-0 border border-[var(--ink-line)] overflow-hidden">
                        <img src={currentAd.imageUrl} alt={currentAd.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Text */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                    <p className="text-sm font-bold text-[var(--deep-teal)] truncate">{currentAd.title}</p>
                    {currentAd.content && (
                        <p className="text-xs text-[var(--paper-plane-grey)] mt-0.5 line-clamp-1">{currentAd.content}</p>
                    )}
                </div>

                {/* CTA */}
                {currentAd.linkUrl && (
                    <a
                        href={currentAd.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--deep-teal)] hover:text-[var(--mustard-gold)] transition-colors flex items-center gap-1 shrink-0"
                    >
                        Learn More
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                )}

                {/* Dots indicator */}
                {filteredAds.length > 1 && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        {filteredAds.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex
                                    ? 'bg-[var(--mustard-gold)] w-4'
                                    : 'bg-[var(--paper-plane-grey)]'
                                    }`}
                                aria-label={`Show ad ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Decorative line */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--mustard-gold)]/30 to-transparent" />
        </div>
    );
}
