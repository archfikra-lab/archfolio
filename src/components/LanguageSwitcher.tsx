'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    // Detect current locale from pathname
    const currentLocale = pathname.startsWith('/ar') ? 'ar' : 'en';

    const switchLocale = (newLocale: string) => {
        if (newLocale === currentLocale) return;

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
    };

    const toggleLanguage = () => {
        switchLocale(currentLocale === 'en' ? 'ar' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center justify-center min-w-[50px] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors chalk-border hover:bg-[var(--mustard-gold)]/5"
            aria-label="Switch language"
        >
            {currentLocale === 'en' ? 'عربي' : 'EN'}
        </button>
    );
}
