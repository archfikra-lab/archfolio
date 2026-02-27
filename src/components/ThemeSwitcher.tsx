'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center border border-[var(--light-ink-line)] bg-[var(--platinum-sheen)] rounded-full p-1 opacity-50">
                <button className="p-1.5 flex items-center justify-center text-[var(--paper-plane-grey)]" title="Light Theme">
                    <span className="material-symbols-outlined text-lg">light_mode</span>
                </button>
                <button className="p-1.5 flex items-center justify-center text-[var(--paper-plane-grey)]" title="Dark Theme">
                    <span className="material-symbols-outlined text-lg">dark_mode</span>
                </button>
                <button className="p-1.5 flex items-center justify-center text-[var(--paper-plane-grey)]" title="Blueprint Theme">
                    <span className="material-symbols-outlined text-lg">architecture</span>
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center border border-[var(--light-ink-line)] bg-[var(--card-bg)] rounded-full p-1 transition-colors">
            <button
                onClick={() => setTheme('light')}
                className={`p-1.5 flex items-center justify-center rounded-full transition-all ${theme === 'light'
                    ? 'bg-[var(--mustard-gold)] text-[var(--midnight-charcoal)] shadow-sm'
                    : 'text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)]'
                    }`}
                title="Light Theme"
            >
                <span className="material-symbols-outlined text-lg">light_mode</span>
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 flex items-center justify-center rounded-full transition-all ${theme === 'dark'
                    ? 'bg-[var(--mustard-gold)] text-[var(--midnight-charcoal)] shadow-sm'
                    : 'text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)]'
                    }`}
                title="Dark Theme"
            >
                <span className="material-symbols-outlined text-lg">dark_mode</span>
            </button>
            <button
                onClick={() => setTheme('blueprint')}
                className={`p-1.5 flex items-center justify-center rounded-full transition-all ${theme === 'blueprint'
                    ? 'bg-[var(--mustard-gold)] text-[var(--midnight-charcoal)] shadow-sm'
                    : 'text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)]'
                    }`}
                title="Blueprint Theme"
            >
                <span className="material-symbols-outlined text-lg">architecture</span>
            </button>
        </div>
    );
}
