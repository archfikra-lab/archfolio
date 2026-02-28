import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function StudioLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[var(--drafting-white)] font-sans text-[var(--deep-teal)]">
            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between border-b border-[var(--mustard-gold)]/20 bg-[var(--drafting-white)] px-6 py-4 lg:px-20">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="text-[var(--mustard-gold)]">
                                <span className="material-symbols-outlined text-4xl">architecture</span>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[var(--deep-teal)] text-xl font-black leading-tight tracking-tight uppercase">Archfolio</h2>
                                <p className="text-[10px] font-bold text-[var(--mustard-gold)] tracking-widest uppercase">Powered by Fikra</p>
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center bg-[var(--mustard-gold)]/5 rounded-full px-4 py-1.5 border border-[var(--mustard-gold)]/10">
                            <span className="material-symbols-outlined text-[var(--mustard-gold)] text-xl">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-[var(--paper-plane-grey)] dark:placeholder:text-slate-500 outline-none" placeholder="Search case studies, drafts..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
                            <Link className="text-[var(--mustard-gold)] border-b-2 border-[var(--mustard-gold)] pb-1" href="/en/studio">Workspace</Link>
                            <Link className="text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)] transition-colors" href="/en/explore">Portfolio</Link>
                            <Link className="text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)] transition-colors" href="/en/firms">Shared</Link>
                            <Link className="text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)] transition-colors" href="/en/archive">Archive</Link>
                        </nav>
                        <div className="flex items-center gap-4 border-l border-[var(--mustard-gold)]/20 pl-6">
                            <ThemeSwitcher />
                            <button className="flex items-center justify-center rounded-full bg-[var(--mustard-gold)]/10 p-2 text-[var(--mustard-gold)]">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div className="h-10 w-10 rounded-full border-2 border-[var(--mustard-gold)] bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRWqyEC0yJ8PssVOk-8BfgxdzYvHm2Evho_UdqzzJbXye1kHnElqvZ9pUYoN0jxv2cmgoYrZ_icwWMe6U8vb4e57Zg-GSnwQhvJyWsJUen-oCYx5GDckYAhZMwJsC0oFRrmwKy4A3rr00tUucjUzQFhQAr3qwtLfIG_92jLFIssZJczk4suFkA5302m0t4BzCY_9P7qOlCVOW2egmqcIAudgFVfmdP2H86Ut4bhc1_yr_9JPvokRUDfUCuvaMYfbJyJyrPpQCqop7N')" }}></div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex flex-col lg:flex-row px-6 lg:px-20 py-10 gap-10">
                    <aside className="w-full lg:w-64 flex flex-col gap-8">
                        <div>
                            <h1 className="text-2xl font-black text-[var(--deep-teal)] mb-1">Workspace</h1>
                            <p className="text-[var(--paper-plane-grey)] text-sm font-medium">Drafting Mode Active</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--mustard-gold)] text-[var(--deep-teal)] font-bold shadow-sm" href="/en/studio">
                                <span className="material-symbols-outlined">edit_square</span>
                                <span>My Drafts</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--mustard-gold)]/10 text-[var(--paper-plane-grey)] font-medium transition-all" href="/en/studio">
                                <span className="material-symbols-outlined text-[var(--mustard-gold)]">visibility</span>
                                <span>Under Review</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--mustard-gold)]/10 text-[var(--paper-plane-grey)] font-medium transition-all" href="/en/firms">
                                <span className="material-symbols-outlined text-[var(--mustard-gold)]">group</span>
                                <span>Shared Projects</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--mustard-gold)]/10 text-[var(--paper-plane-grey)] font-medium transition-all" href="#">
                                <span className="material-symbols-outlined text-[var(--mustard-gold)]">settings</span>
                                <span>Studio Settings</span>
                            </Link>
                        </div>
                        <div className="mt-4 p-5 rounded-2xl bg-[var(--mustard-gold)]/5 border border-dashed border-[var(--mustard-gold)]/30">
                            <p className="text-xs font-bold text-[var(--mustard-gold)] uppercase tracking-widest mb-2">Storage Usage</p>
                            <div className="w-full bg-[var(--platinum-sheen)] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[var(--mustard-gold)] h-full w-[65%]"></div>
                            </div>
                            <p className="text-[10px] text-[var(--paper-plane-grey)] mt-2 font-medium">1.2GB of 2.0GB Used</p>
                        </div>
                    </aside>
                    <div className="flex-1 flex flex-col gap-10">
                        {children}
                    </div>
                </main>
                <footer className="mt-auto border-t border-[var(--mustard-gold)]/20 bg-[var(--card-bg)] py-10 px-6 lg:px-20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2 mb-2">
                                <Image src="/app-logo.png" alt="Fikra Logo" width={100} height={30} className="w-auto h-8 object-contain" />
                            </div>
                            <p className="text-xs text-[var(--paper-plane-grey)] font-medium">© 2024 Fikra Creative Solutions. All rights reserved.</p>
                        </div>
                        <div className="flex gap-8 text-[10px] font-black text-[var(--paper-plane-grey)] uppercase tracking-widest">
                            <Link className="hover:text-[var(--mustard-gold)] transition-colors" href="#">Privacy Policy</Link>
                            <Link className="hover:text-[var(--mustard-gold)] transition-colors" href="#">Terms of Service</Link>
                            <Link className="hover:text-[var(--mustard-gold)] transition-colors" href="#">Drafting Guidelines</Link>
                            <Link className="hover:text-[var(--mustard-gold)] transition-colors" href="#">Support</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
