import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

export default function AcademicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--midnight-charcoal)]">
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
                </div>
            </header>
            <main className="flex-1 max-w-screen-2xl mx-auto w-full p-6 lg:p-12">
                {children}
            </main>
        </div>
    );
}
