import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AwardsPage() {
    // Fetch top projects by having the most disciplines documented
    const allProjects: any[] = await (prisma.project as any).findMany({
        where: { status: 'APPROVED' },
        include: {
            disciplines: true,
            author: true,
            attachments: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    // Score projects by completeness
    const scoredProjects = allProjects.map(p => {
        let score = 0;
        if (p.disciplines.length > 0) score += p.disciplines.length * 20;
        if (p.shortDescription) score += 10;
        if (p.architecturalStyle) score += 10;
        if (p.latitude && p.longitude) score += 10;
        if (p.attachments?.length > 0) score += p.attachments.length * 5;
        return { ...p, score };
    }).sort((a, b) => b.score - a.score);

    const featured = scoredProjects[0] || null;
    const runners = scoredProjects.slice(1, 4);

    // Award categories
    const categories = [
        {
            title: "Most Documented",
            subtitle: "Data Integrity Excellence",
            icon: "description",
            color: "var(--mustard-gold)",
            winner: scoredProjects.sort((a, b) => b.disciplines.length - a.disciplines.length)[0] || null,
        },
        {
            title: "Pioneer Award",
            subtitle: "Earliest Documented Project",
            icon: "history",
            color: "var(--electric-teal)",
            winner: [...allProjects].sort((a, b) => a.year - b.year)[0] || null,
        },
        {
            title: "Visual Excellence",
            subtitle: "Most Illustrated Submission",
            icon: "photo_library",
            color: "var(--bright-rust, #C0392B)",
            winner: [...allProjects].sort((a, b) => (b.attachments?.length || 0) - (a.attachments?.length || 0))[0] || null,
        },
    ];

    // Count unique authors and typologies
    const uniqueAuthors = new Set(allProjects.map(p => p.authorId).filter(Boolean)).size;
    const uniqueTypologies = new Set(allProjects.map(p => p.typology).filter(Boolean)).size;

    return (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10 space-y-12">
            {/* Header */}
            <div className="border-b border-[var(--ink-line)] pb-8">
                <div className="inline-flex items-center gap-4 text-[var(--paper-plane-grey)] mb-4">
                    <span className="h-[1px] w-12 bg-[var(--ink-line)]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Recognition // Honors</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-[var(--deep-teal)] tracking-tighter uppercase mb-4">
                    Archfolio <span className="italic text-[var(--mustard-gold)]">Honors</span>
                </h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    Recognizing unparalleled excellence in structural engineering, architectural theory, and documentation rigor.
                </p>
            </div>

            {/* Grand Award — Featured */}
            {featured && (
                <section className="relative">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="material-symbols-outlined text-3xl text-[var(--mustard-gold)]">workspace_premium</span>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--deep-teal)] uppercase tracking-tight">Grand Prize</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Highest Overall Score // Technical Excellence</p>
                        </div>
                    </div>

                    <Link href={`/en/project/${featured.id}`} className="group block">
                        <div className="relative border-2 border-[var(--mustard-gold)] p-8 bg-[var(--card-bg)] overflow-hidden tracing-paper">
                            {/* Gold Corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                                <div className="absolute top-0 right-0 w-[170%] h-8 bg-[var(--mustard-gold)] transform rotate-45 translate-y-4 translate-x-2 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-black uppercase tracking-widest">★ Winner</span>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Image */}
                                <div className="lg:w-1/3 aspect-[4/3] border border-[var(--ink-line)] overflow-hidden flex-shrink-0">
                                    {(() => {
                                        const img = featured.attachments?.find((a: any) => a.type === 'photo' || a.type?.startsWith('image'));
                                        return img?.url ? (
                                            <img src={img.url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-[var(--platinum-sheen)]/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-6xl text-[var(--mustard-gold)] opacity-30">domain</span>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="bg-[var(--deep-teal)] text-[var(--drafting-white)] text-[9px] px-2 py-1 uppercase tracking-widest font-bold">{featured.typology}</span>
                                        <span className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest font-bold">EST. {featured.year}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-[var(--deep-teal)] group-hover:text-[var(--mustard-gold)] transition-colors tracking-tight mb-2 uppercase">
                                        {featured.title}
                                    </h3>
                                    <p className="text-sm text-[var(--paper-plane-grey)] flex items-center gap-1 mb-4 font-medium">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {featured.location}
                                    </p>
                                    {featured.shortDescription && (
                                        <p className="text-sm text-[var(--deep-teal)]/80 mb-6 leading-relaxed max-w-lg font-light">{featured.shortDescription}</p>
                                    )}

                                    {/* Score Breakdown */}
                                    <div className="grid grid-cols-3 gap-4 border-t border-[var(--ink-line)] pt-4">
                                        <div>
                                            <p className="text-2xl font-light text-[var(--mustard-gold)]">{featured.disciplines.length}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Disciplines</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-light text-[var(--mustard-gold)]">{featured.attachments?.length || 0}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Attachments</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-light text-[var(--mustard-gold)]">{featured.score}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Total Score</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* Category Awards */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <span className="material-symbols-outlined text-xl text-[var(--electric-teal)]">emoji_events</span>
                    <h2 className="text-xl font-bold text-[var(--deep-teal)] uppercase tracking-tight">Category Awards</h2>
                    <div className="flex-1 h-px bg-[var(--ink-line)]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat, i) => (
                        <div key={cat.title} className="hand-drawn-card p-6 relative group hover-lift">
                            <div className="absolute top-0 right-0 bg-[var(--platinum-sheen)]/10 w-10 h-10 flex items-center justify-center border-l border-b border-[var(--ink-line)]">
                                <span className="text-[10px] font-bold text-[var(--paper-plane-grey)]">#{i + 1}</span>
                            </div>

                            <div className="w-12 h-12 border-2 flex items-center justify-center mb-4" style={{ borderColor: cat.color }}>
                                <span className="material-symbols-outlined text-xl" style={{ color: cat.color }}>{cat.icon}</span>
                            </div>

                            <h3 className="text-lg font-bold text-[var(--deep-teal)] uppercase tracking-tight mb-1">{cat.title}</h3>
                            <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-4 font-bold">{cat.subtitle}</p>

                            {cat.winner ? (
                                <Link href={`/en/project/${cat.winner.id}`} className="block border-t border-[var(--ink-line)] pt-4">
                                    <p className="text-sm font-medium text-[var(--deep-teal)] hover:text-[var(--electric-teal)] transition-colors truncate">{cat.winner.title}</p>
                                    <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">location_on</span>
                                        {cat.winner.location} • {cat.winner.year}
                                    </p>
                                </Link>
                            ) : (
                                <div className="border-t border-[var(--ink-line)] pt-4">
                                    <p className="text-xs text-[var(--paper-plane-grey)] italic">No submissions yet</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Runners Up */}
            {runners.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="material-symbols-outlined text-xl text-[var(--paper-plane-grey)]">stars</span>
                        <h2 className="text-xl font-bold text-[var(--deep-teal)] uppercase tracking-tight">Honorable Mentions</h2>
                        <div className="flex-1 h-px bg-[var(--ink-line)]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {runners.map(project => {
                            const img = project.attachments?.find((a: any) => a.type === 'photo' || a.type?.startsWith('image'));
                            return (
                                <Link key={project.id} href={`/en/project/${project.id}`} className="group hand-drawn-card overflow-hidden">
                                    <div className="h-40 bg-[var(--platinum-sheen)]/10 overflow-hidden">
                                        {img?.url ? (
                                            <img src={img.url} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] opacity-30">domain</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-bold text-[var(--deep-teal)] group-hover:text-[var(--electric-teal)] transition-colors truncate">{project.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest">{project.typology}</span>
                                            <span className="w-1 h-1 rounded-full bg-[var(--ink-line)]"></span>
                                            <span className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest">{project.year}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Stats Bar */}
            <section className="border-t border-[var(--ink-line)] pt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-4xl font-light text-[var(--mustard-gold)]">{allProjects.length}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Verified Projects</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-light text-[var(--electric-teal)]">{uniqueAuthors}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Contributing Authors</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-light text-[var(--deep-teal)]">{uniqueTypologies}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Typologies</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-light text-[var(--deep-teal)]">{categories.filter(c => c.winner).length}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Awards Given</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            {allProjects.length === 0 && (
                <div className="py-16 text-center border border-[var(--ink-line)] border-dashed bg-[var(--card-bg)]">
                    <span className="material-symbols-outlined text-5xl text-[var(--mustard-gold)] opacity-50 mb-4 block">workspace_premium</span>
                    <h3 className="text-xl font-bold text-[var(--deep-teal)] mb-2">No Awards Yet</h3>
                    <p className="text-sm text-[var(--paper-plane-grey)] mb-6 max-w-md mx-auto">
                        Awards are automatically generated once projects are approved and verified by the review panel.
                    </p>
                    <Link href="/en/author" className="chalk-btn px-8 py-3 text-xs font-bold uppercase tracking-widest text-[var(--deep-teal)] inline-flex items-center gap-2">
                        Submit a Project <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
