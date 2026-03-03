import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import PartnersMarquee from "@/components/PartnersMarquee";
import DonorsSection from "@/components/DonorsSection";
import AnimatedAd from "@/components/AnimatedAd";
import { getTranslations } from 'next-intl/server';

export default async function Home() {
    const tHero = await getTranslations('Hero');
    const tHome = await getTranslations('HomeSection');
    const tDisc = await getTranslations('DisciplinesSection');
    const tData = await getTranslations('Data');
    const tTest = await getTranslations('Testimonials');
    const tCTA = await getTranslations('CTA');
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

    // Fetch Dynamic Analytical Layers
    const layers: any[] = await (prisma as any).analyticalLayer.findMany({
        where: { active: true },
        orderBy: { order: 'asc' }
    });

    // Determine if we're in Arabic by testing the current pathname translation (if possible) or infer from headers (Workaround: check translation key matches)
    // Actually, getTranslations scope usually doesn't expose locale easily. We will check if tCTA('ready') contains Arabic chars
    const isArabic = /[\u0600-\u06FF]/.test(tCTA('ready'));

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
                            <h2 className="text-6xl md:text-8xl font-light leading-none mb-10 uppercase tracking-tighter whitespace-pre-line">
                                {tHero('builtEnvironment')}
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <p className="text-xl text-[var(--paper-plane-grey)] max-w-lg mb-12 leading-relaxed font-light">
                                {tHero('description')}
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.3}>
                            <div className="flex flex-wrap gap-6">
                                <Link href="/en/explore" className="chalk-btn px-10 py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-4 text-[var(--deep-teal)]">
                                    {tHero('viewFeaturedWork')}
                                    <span className="material-symbols-outlined text-lg">straighten</span>
                                </Link>
                            </div>
                        </ScrollReveal>

                        {/* Animated Stats */}
                        <ScrollReveal delay={0.4}>
                            <div className="mt-16 grid grid-cols-3 gap-6 pt-8 border-t border-[var(--ink-line)]">
                                <div>
                                    <AnimatedCounter target={projectCount > 0 ? projectCount : 4200} suffix={projectCount > 0 && projectCount < 100 ? '' : 'k'} className="text-4xl font-black text-[var(--mustard-gold)]" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">{tHero('projects')}</p>
                                </div>
                                <div>
                                    <AnimatedCounter target={firmCount > 0 ? firmCount : 850} suffix="" className="text-4xl font-black text-[var(--mustard-gold)]" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">{tHero('authors')}</p>
                                </div>
                                <div>
                                    <AnimatedCounter target={12} suffix="" className="text-4xl font-black text-[var(--mustard-gold)]" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">{tHero('countries')}</p>
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
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-3 block">{tHome('workflow')}</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">{tHome('howItWorks')}</h2>
                            <p className="text-[var(--paper-plane-grey)] font-light max-w-xl mx-auto">{tHome('workflowDesc')}</p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--ink-line)] to-transparent -translate-y-1/2 z-0"></div>

                        <ScrollReveal delay={0.1}>
                            <div className="relative hand-drawn-card p-8 text-center hover-lift group chalk-border">
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[var(--mustard-gold)]/5 group-hover:bg-[var(--mustard-gold)]/20 transition-colors chalk-border">
                                    <span className="material-symbols-outlined text-3xl text-[var(--mustard-gold)]">upload_file</span>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-2">{tHome('step1')}</div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">{tHome('step1Title')}</h3>
                                <p className="text-sm text-[var(--paper-plane-grey)] font-light">{tHome('step1Desc')}</p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div className="relative hand-drawn-card p-8 text-center hover-lift group chalk-border">
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[var(--deep-teal)]/5 group-hover:bg-[var(--deep-teal)]/20 transition-colors chalk-border" style={{ borderColor: 'var(--deep-teal)' }}>
                                    <span className="material-symbols-outlined text-3xl text-[var(--deep-teal)]">rate_review</span>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-2">{tHome('step2')}</div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">{tHome('step2Title')}</h3>
                                <p className="text-sm text-[var(--paper-plane-grey)] font-light">{tHome('step2Desc')}</p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.3}>
                            <div className="relative hand-drawn-card p-8 text-center hover-lift group chalk-border">
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[var(--deep-teal)]/5 group-hover:bg-[var(--deep-teal)]/20 transition-colors chalk-border" style={{ borderColor: 'var(--deep-teal)' }}>
                                    <span className="material-symbols-outlined text-3xl text-[var(--deep-teal)]">verified</span>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-2">{tHome('step3')}</div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">{tHome('step3Title')}</h3>
                                <p className="text-sm text-[var(--paper-plane-grey)] font-light">{tHome('step3Desc')}</p>
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
                                <h3 className="text-4xl font-light mb-4 uppercase tracking-widest">{tHome('engineeringPortfolio')}</h3>
                                <p className="text-[var(--paper-plane-grey)] text-xs uppercase tracking-[0.4em]">{tHome('subDivision')}</p>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-8 md:mt-0">
                                <Link href="/en/explore" className="chalk-btn px-6 py-2 text-[10px] font-bold uppercase tracking-widest bg-[var(--deep-teal)] text-[var(--drafting-white)]">{tHome('allLayers')}</Link>
                                <button className="chalk-btn px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-[var(--deep-teal)] transition-colors text-[var(--paper-plane-grey)]">{tHome('architectural')}</button>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-0">
                        {projects.map((project, idx) => {
                            // Define grid spanning logic for asymmetrical masonry
                            let spanClass = "md:col-span-6 lg:col-span-4"; // Default for idx > 1
                            if (idx === 0) spanClass = "md:col-span-12 lg:col-span-8";
                            else if (idx === 1) spanClass = "md:col-span-12 lg:col-span-4";

                            const isHero = idx === 0;

                            return (
                                <Link key={project.id} href={`/en/project/${project.id}`} className={`group relative block ${spanClass} hover-lift-dynamic`}>
                                    <div className={`hand-drawn-card bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden h-full flex flex-col items-start p-2 pb-6 chalk-border transition-all duration-300 ${isHero ? 'border-[var(--mustard-gold)]/50' : 'group-hover:border-[var(--electric-teal)]'}`}>

                                        {/* Image Section */}
                                        <div className={`relative w-full ${isHero ? 'aspect-video lg:aspect-[2/1]' : 'aspect-square'} overflow-hidden mb-6 border border-[var(--ink-line)]/50`}>
                                            {(() => {
                                                const imageAttachment = project.attachments?.find((a: any) =>
                                                    a.type === 'photo' || a.type?.startsWith('image')
                                                );
                                                const imageUrl = imageAttachment?.url;

                                                return imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover grayscale opacity-90 image-reveal transition-all duration-1000"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[var(--platinum-sheen)]/20 relative">
                                                        <div className="absolute inset-0 opacity-[0.05]"
                                                            style={{
                                                                backgroundImage: 'linear-gradient(var(--deep-teal) 1px, transparent 1px), linear-gradient(90deg, var(--deep-teal) 1px, transparent 1px)',
                                                                backgroundSize: '15px 15px'
                                                            }}>
                                                        </div>
                                                        <span className="material-symbols-outlined text-[var(--paper-plane-grey)] opacity-30 text-5xl">architecture</span>
                                                    </div>
                                                );
                                            })()}

                                            {/* Overlays */}
                                            <div className="absolute inset-0 bg-[var(--deep-teal)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none tracing-paper" style={{ mixBlendMode: 'overlay' }}></div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--deep-teal)]/90 via-[var(--deep-teal)]/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-end">
                                                <div className="flex gap-3 text-white">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest border border-white/30 px-2 py-1 bg-black/20 backdrop-blur-sm">{tData.has(`Typology.${project.typology}` as any) ? tData(`Typology.${project.typology}` as any) : project.typology}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest border border-white/30 px-2 py-1 bg-black/20 backdrop-blur-sm">{tData.has(`Location.${project.location}` as any) ? tData(`Location.${project.location}` as any) : project.location}</span>
                                                </div>
                                            </div>

                                            {isHero && (
                                                <div className="absolute top-4 left-4 bg-[var(--mustard-gold)] text-[var(--drafting-white)] text-[10px] uppercase font-bold tracking-widest px-3 py-1 shadow-md">
                                                    {tHome('featuredProject')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="px-5 w-full flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <h4 className={`font-light uppercase tracking-tight mb-2 group-hover:text-[var(--mustard-gold)] transition-colors ${isHero ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
                                                        {project.title}
                                                    </h4>
                                                    <span className="material-symbols-outlined text-[var(--paper-plane-grey)] group-hover:text-[var(--mustard-gold)] transition-colors opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-500 ease-out">east</span>
                                                </div>
                                                <p className="text-sm font-light text-[var(--paper-plane-grey)] line-clamp-2 mt-1 mb-4 leading-relaxed">
                                                    {project.shortDescription}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 pt-4 border-t border-[var(--ink-line)]/50 mt-auto">
                                                <span className="material-symbols-outlined text-[var(--electric-teal)] text-sm">verified</span>
                                                {project.author?.name ? (
                                                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--paper-plane-grey)]">{tHome('by')} {project.author.name}</span>
                                                ) : (
                                                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--paper-plane-grey)]">{tHome('fikraVerified')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mid-page Banner */}
                    <ScrollReveal delay={0.1}>
                        <div className="mt-16 border border-[var(--ink-line)] p-10 bg-[var(--card-bg)] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10 chalk-border">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--paper-plane-grey)] mb-4">{tHome('manualSpotlight')}</span>
                                <h4 className="text-3xl font-light tracking-tight uppercase max-w-xl leading-snug">{tHome('precisionDrafting')}</h4>
                            </div>
                            <div className="flex items-center gap-10">
                                <p className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-[0.3em] max-w-[180px] text-right hidden lg:block italic leading-relaxed">{tHome('redefiningStandards')}</p>
                                <button className="chalk-btn px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--deep-teal)]">
                                    {tHome('inquireNow')}
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="mt-24 text-center">
                        <Link href="/en/explore" className="chalk-btn px-16 py-5 text-xs font-bold uppercase tracking-[0.4em] inline-flex items-center gap-3 text-[var(--deep-teal)]">
                            {tHome('openAllArchives')}
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
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-3 block">{tDisc('crossDiscipline')}</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">{tDisc('fourLayers')}</h2>
                            <p className="text-[var(--paper-plane-grey)] font-light max-w-xl mx-auto">{tDisc('desc')}</p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {layers.length > 0 ? layers.map((layer: any, i: number) => (
                            <ScrollReveal key={layer.id} delay={i * 0.1}>
                                <div className="group hand-drawn-card p-8 hover-lift hover:border-[var(--mustard-gold)] transition-all relative overflow-hidden chalk-border">
                                    <div className="absolute top-0 right-0 w-20 h-20 border-l border-b border-[var(--ink-line)] group-hover:border-[var(--mustard-gold)]/30 transition-colors"></div>
                                    <div className="w-14 h-14 chalk-border flex items-center justify-center mb-6 transition-colors group-hover:bg-[var(--deep-teal)]/5" style={{ borderColor: layer.color }}>
                                        <span className="material-symbols-outlined text-2xl" style={{ color: layer.color }}>{layer.icon}</span>
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-1">{isArabic ? layer.subtitleAr : layer.subtitleEn}</div>
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-3">{isArabic ? layer.titleAr : layer.titleEn}</h3>
                                    <p className="text-sm text-[var(--paper-plane-grey)] font-light leading-relaxed">{isArabic ? layer.descAr : layer.descEn}</p>
                                </div>
                            </ScrollReveal>
                        )) : [
                            { icon: 'apartment', title: tDisc('archTitle'), subtitle: tDisc('archSub'), desc: tDisc('archDesc'), color: 'var(--deep-teal)' },
                            { icon: 'foundation', title: tDisc('structTitle'), subtitle: tDisc('structSub'), desc: tDisc('structDesc'), color: 'var(--electric-teal)' },
                            { icon: 'hvac', title: tDisc('mepTitle'), subtitle: tDisc('mepSub'), desc: tDisc('mepDesc'), color: 'var(--mustard-gold)' },
                            { icon: 'eco', title: tDisc('sustTitle'), subtitle: tDisc('sustSub'), desc: tDisc('sustDesc'), color: 'var(--bright-rust, #C0392B)' },
                        ].map((d, i) => (
                            <ScrollReveal key={d.title} delay={i * 0.1}>
                                <div className="group hand-drawn-card p-8 hover-lift hover:border-[var(--mustard-gold)] transition-all relative overflow-hidden chalk-border">
                                    <div className="absolute top-0 right-0 w-20 h-20 border-l border-b border-[var(--ink-line)] group-hover:border-[var(--mustard-gold)]/30 transition-colors"></div>
                                    <div className="w-14 h-14 chalk-border flex items-center justify-center mb-6 transition-colors group-hover:bg-[var(--deep-teal)]/5" style={{ borderColor: d.color }}>
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
            {
                ads.length > 0 && (
                    <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6">
                        <AnimatedAd ads={ads} placement="HOMEPAGE" />
                    </section>
                )
            }

            {/* Partners Marquee */}
            <PartnersMarquee partners={partners} />

            {/* Donors Section */}
            <DonorsSection donors={donors} />

            {/* Testimonials */}
            <section className="py-20 border-t border-[var(--ink-line)] bg-[var(--card-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-3 block">{tTest('voices')}</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">{tTest('fromCommunity')}</h2>
                            <p className="text-[var(--paper-plane-grey)] font-light max-w-xl mx-auto">{tTest('desc')}</p>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { quote: tTest('quote1'), name: tTest('name1'), role: tTest('role1'), firm: tTest('firm1') },
                            { quote: tTest('quote2'), name: tTest('name2'), role: tTest('role2'), firm: tTest('firm2') },
                            { quote: tTest('quote3'), name: tTest('name3'), role: tTest('role3'), firm: tTest('firm3') },
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
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">{tCTA('ready')}</h2>
                        <p className="opacity-70 font-light mb-10 text-lg">{tCTA('desc')}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/en/author" className="chalk-btn border-[var(--mustard-gold)] text-[var(--mustard-gold)] px-10 py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--mustard-gold)]/10">
                                {tCTA('submit')}
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </Link>
                            <Link href="/en/explore" className="chalk-btn border-[var(--drafting-white)]/30 px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-[var(--drafting-white)]/10">
                                {tCTA('browse')}
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div >
    );
}
