'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NotificationBell from "@/components/NotificationBell";

const navLinksBase = [
    { path: "/explore", label: "Explore", arabic: "استكشف", icon: "search" },
    { path: "/firms", label: "Firms", arabic: "الشركات", icon: "business" },
    { path: "/archive", label: "Archive", arabic: "الأرشيف", icon: "inventory_2" },
    { path: "/awards", label: "Awards", arabic: "الجوائز", icon: "emoji_events" },
    { path: "/about", label: "About", arabic: "حول", icon: "info" },
    { path: "/help", label: "Help", arabic: "مساعدة", icon: "help_outline" },
];

const portalLinksBase = [
    { path: "/admin", label: "Admin Panel", arabic: "لوحة الإدارة", icon: "admin_panel_settings" },
    { path: "/author", label: "Author Studio", arabic: "استوديو المؤلف", icon: "edit_note" },
    { path: "/expert", label: "Expert Review", arabic: "مراجعة الخبير", icon: "rate_review" },
    { path: "/academic", label: "Academic", arabic: "أكاديمي", icon: "school" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
    const isArabic = locale === 'ar';

    const navLinks = navLinksBase.map(l => ({ ...l, href: `/${locale}${l.path}` }));
    const portalLinks = portalLinksBase.map(l => ({ ...l, href: `/${locale}${l.path}` }));

    return (
        <>
            {/* Top Ad Bar */}
            <div className="w-full bg-[var(--platinum-sheen)] border-b border-[var(--ink-line)] overflow-hidden relative">
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-3 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--paper-plane-grey)] border border-[var(--paper-plane-grey)] px-2 py-0.5">
                            Platinum Partner
                        </span>
                        <p className="text-xs tracking-tight text-[var(--deep-teal)] font-medium hidden sm:block">
                            <span className="opacity-60 italic">Cinematic Series:</span> High-performance glazing solutions for the modern facade.
                        </p>
                    </div>
                    <Link
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--deep-teal)] flex items-center gap-2 hover:text-[var(--mustard-gold)] transition-colors"
                        href="#"
                    >
                        <span className="hidden sm:inline">TECHNICAL SPECS [P-04]</span>
                        <span className="material-symbols-outlined text-sm">architecture</span>
                    </Link>
                </div>
                <div className="absolute bottom-0 left-0 w-full technical-line opacity-20"></div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-50 tracing-paper backdrop-blur-md border-b border-[var(--ink-line)] px-6 lg:px-12 py-4 frayed-edge">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    {/* Left: Logo + Desktop Nav */}
                    <div className="flex items-center gap-10">
                        <Link href="/en" className="flex flex-col hover:opacity-80 transition-opacity">
                            <div className="flex flex-col">
                                <Image src="/app-logo.png" alt="Archfolio Logo" width={150} height={50} className="w-auto h-12 object-contain" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--paper-plane-grey)] ml-9 mt-1">
                                Technical Archive // Fikra
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden xl:flex items-center gap-8">
                            {navLinks.slice(0, 4).map((link) => (
                                <Link
                                    key={link.href}
                                    className="text-sm font-semibold text-[var(--deep-teal)]/80 hover:text-[var(--mustard-gold)] transition-colors uppercase tracking-wider border-b border-transparent hover:border-[var(--mustard-gold)] pb-1"
                                    href={link.href}
                                >
                                    {isArabic ? link.arabic : link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right: Search + Actions + Theme + Profile + Mobile */}
                    <div className="flex items-center gap-4">
                        {/* Theme & Language Switcher */}
                        <ThemeSwitcher />
                        <LanguageSwitcher />

                        {/* Search */}
                        <div className="hidden lg:flex items-center border border-[var(--ink-line)] px-4 py-1.5 tracing-paper rounded-sm">
                            <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-xl">search</span>
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm w-40 placeholder:text-[var(--paper-plane-grey)] text-[var(--deep-teal)] focus:outline-none"
                                placeholder={isArabic ? 'البحث في المخططات...' : 'Search blueprints...'}
                                type="text"
                            />
                        </div>

                        {/* Notifications */}
                        <NotificationBell />

                        {/* Submit CTA */}
                        <Link
                            href={`/${locale}/author`}
                            className="hidden md:flex bg-[var(--mustard-gold)] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-all items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">edit_square</span>
                            {isArabic ? 'إرسال مسودة' : 'Submit Draft'}
                        </Link>

                        {/* Profile */}
                        <Link href="/en/login" className="w-10 h-10 border border-[var(--ink-line)] p-0.5 hidden md:block">
                            <div className="w-full h-full bg-[var(--platinum-sheen)] flex items-center justify-center">
                                <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-xl">person</span>
                            </div>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="xl:hidden text-[var(--deep-teal)] hover:text-[var(--mustard-gold)] transition-colors p-1"
                            aria-label="Toggle navigation menu"
                        >
                            <span className="material-symbols-outlined text-3xl">
                                {mobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile / Tablet Menu */}
                {mobileMenuOpen && (
                    <div className="xl:hidden mt-4 border-t border-[var(--ink-line)] pt-6 pb-4 animate-[fadeInUp_0.3s_ease]">
                        <div className="max-w-screen-2xl mx-auto">
                            {/* Mobile Search */}
                            <div className="lg:hidden flex items-center border border-[var(--ink-line)] px-4 py-2 mb-6 tracing-paper">
                                <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-xl">search</span>
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[var(--paper-plane-grey)] text-[var(--deep-teal)] focus:outline-none"
                                    placeholder="Search blueprints..."
                                    type="text"
                                />
                            </div>

                            {/* Nav Links */}
                            <div className="mb-6">
                                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--paper-plane-grey)] block mb-4">{isArabic ? 'التنقل' : 'Navigation'}</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-3 hand-drawn-card hover:border-[var(--mustard-gold)] transition-all group"
                                        >
                                            <span className="material-symbols-outlined text-[var(--paper-plane-grey)] group-hover:text-[var(--mustard-gold)] text-xl transition-colors">{link.icon}</span>
                                            <div>
                                                <span className="text-sm font-bold uppercase tracking-wider text-[var(--deep-teal)] block">{isArabic ? link.arabic : link.label}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Portal Links */}
                            <div className="mb-6">
                                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--paper-plane-grey)] block mb-4">{isArabic ? 'البوابات' : 'Portals'}</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {portalLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-3 border border-[var(--ink-line)] bg-[var(--platinum-sheen)] hover:border-[var(--mustard-gold)] transition-all group"
                                        >
                                            <span className="material-symbols-outlined text-[var(--mustard-gold)] text-xl">{link.icon}</span>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--deep-teal)]">{isArabic ? (link as any).arabic : link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Actions */}
                            <div className="flex gap-3">
                                <Link
                                    href={`/${locale}/author`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 bg-[var(--mustard-gold)] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">edit_square</span>
                                    {isArabic ? 'إرسال مسودة' : 'Submit Draft'}
                                </Link>
                                <Link
                                    href={`/${locale}/login`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 border-2 border-[var(--deep-teal)] text-[var(--deep-teal)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
