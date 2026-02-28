import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default async function FirmsDirectoryPage() {
    const firms = await prisma.user.findMany({
        where: { role: 'AUTHOR' },
        include: {
            authoredProjects: {
                where: { status: 'APPROVED' },
                include: { attachments: true },
            }
        },
        orderBy: { name: 'asc' }
    });

    const totalFirms = firms.length;
    const totalProjects = firms.reduce((sum, f) => f.authoredProjects.length, 0);

    return (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10 space-y-10">
            {/* Header */}
            <div className="border-b border-[var(--ink-line)] pb-8">
                <div className="inline-flex items-center gap-4 text-[var(--paper-plane-grey)] mb-4">
                    <span className="h-[1px] w-12 bg-[var(--ink-line)]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Directory // Studios & Practices</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-[var(--deep-teal)] tracking-tighter uppercase mb-4">
                    Architectural <span className="italic opacity-80">Firms</span>
                </h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    The innovative studios and practices driving modern architectural design on Archfolio.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 text-center hover-lift">
                    <p className="text-3xl font-light text-[var(--deep-teal)]">{totalFirms}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Registered Studios</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-5 text-center hover-lift">
                    <p className="text-3xl font-light text-[var(--electric-teal)]">{totalProjects}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Verified Projects</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/30 p-5 text-center hover-lift">
                    <p className="text-3xl font-light text-[var(--mustard-gold)]">{firms.filter(f => f.authoredProjects.length > 0).length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Active Firms</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 text-center hover-lift">
                    <p className="text-3xl font-light text-[var(--deep-teal)]">{totalFirms > 0 ? (totalProjects / totalFirms).toFixed(1) : '0'}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Avg Projects / Firm</p>
                </div>
            </div>

            {/* Firms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {firms.map((firm, i) => {
                    const latestProject = firm.authoredProjects[0];
                    const projectImg = latestProject?.attachments?.find((a: any) => a.type === 'photo' || a.type?.startsWith('image'));
                    return (
                        <ScrollReveal key={firm.id} delay={i * 0.05}>
                            <div className="group bg-[var(--card-bg)] border border-[var(--ink-line)] hover:border-[var(--electric-teal)]/40 transition-all hover-lift overflow-hidden">
                                {/* Firm Header with latest project image */}
                                <div className="h-32 bg-[var(--platinum-sheen)]/10 overflow-hidden relative">
                                    {projectImg?.url ? (
                                        <img src={projectImg.url} alt=""
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-5xl text-[var(--paper-plane-grey)] opacity-15">apartment</span>
                                        </div>
                                    )}
                                    {/* Firm initial badge */}
                                    <div className="absolute bottom-3 left-4 w-12 h-12 bg-[var(--deep-teal)] border-2 border-[var(--drafting-white)] flex items-center justify-center shadow-lg">
                                        <span className="text-[var(--drafting-white)] text-lg font-bold">
                                            {(firm.name || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-[var(--deep-teal)]/80 backdrop-blur-sm text-[var(--drafting-white)] text-[9px] font-bold px-2 py-1 uppercase tracking-widest">
                                        {firm.authoredProjects.length} {firm.authoredProjects.length === 1 ? 'Project' : 'Projects'}
                                    </div>
                                </div>

                                {/* Firm Details */}
                                <div className="p-5">
                                    <h3 className="text-[var(--deep-teal)] font-bold text-sm uppercase tracking-tight mb-1 truncate group-hover:text-[var(--electric-teal)] transition-colors" title={firm.name || undefined}>
                                        {firm.name || 'Unknown Studio'}
                                    </h3>
                                    <p className="text-[10px] text-[var(--paper-plane-grey)] font-mono truncate mb-4">{firm.email}</p>

                                    {/* Latest project teaser */}
                                    {latestProject && (
                                        <div className="border-t border-[var(--ink-line)] pt-3">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Latest Work</p>
                                            <Link href={`/en/project/${latestProject.id}`} className="text-xs text-[var(--deep-teal)] hover:text-[var(--mustard-gold)] transition-colors font-medium truncate block">
                                                {latestProject.title}
                                            </Link>
                                        </div>
                                    )}

                                    {/* View projects link */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <Link
                                            href={`/en/explore?author=${firm.id}`}
                                            className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] hover:text-[var(--deep-teal)] transition-colors flex items-center gap-1"
                                        >
                                            View Portfolio <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    );
                })}
            </div>

            {firms.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-[var(--ink-line)] bg-[var(--card-bg)]">
                    <span className="material-symbols-outlined text-5xl text-[var(--paper-plane-grey)] opacity-30 mb-4 block">business</span>
                    <h3 className="text-xl font-bold text-[var(--deep-teal)] mb-2">No Firms Registered</h3>
                    <p className="text-sm text-[var(--paper-plane-grey)] mb-6 max-w-md mx-auto">
                        Studios and practices appear here after they create an author account and submit their first project.
                    </p>
                    <Link href="/en/login" className="chalk-btn px-8 py-3 text-xs font-bold uppercase tracking-widest text-[var(--deep-teal)] inline-flex items-center gap-2">
                        Register Your Studio <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            )}

            {/* CTA */}
            <section className="bg-[var(--deep-teal)] text-[var(--drafting-white)] p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(var(--drafting-white) 1px, transparent 1px)',
                    backgroundSize: '25px 25px'
                }}></div>
                <div className="relative z-10">
                    <span className="material-symbols-outlined text-4xl text-[var(--mustard-gold)] mb-4 block">domain_add</span>
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-3">List Your Practice</h2>
                    <p className="text-sm opacity-70 max-w-lg mx-auto mb-6">
                        Join the directory by creating an Author account and submitting your portfolio of architectural work.
                    </p>
                    <Link href="/en/author" className="chalk-btn border-[var(--mustard-gold)] text-[var(--mustard-gold)] px-8 py-3 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 hover:bg-[var(--mustard-gold)]/10">
                        Get Started <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
