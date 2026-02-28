import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";

export default function AboutPage() {
    const milestones = [
        { year: '2022', title: 'Concept', desc: 'Fikra team identifies the gap in architectural documentation across the MENA region.' },
        { year: '2023', title: 'Development', desc: 'Platform architecture designed — multi-discipline review framework established.' },
        { year: '2024', title: 'Beta Launch', desc: 'First cohort of architects, engineers, and academic reviewers onboarded.' },
        { year: '2025', title: 'Public Release', desc: 'Archfolio opens to global submissions with peer-verified publication.' },
    ];

    const values = [
        { icon: 'verified', title: 'Rigor', desc: 'Every project undergoes multi-layered technical and theoretical review before publication.' },
        { icon: 'public', title: 'Accessibility', desc: 'Knowledge should be borderless. All published work is freely searchable and citable.' },
        { icon: 'diversity_3', title: 'Collaboration', desc: 'Architects, engineers, and academics work together through structured review cycles.' },
        { icon: 'eco', title: 'Sustainability', desc: 'We prioritize and highlight projects that advance sustainable building practices.' },
    ];

    const team = [
        { role: 'Platform Lead', name: 'Fikra Innovation Lab', desc: 'Strategy, product direction, and partnership development.' },
        { role: 'Technical Architecture', name: 'Engineering Team', desc: 'Full-stack development, infrastructure, and data systems.' },
        { role: 'Review Panel', name: 'Expert Collective', desc: 'Industry professionals conducting structural and MEP evaluations.' },
        { role: 'Academic Advisory', name: 'University Partners', desc: 'Theoretical assessment, contextual analysis, and publication standards.' },
    ];

    return (
        <div className="min-h-screen bg-[var(--drafting-white)] text-[var(--deep-teal)] overflow-x-hidden page-enter">
            {/* Hero */}
            <section className="relative py-24 border-b border-[var(--ink-line)] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(var(--deep-teal) 1px, transparent 1px), linear-gradient(90deg, var(--deep-teal) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}>
                </div>
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 relative z-10">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-4 text-[var(--paper-plane-grey)] mb-8">
                            <span className="h-[1px] w-16 bg-[var(--ink-line)]"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.5em]">About // Platform Overview</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none mb-6">
                            Archiving the <br /><span className="italic opacity-80">Built Environment</span>
                        </h1>
                        <p className="text-xl text-[var(--paper-plane-grey)] max-w-2xl leading-relaxed font-light">
                            Archfolio is a peer-reviewed technical repository that documents, evaluates, and publishes high-performance architectural case studies from around the world.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-20 border-b border-[var(--ink-line)]">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <ScrollReveal>
                        <span className="material-symbols-outlined text-5xl text-[var(--mustard-gold)] mb-6 block">architecture</span>
                        <blockquote className="text-2xl md:text-4xl font-light italic leading-relaxed text-[var(--deep-teal)] mb-6">
                            &ldquo;Great architecture deserves more than a photograph — it deserves rigorous documentation, honest analysis, and permanent preservation.&rdquo;
                        </blockquote>
                        <p className="text-sm uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">— Fikra Innovation Lab</p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 border-b border-[var(--ink-line)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-3 block">Principles</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Our Core Values</h2>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <ScrollReveal key={v.title} delay={i * 0.1}>
                                <div className="hand-drawn-card p-8 text-center hover-lift group">
                                    <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--mustard-gold)] flex items-center justify-center bg-[var(--mustard-gold)]/5 group-hover:bg-[var(--mustard-gold)]/20 transition-colors">
                                        <span className="material-symbols-outlined text-3xl text-[var(--mustard-gold)]">{v.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-3">{v.title}</h3>
                                    <p className="text-sm text-[var(--paper-plane-grey)] font-light leading-relaxed">{v.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 border-b border-[var(--ink-line)] bg-[var(--card-bg)]">
                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--electric-teal)] mb-3 block">Journey</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Our Timeline</h2>
                        </div>
                    </ScrollReveal>
                    <div className="relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--ink-line)] -translate-x-1/2 hidden md:block"></div>
                        {milestones.map((m, i) => (
                            <ScrollReveal key={m.year} delay={i * 0.15}>
                                <div className={`flex items-center gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}>
                                    <div className={`md:w-5/12 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                                        <span className="text-5xl font-black text-[var(--mustard-gold)] opacity-30">{m.year}</span>
                                        <h3 className="text-xl font-bold uppercase tracking-tight">{m.title}</h3>
                                        <p className="text-sm text-[var(--paper-plane-grey)] font-light mt-2">{m.desc}</p>
                                    </div>
                                    <div className="md:w-2/12 flex justify-center">
                                        <div className="w-5 h-5 bg-[var(--electric-teal)] border-4 border-[var(--card-bg)] rounded-full shadow-sm relative z-10"></div>
                                    </div>
                                    <div className="md:w-5/12"></div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 border-b border-[var(--ink-line)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-3 block">People</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Behind the Platform</h2>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((t, i) => (
                            <ScrollReveal key={t.role} delay={i * 0.1}>
                                <div className="hand-drawn-card p-6 hover-lift">
                                    <div className="w-16 h-16 bg-[var(--deep-teal)] flex items-center justify-center text-[var(--drafting-white)] text-2xl font-bold mb-4">
                                        {t.name[0]}
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--electric-teal)] mb-1">{t.role}</div>
                                    <h3 className="text-lg font-bold tracking-tight mb-2">{t.name}</h3>
                                    <p className="text-sm text-[var(--paper-plane-grey)] font-light">{t.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20 border-b border-[var(--ink-line)]">
                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--electric-teal)] mb-3 block">Infrastructure</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Built With</h2>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Next.js', desc: 'React Framework' },
                            { name: 'Prisma', desc: 'Database ORM' },
                            { name: 'PostgreSQL', desc: 'Data Storage' },
                            { name: 'Tailwind', desc: 'Design System' },
                            { name: 'Leaflet', desc: 'Map Engine' },
                            { name: 'TypeScript', desc: 'Type Safety' },
                            { name: 'Vercel', desc: 'Deployment' },
                            { name: 'Node.js', desc: 'Server Runtime' },
                        ].map((tech, i) => (
                            <ScrollReveal key={tech.name} delay={i * 0.05}>
                                <div className="border border-[var(--ink-line)] p-4 text-center hover:border-[var(--electric-teal)] transition-colors bg-[var(--card-bg)]">
                                    <p className="text-lg font-bold text-[var(--deep-teal)]">{tech.name}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)]">{tech.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-[var(--deep-teal)] text-[var(--drafting-white)] text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(var(--drafting-white) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>
                <div className="max-w-3xl mx-auto px-4 relative z-10">
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Join Archfolio</h2>
                        <p className="opacity-70 font-light mb-10 text-lg">Whether you&apos;re a practicing architect, structural engineer, or academic — your work deserves permanent documentation.</p>
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
