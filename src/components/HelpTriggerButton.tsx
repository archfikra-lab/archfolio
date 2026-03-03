'use client';

export default function HelpTriggerButton({ className = "w-8 h-8 flex items-center justify-center hover:bg-[var(--mustard-gold)]/10 text-[var(--deep-teal)]/80 hover:text-[var(--mustard-gold)] transition-colors rounded-full" }: { className?: string }) {
    return (
        <button
            onClick={() => window.dispatchEvent(new Event('open-help-overlay'))}
            className={className}
            title="Help Center"
        >
            <span className="material-symbols-outlined text-sm">help</span>
        </button>
    );
}
