import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const DEFAULT_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDjEyWQJMCUhK2IuI8hgCIO7aDJukZeZ2_bjtRRr1IEo8mRrS5MLnOkQL9bHYlcRKZY6Reqz3D9y6OD_SRjuPkJHTUMH0EpIbvMsRd4qTqHIHYyNEqYluyi3sU-v4NcDeXjDGQxgx_5FE2z_OX8BZw8ULDS24bZ-3onmaoYPP3mcnS99F36HSfj4MOwFJzS54CBnVoxPwWopyHrZfSIxvKU4RysJe8FqIVr7Vclcdpbq9_kM549HYzG4atqx2pwlGNDwLFQBFoAp5Mp",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBzsi-JG1QzDAilMULe7n9drFOUqpTVOggrnnNtCLmAZJg7FVQvw-CBYJPItCri1dh-wXFnkiIPHB5tgwh9V6jZ-Hcs8mCRDyqGt9w1WXYHRpooNa4vT5z5XrCQW459sNDd6FMin0yYrv--t2WK60-xIQK9b5-tvq9vam-m4RWK7xPiciQfkOgG1C-1iLhWFkazeFvKULaG6aJ7pmXd_m6UQ8f6uX5JxXbad8t6xx3C2DN-u_zrGW3wKb_d6F2u2ABGek_ODu6vVtTH",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVq6jS5dq-kvGhsH8vhemwkk1Xe8caE6m9se-oEScrDHXKoyk0q4NijDsghDpeacmv_Sz7dkq--N3XtSaEDiPSoenzMJ0uerMhIOOkSVUCr6UhREO32xBmDbDhDHRO9Lubxu0ofTtUtqzLoPxhUlN2zf7t33Yb3z7EiyN14-Fke5XzGP2kFLkApzlw6leAu5G3Ule1F_B-DJ7lbF-vnGATfpLVgFXYGJokTB7yg6FVeFMmbM02JmYD5NgkYybc9UjnuHtLVy9ZH66r",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqEl_Hy4KzkVKns7lg8cnhVH9qyPnI8XLFbaHIFtYBUCPc38wXjyj-xEVj4ICH1917t1RAYduQwiomSZnlJPdYiUEiaIGbls3S5LHuKSOs_2UwJikZIXONgv39q2-L1xPTZ_CbJpUrHM1S-kWMgqcgqBKJ2nlQltGuPrc489xjDmzy3wmvsjfsk7vWf0MAkzkcySZE7y5ZZvXgNgWGNghfAeHd_FDh5DPF64ztdKscn5HTknzq0hz1Vg9qxkGxk_2-pSNJfnKvCMN-"
];

