'use client';

import { useState } from 'react';
import { saveTranslations } from '@/app/actions/translations';
import { useRouter } from 'next/navigation';

export default function TranslationsClient({ initialEn, initialAr }: { initialEn: any, initialAr: any }) {
    const [en, setEn] = useState(initialEn);
    const [ar, setAr] = useState(initialAr);
    const [saving, setSaving] = useState(false);

    // Assume 1 level of nesting: { Category: { key: "value" } }
    const categories = Object.keys(en);
    const [activeCategory, setActiveCategory] = useState(categories[0] || '');

    const router = useRouter();

    const handleSave = async () => {
        setSaving(true);
        const res = await saveTranslations(en, ar);
        setSaving(false);
        if (res.success) {
            alert('Translations saved successfully!');
            router.refresh(); // Refresh the page to reflect any server-side changes
        } else {
            alert('Error saving translations: ' + res.error);
        }
    };

    const handleUpdate = (lang: 'en' | 'ar', category: string, key: string, value: string) => {
        if (lang === 'en') {
            setEn((prev: any) => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
        } else {
            setAr((prev: any) => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
        }
    };

    return (
        <div className="tracing-paper p-8 rounded-lg shadow-sm border border-[var(--ink-line)] relative overflow-hidden bg-[var(--card-bg)]">
            <div className="flex justify-between items-end mb-8 border-b border-[var(--ink-line)] pb-4">
                <div>
                    <h1 className="text-3xl font-black uppercase text-[var(--deep-teal)] tracking-tight">Translation Manager</h1>
                    <p className="text-sm text-[var(--paper-plane-grey)] mt-1">Manage English and Arabic UI strings.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="chalk-btn px-6 py-2 bg-[var(--mustard-gold)] text-[var(--drafting-white)] font-bold uppercase tracking-wider text-sm hover:opacity-90 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Categories */}
                <div className="w-full md:w-1/4 border-r border-[var(--ink-line)] pr-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--paper-plane-grey)] mb-4">Categories</h3>
                    <div className="flex flex-col gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider chalk-border transition-colors ${activeCategory === cat ? 'bg-[var(--deep-teal)] text-[var(--drafting-white)]' : 'hover:bg-[var(--deep-teal)]/5 text-[var(--deep-teal)]'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor Content */}
                <div className="w-full md:w-3/4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--paper-plane-grey)] mb-6">{activeCategory} Strings</h3>

                    {activeCategory && en[activeCategory] && Object.keys(en[activeCategory]).map(key => (
                        <div key={key} className="mb-8 pb-8 border-b border-[var(--ink-line)] border-dashed last:border-0 last:pb-0 last:mb-0">
                            <label className="block text-sm font-bold text-[var(--deep-teal)] mb-4 font-mono bg-[var(--deep-teal)]/5 inline-block px-2 py-1 chalk-border">
                                {key}
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* EN Input */}
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-2 block">English (EN)</span>
                                    <textarea
                                        value={en[activeCategory][key]}
                                        onChange={(e) => handleUpdate('en', activeCategory, key, e.target.value)}
                                        className="w-full bg-transparent border border-[var(--ink-line)] p-4 text-sm font-medium focus:outline-none focus:border-[var(--mustard-gold)] focus:ring-1 focus:ring-[var(--mustard-gold)]/20 transition-all h-32 chalk-border"
                                    />
                                </div>

                                {/* AR Input */}
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] mb-2 block">Arabic (AR)</span>
                                    <textarea
                                        dir="rtl"
                                        value={ar[activeCategory] ? ar[activeCategory][key] || '' : ''}
                                        onChange={(e) => handleUpdate('ar', activeCategory, key, e.target.value)}
                                        className="w-full bg-transparent border border-[var(--ink-line)] p-4 text-sm focus:outline-none focus:border-[var(--deep-teal)] focus:ring-1 focus:ring-[var(--deep-teal)]/20 transition-all h-32 chalk-border font-cairo"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
