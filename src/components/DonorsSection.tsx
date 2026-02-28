'use client';

interface Donor {
    id: string;
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    amount?: number;
    message?: string;
    featured: boolean;
}

interface DonorsSectionProps {
    donors: Donor[];
}

export default function DonorsSection({ donors }: DonorsSectionProps) {
    if (donors.length === 0) return null;

    const featuredDonor = donors.find(d => d.featured);
    const regularDonors = donors.filter(d => !d.featured);

    return (
        <section className="py-16">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px flex-1 bg-[var(--ink-line)]" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--paper-plane-grey)] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-[var(--electric-teal)]">volunteer_activism</span>
                        Supported By
                    </h3>
                    <div className="h-px flex-1 bg-[var(--ink-line)]" />
                </div>

                {/* Featured Donor */}
                {featuredDonor && (
                    <div className="mb-10 tracing-paper border border-[var(--electric-teal)]/30 p-8 md:p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--electric-teal)] via-[var(--mustard-gold)] to-[var(--electric-teal)]" />

                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--electric-teal)] border border-[var(--electric-teal)]/30 px-3 py-1 inline-block mb-4">
                            Featured Supporter
                        </span>

                        {featuredDonor.logoUrl ? (
                            <img
                                src={featuredDonor.logoUrl}
                                alt={featuredDonor.name}
                                className="max-h-16 mx-auto mb-4 object-contain"
                            />
                        ) : (
                            <span className="material-symbols-outlined text-5xl text-[var(--electric-teal)] block mb-4">
                                diamond
                            </span>
                        )}

                        <h4 className="text-xl font-bold text-[var(--deep-teal)] mb-2">{featuredDonor.name}</h4>

                        {featuredDonor.message && (
                            <p className="text-sm text-[var(--paper-plane-grey)] italic max-w-md mx-auto">
                                &ldquo;{featuredDonor.message}&rdquo;
                            </p>
                        )}

                        {featuredDonor.websiteUrl && (
                            <a
                                href={featuredDonor.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] hover:text-[var(--deep-teal)] transition-colors"
                            >
                                Visit <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                        )}
                    </div>
                )}

                {/* Regular Donors Grid */}
                {regularDonors.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {regularDonors.map((donor, index) => (
                            <div
                                key={donor.id}
                                className="tracing-paper border border-[var(--ink-line)] p-4 text-center hover-lift transition-all group"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                {donor.logoUrl ? (
                                    <img
                                        src={donor.logoUrl}
                                        alt={donor.name}
                                        className="max-h-8 mx-auto mb-2 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined text-2xl text-[var(--paper-plane-grey)] group-hover:text-[var(--electric-teal)] transition-colors block mb-2">
                                        favorite
                                    </span>
                                )}

                                <p className="text-xs font-bold text-[var(--deep-teal)] truncate">{donor.name}</p>

                                {donor.message && (
                                    <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1 line-clamp-2 italic">
                                        {donor.message}
                                    </p>
                                )}

                                {donor.websiteUrl && (
                                    <a
                                        href={donor.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[9px] font-bold uppercase tracking-widest text-[var(--electric-teal)] hover:text-[var(--deep-teal)] transition-colors mt-2 inline-block"
                                    >
                                        Visit →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