export default async function Home() {
  const projects = await prisma.project.findMany({
    include: { disciplines: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div className="w-full bg-[var(--platinum-sheen)] border-b border-[var(--ink-line)] overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 blueprint-grid"></div>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-3 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--paper-plane-grey)] border border-[var(--paper-plane-grey)] px-2 py-0.5">
              Platinum Partner
            </span>
            <p className="text-xs tracking-tight text-[var(--electric-teal)] font-medium">
              <span className="opacity-60 italic text-white/70">Cinematic Series:</span> High-performance glazing solutions for the modern facade.
            </p>
          </div>
          <Link
            className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] flex items-center gap-2 hover:text-[var(--mustard-gold)] transition-colors"
            href="#"
          >
            Explore Technical Specs
            <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[var(--midnight-charcoal)]/90 backdrop-blur-sm border-b border-[var(--ink-line)] px-6 lg:px-12 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--electric-teal)] text-3xl">architecture</span>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--electric-teal)]">Archfolio</h1>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--paper-plane-grey)] ml-9">
                Curated by Fikra
              </span>
            </div>
            <nav className="hidden lg:flex items-center gap-10">
              <Link className="text-sm font-semibold text-white/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider" href="#">
                Explore
              </Link>
              <Link className="text-sm font-semibold text-white/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider" href="#">
                Firms
              </Link>
              <Link className="text-sm font-semibold text-white/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider" href="#">
                Archive
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center border border-[var(--light-ink-line)] bg-[var(--platinum-sheen)] rounded-full p-1">
              <button className="p-1.5 flex items-center justify-center text-[var(--paper-plane-grey)] hover:text-white" title="Light Theme (Blueprint)">
                <span className="material-symbols-outlined text-lg">light_mode</span>
              </button>
              <button className="p-1.5 flex items-center justify-center bg-[var(--mustard-gold)] text-[var(--midnight-charcoal)] rounded-full" title="Dark Theme (Inkwell)">
                <span className="material-symbols-outlined text-lg">dark_mode</span>
              </button>
            </div>
            <div className="hidden md:flex items-center border border-[var(--ink-line)] px-4 py-1.5 bg-black/20">
              <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-xl">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-40 placeholder:text-[var(--paper-plane-grey)] text-white focus:outline-none"
                placeholder="Search blueprints..."
                type="text"
              />
            </div>
            <button className="bg-[var(--mustard-gold)] text-[var(--midnight-charcoal)] px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[var(--electric-teal)] transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">edit_square</span>
              Publish Case Study
            </button>
            <div className="w-10 h-10 border border-[var(--ink-line)] p-0.5">
              <img
                alt="Architect Profile"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC644_MJ0UHp32LxXOmKNum1rD-JB2GwOyPKHJj1thyePIA0THPca96ndtRroENteHUUggd8nn8h6YSR0hGgMXTj42nj2SlVttsR6tU8xTgQKgWqkkOlFaZBMWYbf_Dk9bcwsggmbWF2JURFG7W1L5oz3dY8lz47gnq_eMnTkg_9EmQFIMWugyHYwhyJa7wxK5TZwpIHyC5pM8NXQDK7EQPrIl5gcR4cVNAP9t_nf_5NGS9Tvz6uW7dLPuxoQMq6kOUzD0kzSnV2BaW"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[var(--ink-line)] blueprint-grid h-auto lg:h-[700px] flex flex-col justify-center py-20 lg:py-0">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-3 text-[var(--mustard-gold)] mb-6">
                <span className="h-px w-12 bg-[var(--mustard-gold)]"></span>
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Architectural Record</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 text-white">
                Archiving the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric-teal)] to-[var(--mustard-gold)]">Built Environment</span>
              </h2>
              <p className="text-lg text-white/70 max-w-lg mb-10 leading-relaxed">
                A specialized repository of high-performance architectural case studies and structural engineering breakthroughs.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[var(--mustard-gold)] text-[var(--midnight-charcoal)] px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--electric-teal)] transition-all flex items-center gap-3">
                  View Featured Work
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </button>
              </div>
            </div>

            <div className="relative group hidden lg:block">
              <div className="ad-placeholder-platinum w-full aspect-video p-10 flex flex-col items-center justify-center text-center rotate-1 group-hover:rotate-0 transition-transform duration-700">
                <div className="absolute top-0 left-0 technical-crosshair border-t-0 border-l-0 translate-x-4 translate-y-4"></div>
                <div className="absolute bottom-0 right-0 technical-crosshair border-b-0 border-r-0 -translate-x-4 -translate-y-4"></div>
                <div className="opacity-10 absolute inset-0 blueprint-pattern"></div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-6xl text-[var(--paper-plane-grey)] opacity-30 mb-4">polyline</span>
                  <h3 className="text-2xl font-light text-white tracking-[0.2em] uppercase mb-2">Platinum Feature</h3>
                  <p className="text-[var(--paper-plane-grey)] text-xs uppercase tracking-widest border-t border-[var(--ink-line)] pt-4 mt-4 inline-block">
                    Your Project Here
                  </p>
                </div>
                <div className="absolute bottom-4 right-6 flex items-center gap-2 opacity-40">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Powered by Fikra</span>
                  <span className="material-symbols-outlined text-sm text-[var(--paper-plane-grey)]">change_history</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-12 py-16 bg-[var(--midnight-charcoal)]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-[var(--ink-line)] pb-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Technical Portfolio</h3>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">Sort by Discipline</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
                <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-tighter bg-[var(--mustard-gold)] text-[var(--midnight-charcoal)]">All Works</button>
                <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-tighter border border-[var(--light-ink-line)] hover:border-[var(--electric-teal)] text-white/70">Architectural</button>
                <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-tighter border border-[var(--light-ink-line)] hover:border-[var(--electric-teal)] text-white/70">Structural</button>
                <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-tighter border border-[var(--light-ink-line)] hover:border-[var(--electric-teal)] text-white/70">Mechanical</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project, index) => {
                const imageSrc = DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
                const adIndex = index + 1; // 1-based index for logic

                return (
                  <div key={project.id} className="contents">
                    {/* Sketch Card */}
                    <div className="sketch-card bg-[var(--card-bg)] p-4 group">
                      <div className="relative overflow-hidden mb-6 border border-[var(--ink-line)]">
                        <img
                          alt={project.title}
                          className="w-full aspect-[4/5] object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                          src={imageSrc}
                        />
                        <div className="absolute inset-0 bg-[var(--electric-teal)]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--mustard-gold)] transition-colors">{project.title}</h4>
                          <div className="flex gap-3 items-center">
                            {project.disciplines.slice(0, 2).map((discipline, i) => (
                              <div key={discipline.id} className="flex gap-3 items-center">
                                {i > 0 && <span className="w-1 h-1 rounded-full bg-[var(--paper-plane-grey)]"></span>}
                                <span className={`text-[10px] font-bold uppercase ${i === 1 ? 'text-[var(--electric-teal)]' : 'text-[var(--paper-plane-grey)]'}`}>{discipline.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[var(--paper-plane-grey)] group-hover:text-[var(--electric-teal)]">open_in_new</span>
                      </div>
                    </div>

                    {/* Inject Custom Ads Interleaved with Projects */}
                    {adIndex === 1 && (
                      <div className="ad-placeholder-gold p-8 flex flex-col justify-between group">
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[var(--mustard-gold)]"></div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--mustard-gold)] mb-4 block">Industry Partner Spotlight</span>
                          <div className="w-full h-px bg-[var(--mustard-gold)]/30 mb-6"></div>
                          <h4 className="text-2xl font-bold text-white mb-4 leading-tight italic">Structural Innovators Collective</h4>
                        </div>
                        <div className="relative flex items-center justify-center h-48 border border-dashed border-[var(--ink-line)] mb-6 overflow-hidden">
                          <div className="absolute inset-0 opacity-20 blueprint-pattern"></div>
                          <span className="material-symbols-outlined text-4xl text-[var(--mustard-gold)] opacity-40">layers</span>
                          <p className="absolute bottom-2 text-[8px] uppercase tracking-tighter text-[var(--paper-plane-grey)]">Schematic Representation Only</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest mb-1">Status: Open Slot</p>
                            <p className="text-xs text-[var(--mustard-gold)] font-bold">Partner with Archfolio</p>
                          </div>
                          <span className="material-symbols-outlined text-[var(--mustard-gold)]">add_circle</span>
                        </div>
                      </div>
                    )}

                    {adIndex === 2 && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <div className="ad-placeholder-silver p-6 flex flex-col md:flex-row items-center justify-between border-dashed border-[var(--paper-plane-grey)] relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none blueprint-grid"></div>
                          <div className="flex items-center gap-6 relative z-10">
                            <div className="w-12 h-12 border border-[var(--ink-line)] flex items-center justify-center">
                              <span className="material-symbols-outlined text-[var(--paper-plane-grey)] opacity-50">branding_watermark</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--paper-plane-grey)] mb-1 block">Silver Tier Partner Space</span>
                              <h4 className="text-lg font-medium text-white/90 tracking-tight">
                                Technical Component Spotlight: <span className="text-[var(--electric-teal)]">Your Product Specification Here</span>
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-10 mt-6 md:mt-0 relative z-10">
                            <div className="hidden xl:block text-right">
                              <p className="text-[9px] text-[var(--paper-plane-grey)] uppercase tracking-[0.2em] italic mb-1">Architecture-Grade Visibility</p>
                              <p className="text-[10px] font-bold text-white/60">FIKRA Verified Industry Placement</p>
                            </div>
                            <button className="border border-[var(--paper-plane-grey)]/40 text-[var(--paper-plane-grey)] px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-[var(--mustard-gold)] hover:text-[var(--mustard-gold)] transition-all bg-transparent">
                              Inquire Slot
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {adIndex === 3 && (
                      <div className="ad-placeholder-gold p-8 flex flex-col justify-center items-center text-center border-dashed">
                        <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-[var(--mustard-gold)] absolute top-4 left-0 right-0">Gold Tier Placement</span>
                        <span className="material-symbols-outlined text-5xl text-[var(--mustard-gold)] opacity-20 mb-6">architecture</span>
                        <h4 className="text-xl font-light text-white uppercase tracking-[0.3em] mb-4">Space for <br /> <span className="font-bold text-[var(--mustard-gold)]">Global Firms</span></h4>
                        <div className="w-16 h-px bg-[var(--ink-line)] mb-6"></div>
                        <p className="text-[10px] text-[var(--paper-plane-grey)] uppercase leading-relaxed max-w-[180px]">Curated showcase of engineering excellence and material innovation.</p>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-30">
                          <span className="material-symbols-outlined text-xs">square_foot</span>
                          <span className="text-[8px] font-bold">BY FIKRA</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-20 text-center">
              <button className="border border-[var(--light-ink-line)] bg-transparent text-white px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--mustard-gold)] hover:text-[var(--midnight-charcoal)] transition-all">
                View Full Archives
              </button>
            </div>
          </div>
        </section>
      </main>

      <section className="bg-[var(--platinum-sheen)] border-y border-[var(--ink-line)] py-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="border-l border-[var(--ink-line)] pl-6">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] block mb-2">Partner Notice</span>
              <p className="text-[11px] font-medium text-white/80">Steel fabrication lead times reduced to 8 weeks for Archfolio members.</p>
            </div>
            <div className="border-l border-[var(--ink-line)] pl-6">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] block mb-2">Industry News</span>
              <p className="text-[11px] font-medium text-white/80">Upcoming: BIM Interoperability Summit 2024. Registration open.</p>
            </div>
            <div className="border-l border-[var(--ink-line)] pl-6">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] block mb-2">Classifieds</span>
              <p className="text-[11px] font-medium text-white/80">Senior Façade Engineer position available at Zenith Architectural.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--midnight-charcoal)] border-t border-[var(--ink-line)] px-6 lg:px-12 py-16">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex flex-col mb-8">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--electric-teal)] text-2xl">architecture</span>
                  <h1 className="text-xl font-bold tracking-tight text-[var(--electric-teal)]">Archfolio</h1>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[var(--paper-plane-grey)] ml-8">Powered by Fikra</span>
              </div>
              <p className="text-sm text-[var(--paper-plane-grey)] leading-relaxed mb-8">
                Empowering architects and engineers through professional case study documentation.
              </p>
              <div className="flex gap-4">
                <Link className="w-8 h-8 flex items-center justify-center border border-[var(--light-ink-line)] text-white/80 hover:bg-[var(--mustard-gold)] hover:text-[var(--midnight-charcoal)] transition-all" href="#">
                  <span className="material-symbols-outlined text-sm">public</span>
                </Link>
                <Link className="w-8 h-8 flex items-center justify-center border border-[var(--light-ink-line)] text-white/80 hover:bg-[var(--mustard-gold)] hover:text-[var(--midnight-charcoal)] transition-all" href="#">
                  <span className="material-symbols-outlined text-sm">share</span>
                </Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-8">Navigation</h5>
              <ul className="space-y-4 text-sm font-medium text-[var(--paper-plane-grey)]">
                <li><Link className="hover:text-[var(--mustard-gold)]" href="#">All Projects</Link></li>
                <li><Link className="hover:text-[var(--mustard-gold)]" href="#">Firm Directory</Link></li>
                <li><Link className="hover:text-[var(--mustard-gold)]" href="#">Awards Portal</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-8">Disciplines</h5>
              <ul className="space-y-4 text-sm font-medium text-[var(--paper-plane-grey)]">
                <li><Link className="hover:text-[var(--mustard-gold)]" href="#">Structural Design</Link></li>
                <li><Link className="hover:text-[var(--mustard-gold)]" href="#">Sustainable MEP</Link></li>
                <li><Link className="hover:text-[var(--mustard-gold)]" href="#">Urban Planning</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-8">Newsletter</h5>
              <p className="text-xs text-[var(--paper-plane-grey)] mb-6 uppercase tracking-wider">Weekly Technical Briefing</p>
              <div className="flex border-b border-[var(--light-ink-line)] pb-2">
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 placeholder:text-[var(--paper-plane-grey)] text-white focus:outline-none"
                  placeholder="Email Address"
                  type="email"
                />
                <button className="text-[var(--mustard-gold)] bg-transparent">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--ink-line)] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)]">
            <p>© 2024 Archfolio Artistic Gallery. A Fikra Project.</p>
            <div className="flex gap-10">
              <Link className="hover:text-white" href="#">Legal Notice</Link>
              <Link className="hover:text-white" href="#">Technical Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
