'use client';

import { useState } from 'react';
import { seedDemoData } from '@/app/actions/seedActions';

export default function SeedButton() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleSeed = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await seedDemoData();
            if (res.success) {
                setResult(`✅ Seeded ${res.partners} partners, ${res.donors} donors, ${res.ads} ads`);
            } else {
                setResult(`❌ ${res.error}`);
            }
        } catch (e: any) {
            setResult(`❌ ${e.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleSeed}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--deep-teal)] text-[var(--drafting-white)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--mustard-gold)] transition-colors disabled:opacity-50"
            >
                <span className="material-symbols-outlined text-sm">{loading ? 'sync' : 'database'}</span>
                {loading ? 'Seeding...' : 'Seed Demo Data'}
            </button>
            {result && (
                <span className="text-xs text-[var(--paper-plane-grey)] animate-fadeInUp">{result}</span>
            )}
        </div>
    );
}
