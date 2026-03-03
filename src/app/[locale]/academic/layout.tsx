import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ReactNode } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import HelpTriggerButton from "@/components/HelpTriggerButton";

export default function AcademicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--drafting-white)] text-[var(--deep-teal)]">
            {/* Academic Header */}
            <header className="sticky top-0 z-50 bg-[var(--platinum-sheen)]/90 backdrop-blur-sm border-b border-[var(--ink-line)] px-6 py-3">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Image src="/app-logo.png" alt="Fikra Logo" width={120} height={40} className="w-auto h-8 object-contain" />
                        </Link>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--mustard-gold)] border-l border-[var(--ink-line)] pl-4">
                            Academic Assessment Portal
                        </span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link className="text-xs font-semibold text-[var(--deep-teal)]/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider" href="/academic">
                            Assessment Queue
                        </Link>
                        <Link className="text-xs font-semibold text-[var(--deep-teal)]/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider" href="/explore">
                            Browse Archive
                        </Link>
                        <Link className="text-xs font-semibold text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider border-l border-[var(--ink-line)] pl-6" href="/">
                            ← Back to Site
                        </Link>
                        <HelpTriggerButton className="w-8 h-8 flex items-center justify-center hover:bg-[var(--mustard-gold)]/10 text-[var(--deep-teal)]/80 hover:text-[var(--mustard-gold)] transition-colors rounded-full" />
                        <div className="w-8 h-8 border border-[var(--mustard-gold)] flex items-center justify-center rounded-full">
                            <span className="material-symbols-outlined text-sm text-[var(--mustard-gold)]">school</span>
                        </div>
                        <ThemeSwitcher />
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-screen-2xl mx-auto w-full p-6 lg:p-12">
                {children}
            </main>
        </div>
    );
}
