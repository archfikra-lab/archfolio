'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/* Combined T-Square + Drafting Triangle icon for Blueprint theme */
function TSquareTriangleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} width="18" height="18">
            {/* T-Square — horizontal blade */}
            <rect x="1" y="2" width="22" height="3" rx="0.5" />
            {/* T-Square — vertical stock */}
            <rect x="5" y="5" width="3" height="12" rx="0.5" />
            {/* Drafting Triangle */}
            <polygon points="10,20 22,20 10,10" />
            {/* Triangle cutout hole */}
            <circle cx="14" cy="17.5" r="1.2" />
        </svg>
    );
}

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center chalk-border bg-[var(--card-bg)] p-1 opacity-50 hand-drawn-card">
                <button className="p-1.5 flex items-center justify-center text-[var(--paper-plane-grey)]" title="Light Theme">
                    <span className="material-symbols-outlined text-lg">light_mode</span>
                </button>
                <button className="p-1.5 flex items-center justify-center text-[var(--paper-plane-grey)]" title="Dark Theme">
                    <span className="material-symbols-outlined text-lg">dark_mode</span>
                </button>
                <button className="p-1.5 flex items-center justify-center text-[var(--paper-plane-grey)]" title="Blueprint Theme">
                    <TSquareTriangleIcon />
                </button>
                <button className="p-1.5 flex items-center justify-center text-[var(--paper-plane-grey)]" title="Green Theme">
                    <span className="material-symbols-outlined text-lg">eco</span>
                </button>
            </div>
        );
    }

    const activeClass = 'bg-[var(--mustard-gold)] text-[var(--midnight-charcoal)] shadow-sm chalk-border';
    const inactiveClass = 'text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)]';

    return (
        <div className="flex items-center chalk-border tracing-paper p-1 transition-colors hand-drawn-card">
            <button
                onClick={() => setTheme('light')}
                className={`p-1.5 flex items-center justify-center transition-all hover-lift ${theme === 'light' ? activeClass : inactiveClass}`}
                title="Light Theme"
            >
                <span className="material-symbols-outlined text-lg">light_mode</span>
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 flex items-center justify-center transition-all hover-lift ${theme === 'dark' ? activeClass : inactiveClass}`}
                title="Dark Theme"
            >
                <span className="material-symbols-outlined text-lg">dark_mode</span>
            </button>
            <button
                onClick={() => setTheme('blueprint')}
                className={`p-1.5 flex items-center justify-center transition-all hover-lift ${theme === 'blueprint' ? activeClass : inactiveClass}`}
                title="Blueprint Theme"
            >
                <TSquareTriangleIcon />
            </button>
            <button
                onClick={() => setTheme('green')}
                className={`p-1.5 flex items-center justify-center transition-all hover-lift ${theme === 'green' ? 'bg-[#21c488] text-white shadow-sm chalk-border' : inactiveClass}`}
                title="Green Theme"
            >
                <span className="material-symbols-outlined text-lg">eco</span>
            </button>
        </div>
    );
}
