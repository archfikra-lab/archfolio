import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import PartnersMarquee from "@/components/PartnersMarquee";
import DonorsSection from "@/components/DonorsSection";
import AnimatedAd from "@/components/AnimatedAd";

export default async function Home() {
    // Fetch real projects from DB
    const latestProjects: any[] = await (prisma.project as any).findMany({
        where: { status: 'APPROVED' },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { author: true, attachments: true }
    });

    // If fewer than 3 approved, fetch any recent projects
    const projects: any[] = latestProjects.length >= 3 ? latestProjects : await (prisma.project as any).findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { author: true, attachments: true }
    });

    const projectCount = await prisma.project.count();
    const firmCount = await (prisma as any).user.count({ where: { role: 'AUTHOR' } });

    // Fetch partners, donors, and ads
    const partners: any[] = await (prisma as any).partner.findMany({
        where: { active: true },
        orderBy: [{ tier: 'asc' }, { order: 'asc' }],
    });
    const donors: any[] = await (prisma as any).donor.findMany({
        where: { active: true },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
    const now = new Date();
    const ads: any[] = await (prisma as any).ad.findMany({
        where: {
            active: true,
            OR: [
                { startDate: null, endDate: null },
                { startDate: { lte: now }, endDate: null },
                { startDate: null, endDate: { gte: now } },
                { startDate: { lte: now }, endDate: { gte: now } },
            ],
        },
        orderBy: [{ tier: 'asc' }, { createdAt: 'desc' }],
    });

    return (
        <div className="min-h-screen bg-[var(--drafting-white)] text-[var(--deep-teal)] selection:bg-[var(--mustard-gold)]/20 overflow-x-hidden relative">

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[var(--ink-line)] min-h-[600px] flex items-center">
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 py-16">
                    <div>
                        <ScrollReveal delay={0}>
                            <div className="inline-flex items-center gap-4 text-[var(--paper-plane-grey)] mb-8">
                                <span className="h-[1px] w-16 bg-[var(--ink-line)]"></span>
                                <span className="text-xs font-bold uppercase tracking-[0.5em]">Sheet A-101 / Master Plan</span>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.1}>
                            <h2 className="text-6xl md:text-8xl font-light leading-none mb-10 uppercase tracking-tighter">
                                Built <br /> <span className="italic opacity-80">Environment</span>
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <p className="text-xl text-[var(--paper-plane-grey)] max-w-lg mb-12 leading-relaxed font-light">
                                A specialized repository of high-performance architectural case studies and structural engineering breakthroughs.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.3}>
                            <div className="flex flex-wrap gap-6">
                                <Link href="/en/explore" className="chalk-btn px-10 py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-4 text-[var(--deep-teal)]">
                                    View Technical Work
                                    <span className="material-symbols-outlined text-lg">straighten</span>
                                </Link>
                            </div>
                        </ScrollReveal>

                        {/* Animated Stats */}
                        <ScrollReveal delay={0.4}>
                            <div className="mt-16 grid grid-cols-3 gap-6 pt-8 border-t border-[var(--ink-line)]">
                                <div>
                                    <AnimatedCounter target={projectCount > 0 ? projectCount : 4200} suffix={projectCount > 0 && projectCount < 100 ? '' : 'k'} className="text-4xl font-black text-[var(--mustard-gold)]" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Projects</p>
                                </div>
                                <div>
                                    <AnimatedCounter target={firmCount > 0 ? firmCount : 850} suffix="" className="text-4xl font-black text-[var(--mustard-gold)]" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Authors</p>
                                </div>
                                <div>
                                    <AnimatedCounter target={12} suffix="" className="text-4xl font-black text-[var(--mustard-gold)]" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Countries</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Hero Graphic */}
                    <ScrollReveal direction="right" delay={0.2}>
                        <div className="relative group hidden lg:block">
                            <div className="p-4 bg-[var(--card-bg)] border border-[var(--ink-line)] -rotate-2 group-hover:rotate-0 transition-transform duration-700 relative chalk-border">
                                <div className="absolute -top-3 -left-3 text-[10px] text-[var(--paper-plane-grey)] uppercase">Ref: 2024-XJ</div>
                                <div className="w-full h-[450px] border border-[var(--ink-line)] relative overflow-hidden">
                                    <img
                                        src="/hero-blueprint.png"
                                        alt="Architectural Blueprint Drawing"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="mt-6 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-[var(--paper-plane-grey)] tracking-widest">Section 01 // Case Study</p>
                                        <p className="text-xl font-light uppercase tracking-wide">The Nexus Tower, London</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-4xl font-thin">verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-[var(--drafting-white)] relative">
                <div className="section-divider absolute top-0 left-0 right-0"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-3 block">Workflow</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">How It Works</h2>
                            <p className="text-[var(--paper-plane-grey)] font-light max-w-xl mx-auto">From submission to publication — a rigorous, peer-reviewed archival process.</p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--ink-line)] to-transparent -translate-y-1/2 z-0"></div>

                        <ScrollReveal delay={0.1}>
                            <div className="relative hand-drawn-card p-8 text-center hover-lift group">
                                <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--mustard-gold)] flex items-center justify-center bg-[var(--mustard-gold)]/5 group-hover:bg-[var(--mustard-gold)]/20 transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-[var(--mustard-gold)]">upload_file</span>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-2">Step 01</div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">Submit</h3>
                                <p className="text-sm text-[var(--paper-plane-grey)] font-light">Upload your case study with comprehensive technical data, drawings, and AI-assisted analysis.</p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div className="relative hand-drawn-card p-8 text-center hover-lift group">
                                <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--deep-teal)] flex items-center justify-center bg-[var(--deep-teal)]/5 group-hover:bg-[var(--deep-teal)]/20 transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-[var(--deep-teal)]">rate_review</span>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-2">Step 02</div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">Review</h3>
                                <p className="text-sm text-[var(--paper-plane-grey)] font-light">Expert and Academic panels evaluate structural integrity, sustainability metrics, and design rigor.</p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.3}>
                            <div className="relative hand-drawn-card p-8 text-center hover-lift group">
                                <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--deep-teal)] flex items-center justify-center bg-[var(--deep-teal)]/5 group-hover:bg-[var(--deep-teal)]/20 transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-[var(--deep-teal)]">verified</span>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-2">Step 03</div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">Publish</h3>
                                <p className="text-sm text-[var(--paper-plane-grey)] font-light">Approved works become part of the permanent registry — searchable, citable, and globally accessible.</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Engineering Portfolio — Real Data */}
            <section className="px-6 lg:px-12 py-24 border-t border-[var(--ink-line)]">
                <div className="max-w-screen-2xl mx-auto">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-[var(--ink-line)] pb-10">
                            <div>
                                <h3 className="text-4xl font-light mb-4 uppercase tracking-widest">Engineering Portfolio</h3>
                                <p className="text-[var(--paper-plane-grey)] text-xs uppercase tracking-[0.4em]">Sub-Division by Discipline</p>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-8 md:mt-0">
                                <Link href="/en/explore" className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-[var(--deep-teal)] bg-[var(--deep-teal)] text-[var(--drafting-white)]">All Layers</Link>
                                <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-[var(--ink-line)] hover:border-[var(--deep-teal)] transition-colors text-[var(--paper-plane-grey)]">Architectural</button>
                                <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-[var(--ink-line)] hover:border-[var(--deep-teal)] transition-colors text-[var(--paper-plane-grey)]">Structural</button>
                                <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-[var(--ink-line)] hover:border-[var(--deep-teal)] transition-colors text-[var(--paper-plane-grey)]">Mechanical</button>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 card-grid">
                        {projects.map((project, idx) => (
                            <Link key={project.id} href={`/en/project/${project.id}`} className={`hand-drawn-card p-6 group ${idx === 1 ? 'gold-border' : ''}`}>
                                <div className={`relative overflow-hidden mb-8 border ${idx === 1 ? 'border-[var(--mustard-gold)]/30' : 'border-[var(--ink-line)]'}`}>
                                    {(() => {
                                        const imageAttachment = project.attachments?.find((a: any) =>
                                            a.type === 'photo' || a.type?.startsWith('image')
                                        );
                                        const imageUrl = imageAttachment?.url;
                                        return imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={project.title}
                                                className="w-full aspect-[4/5] object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="w-full aspect-[4/5] flex items-center justify-center bg-[var(--drafting-white)] relative overflow-hidden">
                                                <div className="absolute inset-0 opacity-[0.06]"
                                                    style={{
                                                        backgroundImage: 'linear-gradient(var(--deep-teal) 1px, transparent 1px), linear-gradient(90deg, var(--deep-teal) 1px, transparent 1px)',
                                                        backgroundSize: '15px 15px'
                                                    }}>
                                                </div>
                                                <div className="w-3/4 h-3/4 border-2 border-[var(--mustard-gold)] relative scale-95 group-hover:scale-100 transition-transform duration-500">
                                                    <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--mustard-gold)]/50"></div>
                                                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--mustard-gold)]/50"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[var(--mustard-gold)]/30 text-5xl">domain</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    {idx === 1 && (
                                        <div className="absolute top-0 right-0 bg-[var(--mustard-gold)] text-black text-[9px] px-3 py-1.5 font-bold uppercase tracking-[0.2em] z-20 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[12px]">star</span>
                                            Featured
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className={`text-2xl font-light mb-2 uppercase group-hover:translate-x-1 transition-transform ${idx === 1 ? 'text-[var(--mustard-gold)]' : ''}`}>
                                            {project.title}
                                        </h4>
                                        <div className="flex gap-4 items-center">
                                            <span className="text-[10px] font-bold uppercase text-[var(--paper-plane-grey)] tracking-widest">{project.typology}</span>
                                            <span className="w-1 h-1 rounded-full bg-[var(--ink-line)]"></span>
                                            <span className="text-[10px] font-bold uppercase text-[var(--paper-plane-grey)] tracking-widest italic">{project.location}</span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-[var(--paper-plane-grey)] group-hover:text-[var(--deep-teal)] transition-colors">open_in_new</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Mid-page Banner */}
                    <ScrollReveal delay={0.1}>
                        <div className="mt-16 border border-[var(--ink-line)] p-10 bg-[var(--card-bg)] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10 chalk-border">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--paper-plane-grey)] mb-4">Manual Spotlight // Ref #992</span>
                                <h4 className="text-3xl font-light tracking-tight uppercase max-w-xl leading-snug">Precision drafting tools for the modern engineer.</h4>
                            </div>
                            <div className="flex items-center gap-10">
                                <p className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-[0.3em] max-w-[180px] text-right hidden lg:block italic leading-relaxed">Redefining standards since the ink era 1994.</p>
                                <button className="chalk-btn px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--deep-teal)]">
                                    Inquire Now
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="mt-24 text-center">
                        <Link href="/en/explore" className="chalk-btn px-16 py-5 text-xs font-bold uppercase tracking-[0.4em] inline-flex items-center gap-3 text-[var(--deep-teal)]">
                            Open All Archives [Vol. I - XII]
                            <span className="material-symbols-outlined text-lg">east</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Disciplines Section */}
            <section className="py-24 bg-[var(--drafting-white)] relative border-t border-[var(--ink-line)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-3 block">Cross-Discipline</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Four Analytical Layers</h2>
                            <p className="text-[var(--paper-plane-grey)] font-light max-w-xl mx-auto">Every project is rigorously analyzed through Fikra&apos;s proprietary multi-discipline framework.</p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: 'apartment', title: 'Architectural', subtitle: 'Skin & Soul', desc: 'Form, space-making, material expression, and contextual sensitivity.', color: 'var(--deep-teal)' },
                            { icon: 'foundation', title: 'Structural', subtitle: 'Lines & Systems', desc: 'Load paths, material performance, seismic resilience, and innovation.', color: 'var(--electric-teal)' },
                            { icon: 'hvac', title: 'MEP', subtitle: 'Circulation & Nerve', desc: 'Mechanical, electrical, plumbing systems and energy performance.', color: 'var(--mustard-gold)' },
                            { icon: 'eco', title: 'Sustainability', subtitle: 'Context & Timeline', desc: 'Environmental impact, lifecycle analysis, and renewable integration.', color: 'var(--bright-rust, #C0392B)' },
                        ].map((d, i) => (
                            <ScrollReveal key={d.title} delay={i * 0.1}>
                                <div className="group hand-drawn-card p-8 hover-lift hover:border-[var(--mustard-gold)] transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 border-l border-b border-[var(--ink-line)] group-hover:border-[var(--mustard-gold)]/30 transition-colors"></div>
                                    <div className="w-14 h-14 border-2 flex items-center justify-center mb-6 transition-colors group-hover:bg-[var(--deep-teal)]/5" style={{ borderColor: d.color }}>
                                        <span className="material-symbols-outlined text-2xl" style={{ color: d.color }}>{d.icon}</span>
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-1">{d.subtitle}</div>
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-3">{d.title}</h3>
                                    <p className="text-sm text-[var(--paper-plane-grey)] font-light leading-relaxed">{d.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Animated Ad */}
            {ads.length > 0 && (
                <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6">
                    <AnimatedAd ads={ads} placement="HOMEPAGE" />
                </section>
            )}

            {/* Partners Marquee */}
            <PartnersMarquee partners={partners} />

            {/* Donors Section */}
            <DonorsSection donors={donors} />

            {/* Testimonials */}
            <section className="py-20 border-t border-[var(--ink-line)] bg-[var(--card-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-3 block">Voices</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">From the Community</h2>
                            <p className="text-[var(--paper-plane-grey)] font-light max-w-xl mx-auto">What architects, engineers, and academics say about the platform.</p>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { quote: "Archfolio gave our practice a credible, permanent home for our most technically challenging projects. The peer review process elevated our documentation standards.", name: "Sarah Al-Rashid", role: "Principal Architect", firm: "Al-Rashid Studio, Amman" },
                            { quote: "The multi-discipline framework — Structural, MEP, Sustainability — forces a rigorous analysis that benefits both the submitted work and the reviewing panel.", name: "Dr. Karim Nassar", role: "Structural Engineer", firm: "KN Engineering, Beirut" },
                            { quote: "For academic research, having a peer-verified repository of real-world case studies is invaluable. Archfolio bridges the gap between practice and theory.", name: "Prof. Lina Haddad", role: "Architecture Faculty", firm: "University of Jordan" },
                        ].map((t, i) => (
                            <ScrollReveal key={i} delay={i * 0.15}>
                                <div className="hand-drawn-card p-8 hover-lift h-full flex flex-col">
                                    <span className="text-4xl text-[var(--mustard-gold)] leading-none mb-4 block font-serif">&ldquo;</span>
                                    <p className="text-sm text-[var(--deep-teal)] leading-relaxed flex-grow italic">{t.quote}</p>
                                    <div className="mt-6 pt-4 border-t border-[var(--ink-line)]">
                                        <p className="text-sm font-bold text-[var(--deep-teal)]">{t.name}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-[var(--electric-teal)] font-bold">{t.role}</p>
                                        <p className="text-[10px] text-[var(--paper-plane-grey)]">{t.firm}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-[var(--deep-teal)] text-[var(--drafting-white)] text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(var(--drafting-white) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>
                <div className="max-w-3xl mx-auto px-4 relative z-10">
                    <ScrollReveal>
                        <span className="material-symbols-outlined text-5xl text-[var(--mustard-gold)] mb-6 block">architecture</span>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Ready to Contribute?</h2>
                        <p className="opacity-70 font-light mb-10 text-lg">Join a growing network of architects, engineers, and academics documenting the built environment for future generations.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/en/author" className="chalk-btn border-[var(--mustard-gold)] text-[var(--mustard-gold)] px-10 py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--mustard-gold)]/10">
                                Submit a Project
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </Link>
                            <Link href="/en/explore" className="chalk-btn border-[var(--drafting-white)]/30 px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-[var(--drafting-white)]/10">
                                Browse Archive
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
