import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Header() {
    return (
        <>
            <div className="w-full bg-[var(--platinum-sheen)] border-b border-[var(--ink-line)] overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 blueprint-grid"></div>
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-3 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--paper-plane-grey)] border border-[var(--paper-plane-grey)] px-2 py-0.5">
                            Platinum Partner
                        </span>
                        <p className="text-xs tracking-tight text-[var(--deep-teal)] font-medium">
                            <span className="opacity-60 italic text-[var(--deep-teal)]">Cinematic Series:</span> High-performance glazing solutions for the modern facade.
                        </p>
                    </div>
                    <Link
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--deep-teal)] flex items-center gap-2 hover:text-[var(--mustard-gold)] transition-colors"
                        href="#"
                    >
                        Explore Technical Specs
                        <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                    </Link>
                </div>
            </div>

            <header className="sticky top-0 z-50 bg-[var(--card-bg)]/90 backdrop-blur-sm border-b border-[var(--ink-line)] px-6 lg:px-12 py-4 frayed-edge">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/en" className="flex flex-col hover:opacity-80 transition-opacity">
                            <div className="flex flex-col">
                                <Image src="/app-logo.png" alt="Fikra Logo" width={150} height={50} className="w-auto h-12 object-contain" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--paper-plane-grey)] ml-9 mt-1">
                                Curated by Fikra
                            </span>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-10">
                            <Link className="text-sm font-semibold text-[var(--deep-teal)]/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider" href="/en/explore">
                                Explore
                            </Link>
                            <Link className="text-sm font-semibold text-[var(--deep-teal)]/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider" href="/en/firms">
                                Firms
                            </Link>
                            <Link className="text-sm font-semibold text-[var(--deep-teal)]/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider" href="/en/archive">
                                Archive
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <ThemeSwitcher />
                        <div className="hidden md:flex items-center border border-[var(--ink-line)] px-4 py-1.5 bg-black/20">
                            <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-xl">search</span>
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm w-40 placeholder:text-[var(--paper-plane-grey)] text-[var(--deep-teal)] focus:outline-none"
                                placeholder="Search blueprints..."
                                type="text"
                            />
                        </div>
                        <Link href="/en/contributor" className="bg-[var(--mustard-gold)] text-[var(--drafting-white)] px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-all flex items-center gap-2 chalk-btn">
                            <span className="material-symbols-outlined text-sm">edit_square</span>
                            Publish Case Study
                        </Link>
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
        </>
    );
}
