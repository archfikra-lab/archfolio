'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Detect current locale from pathname
    const currentLocale = pathname.startsWith('/ar') ? 'ar' : 'en';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const switchLocale = (newLocale: string) => {
        if (newLocale === currentLocale) { setIsOpen(false); return; }

        // Replace the locale prefix in the pathname
        let newPath: string;
        if (pathname.startsWith('/en')) {
            newPath = pathname.replace(/^\/en/, `/${newLocale}`);
        } else if (pathname.startsWith('/ar')) {
            newPath = pathname.replace(/^\/ar/, `/${newLocale}`);
        } else {
            newPath = `/${newLocale}${pathname}`;
        }

        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors border border-transparent hover:border-[var(--ink-line)]"
                aria-label="Switch language"
            >
                <span className="material-symbols-outlined text-sm">translate</span>
                {currentLocale === 'en' ? 'EN' : 'عربي'}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[var(--card-bg)] border border-[var(--ink-line)] shadow-lg z-50 min-w-[120px] animate-[fadeIn_0.15s_ease]">
                    <button
                        onClick={() => switchLocale('en')}
                        className={`w-full px-4 py-2.5 text-left text-xs font-bold tracking-widest flex items-center gap-2 transition-colors ${currentLocale === 'en'
                            ? 'text-[var(--electric-teal)] bg-[var(--platinum-sheen)]/50'
                            : 'text-[var(--deep-teal)] hover:bg-[var(--platinum-sheen)]/30'
                            }`}
                    >
                        🇺🇸 English
                    </button>
                    <div className="h-px bg-[var(--ink-line)]" />
                    <button
                        onClick={() => switchLocale('ar')}
                        className={`w-full px-4 py-2.5 text-left text-xs font-bold tracking-widest flex items-center gap-2 transition-colors ${currentLocale === 'ar'
                            ? 'text-[var(--electric-teal)] bg-[var(--platinum-sheen)]/50'
                            : 'text-[var(--deep-teal)] hover:bg-[var(--platinum-sheen)]/30'
                            }`}
                    >
                        🇸🇦 العربية
                    </button>
                </div>
            )}
        </div>
    );
}
