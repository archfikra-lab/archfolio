import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[var(--drafting-white)] border-t border-[var(--ink-line)] px-6 lg:px-12 py-16">
            <div className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex flex-col mb-8">
                            <div className="flex flex-col">
                                <Image src="/app-logo.png" alt="Fikra Logo" width={150} height={50} className="w-auto h-10 object-contain" />
                            </div>
                            <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[var(--paper-plane-grey)] ml-8">Powered by Fikra</span>
                        </div>
                        <p className="text-sm text-[var(--paper-plane-grey)] leading-relaxed mb-8">
                            Empowering architects and engineers through professional case study documentation.
                        </p>
                        <div className="flex gap-4">
                            <Link className="w-8 h-8 flex items-center justify-center border border-[var(--light-ink-line)] text-[var(--deep-teal)]/80 hover:bg-[var(--mustard-gold)] hover:text-[var(--drafting-white)] transition-all" href="#">
                                <span className="material-symbols-outlined text-sm">public</span>
                            </Link>
                            <Link className="w-8 h-8 flex items-center justify-center border border-[var(--light-ink-line)] text-[var(--deep-teal)]/80 hover:bg-[var(--mustard-gold)] hover:text-[var(--drafting-white)] transition-all" href="#">
                                <span className="material-symbols-outlined text-sm">share</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-widest text-[var(--deep-teal)] mb-8">Navigation</h5>
                        <ul className="space-y-4 text-sm font-medium text-[var(--paper-plane-grey)]">
                            <li><Link className="hover:text-[var(--mustard-gold)]" href="/en/explore">All Projects</Link></li>
                            <li><Link className="hover:text-[var(--mustard-gold)]" href="/en/firms">Firm Directory</Link></li>
                            <li><Link className="hover:text-[var(--mustard-gold)]" href="/en/awards">Awards Portal</Link></li>
                            <li><Link className="hover:text-[var(--mustard-gold)]" href="/en/about">About</Link></li>
                            <li><Link className="hover:text-[var(--mustard-gold)]" href="/en/archive">Archive</Link></li>
                            <li><Link className="hover:text-[var(--mustard-gold)]" href="/en/help">Help Center</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-widest text-[var(--deep-teal)] mb-8">Newsletter</h5>
                        <p className="text-xs text-[var(--paper-plane-grey)] mb-6 uppercase tracking-wider">Weekly Technical Briefing</p>
                        <div className="flex border-b border-[var(--light-ink-line)] pb-2 mb-8">
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 placeholder:text-[var(--paper-plane-grey)] text-[var(--deep-teal)] focus:outline-none"
                                placeholder="Email Address"
                                type="email"
                            />
                            <button className="text-[var(--mustard-gold)] bg-transparent">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                        <h5 className="text-xs font-bold uppercase tracking-widest text-[var(--deep-teal)] mb-4 mt-8">Portals</h5>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/en/admin" className="text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors border border-[var(--light-ink-line)] px-3 py-1.5" title="Admin">Admin</Link>
                            <Link href="/en/studio" className="text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors border border-[var(--light-ink-line)] px-3 py-1.5" title="Studio">Studio</Link>
                            <Link href="/en/expert" className="text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors border border-[var(--light-ink-line)] px-3 py-1.5" title="Expert">Expert</Link>
                            <Link href="/en/academic" className="text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors border border-[var(--light-ink-line)] px-3 py-1.5" title="Academic">Academic</Link>
                            <Link href="/en/author" className="text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors border border-[var(--light-ink-line)] px-3 py-1.5" title="Author">Author</Link>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-[var(--ink-line)] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)]">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p>© 2024 Archfolio · Archiving the Built Environment</p>
                        <div className="hidden md:block w-px h-3 bg-[var(--ink-line)]"></div>
                        <div className="flex items-center gap-2">
                            <span>Developed and managed by</span>
                            <img src="/fikra-logo.jpg" alt="FIKRA Logo" className="h-6 w-auto object-contain bg-black/10 p-0.5 rounded-sm" />
                        </div>
                    </div>
                    <div className="flex gap-10">
                        <Link className="hover:text-[var(--deep-teal)]" href="#">Legal Notice</Link>
                        <Link className="hover:text-[var(--deep-teal)]" href="#">Technical Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
