'use client';

import { useState } from 'react';

type TranslationEntry = {
    key: string;
    en: string;
    ar: string;
    section: string;
};

const defaultTranslations: TranslationEntry[] = [
    // Navigation
    { key: 'nav.explore', en: 'Explore', ar: 'استكشف', section: 'Navigation' },
    { key: 'nav.firms', en: 'Firms', ar: 'الشركات', section: 'Navigation' },
    { key: 'nav.archive', en: 'Archive', ar: 'الأرشيف', section: 'Navigation' },
    { key: 'nav.awards', en: 'Awards', ar: 'الجوائز', section: 'Navigation' },
    { key: 'nav.about', en: 'About', ar: 'حول', section: 'Navigation' },
    { key: 'nav.help', en: 'Help', ar: 'مساعدة', section: 'Navigation' },
    // Homepage
    { key: 'home.hero.title', en: 'Built Environment', ar: 'البيئة المبنية', section: 'Homepage' },
    { key: 'home.hero.subtitle', en: 'A specialized repository of high-performance architectural case studies and structural engineering breakthroughs.', ar: 'منصة متخصصة لدراسات الحالة المعمارية والهندسية المتطورة.', section: 'Homepage' },
    { key: 'home.hero.cta', en: 'View Technical Work', ar: 'عرض الأعمال الفنية', section: 'Homepage' },
    { key: 'home.stats.projects', en: 'Projects', ar: 'مشاريع', section: 'Homepage' },
    { key: 'home.stats.authors', en: 'Authors', ar: 'مؤلفون', section: 'Homepage' },
    { key: 'home.stats.countries', en: 'Countries', ar: 'دول', section: 'Homepage' },
    { key: 'home.workflow.title', en: 'How It Works', ar: 'كيف يعمل', section: 'Homepage' },
    { key: 'home.workflow.submit', en: 'Submit', ar: 'إرسال', section: 'Homepage' },
    { key: 'home.workflow.review', en: 'Review', ar: 'مراجعة', section: 'Homepage' },
    { key: 'home.workflow.publish', en: 'Publish', ar: 'نشر', section: 'Homepage' },
    { key: 'home.portfolio.title', en: 'Engineering Portfolio', ar: 'المحفظة الهندسية', section: 'Homepage' },
    { key: 'home.cta.title', en: 'Ready to Contribute?', ar: 'هل أنت مستعد للمساهمة؟', section: 'Homepage' },
    // Explore
    { key: 'explore.title', en: 'Explore Architecture', ar: 'استكشف الهندسة المعمارية', section: 'Explore' },
    { key: 'explore.filters', en: 'Filters', ar: 'تصفية', section: 'Explore' },
    { key: 'explore.search', en: 'Search Query', ar: 'بحث', section: 'Explore' },
    { key: 'explore.sort', en: 'Sort By', ar: 'ترتيب حسب', section: 'Explore' },
    { key: 'explore.grid', en: 'Grid', ar: 'شبكة', section: 'Explore' },
    { key: 'explore.map', en: 'Map', ar: 'خريطة', section: 'Explore' },
    // Firms
    { key: 'firms.title', en: 'Architectural Firms', ar: 'شركات الهندسة المعمارية', section: 'Firms' },
    { key: 'firms.registered', en: 'Registered Studios', ar: 'استوديوهات مسجلة', section: 'Firms' },
    { key: 'firms.projects', en: 'Verified Projects', ar: 'مشاريع موثقة', section: 'Firms' },
    // Awards
    { key: 'awards.title', en: 'Awards & Recognition', ar: 'الجوائز والتقدير', section: 'Awards' },
    { key: 'awards.grand', en: 'Grand Prize', ar: 'الجائزة الكبرى', section: 'Awards' },
    // Common
    { key: 'common.submit_project', en: 'Submit a Project', ar: 'أرسل مشروعاً', section: 'Common' },
    { key: 'common.browse_archive', en: 'Browse Archive', ar: 'تصفح الأرشيف', section: 'Common' },
    { key: 'common.view_all', en: 'View All', ar: 'عرض الكل', section: 'Common' },
    { key: 'common.back', en: 'Back', ar: 'رجوع', section: 'Common' },
    { key: 'common.verified', en: 'Verified', ar: 'موثق', section: 'Common' },
    { key: 'common.pending', en: 'Pending', ar: 'قيد الانتظار', section: 'Common' },
    { key: 'common.approved', en: 'Approved', ar: 'مقبول', section: 'Common' },
    { key: 'common.rejected', en: 'Rejected', ar: 'مرفوض', section: 'Common' },
    // Footer
    { key: 'footer.tagline', en: 'Empowering architects and engineers through professional case study documentation.', ar: 'تمكين المهندسين المعماريين والمهندسين من خلال توثيق دراسات الحالة المهنية.', section: 'Footer' },
    { key: 'footer.newsletter', en: 'Weekly Technical Briefing', ar: 'النشرة التقنية الأسبوعية', section: 'Footer' },
    { key: 'footer.copyright', en: 'Archiving the Built Environment', ar: 'أرشفة البيئة المبنية', section: 'Footer' },
];

export default function LocalizationPage() {
    const [translations, setTranslations] = useState(defaultTranslations);
    const [filterSection, setFilterSection] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ en: string; ar: string }>({ en: '', ar: '' });
    const [saved, setSaved] = useState(false);

    const sections = [...new Set(translations.map(t => t.section))];

    const filtered = translations.filter(t => {
        const matchSection = !filterSection || t.section === filterSection;
        const matchSearch = !searchKey || t.key.toLowerCase().includes(searchKey.toLowerCase()) || t.en.toLowerCase().includes(searchKey.toLowerCase()) || t.ar.includes(searchKey);
        return matchSection && matchSearch;
    });

    const startEdit = (t: TranslationEntry) => {
        setEditingKey(t.key);
        setEditValues({ en: t.en, ar: t.ar });
    };

    const saveEdit = () => {
        if (!editingKey) return;
        setTranslations(prev => prev.map(t =>
            t.key === editingKey ? { ...t, en: editValues.en, ar: editValues.ar } : t
        ));
        setEditingKey(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const cancelEdit = () => {
        setEditingKey(null);
    };

    const completionRate = Math.round((translations.filter(t => t.ar.trim() !== '').length / translations.length) * 100);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--deep-teal)] tracking-tight">Localization Manager</h1>
                    <p className="text-sm text-[var(--paper-plane-grey)] mt-1">Manage translations for English and Arabic across all platform sections.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="text-xs text-[var(--electric-teal)] font-bold uppercase tracking-widest animate-[fadeInUp_0.3s_ease] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Saved
                        </span>
                    )}
                    <div className="text-center bg-[var(--card-bg)] border border-[var(--ink-line)] px-4 py-2">
                        <p className="text-2xl font-black text-[var(--electric-teal)]">{completionRate}%</p>
                        <p className="text-[9px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Arabic Complete</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 text-center">
                    <p className="text-3xl font-black text-[var(--deep-teal)]">{translations.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Total Keys</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 text-center">
                    <p className="text-3xl font-black text-[var(--electric-teal)]">{sections.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Sections</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 text-center">
                    <p className="text-3xl font-black text-[var(--mustard-gold)]">{translations.filter(t => t.ar.trim() !== '').length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Translated</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 text-center">
                    <p className="text-3xl font-black text-red-500">{translations.filter(t => t.ar.trim() === '').length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Missing</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[var(--paper-plane-grey)] text-sm">search</span>
                        <input
                            type="text"
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                            placeholder="Search by key or text..."
                            className="w-full bg-[var(--card-bg)] border border-[var(--ink-line)] pl-9 pr-4 py-2 text-sm text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)]"
                        />
                    </div>
                </div>
                <select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="bg-[var(--card-bg)] border border-[var(--ink-line)] px-4 py-2 text-sm text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)]"
                >
                    <option value="">All Sections</option>
                    {sections.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Translation Table */}
            <div className="overflow-x-auto">
                <table className="w-full bg-[var(--card-bg)] border border-[var(--ink-line)]">
                    <thead>
                        <tr className="border-b border-[var(--ink-line)]">
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Key</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Section</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">🇺🇸 English</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">🇸🇦 Arabic</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--ink-line)]">
                        {filtered.map(t => (
                            <tr key={t.key} className={`hover:bg-[var(--platinum-sheen)]/10 transition-colors ${editingKey === t.key ? 'bg-[var(--deep-teal)]/5' : ''}`}>
                                <td className="px-4 py-3 text-xs font-mono text-[var(--electric-teal)]">{t.key}</td>
                                <td className="px-4 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] border border-[var(--ink-line)] px-2 py-0.5">
                                        {t.section}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {editingKey === t.key ? (
                                        <input
                                            value={editValues.en}
                                            onChange={(e) => setEditValues({ ...editValues, en: e.target.value })}
                                            className="w-full bg-transparent border-b border-[var(--electric-teal)] py-1 text-sm text-[var(--deep-teal)] focus:outline-none"
                                        />
                                    ) : (
                                        <span className="text-sm text-[var(--deep-teal)]">{t.en}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3" dir="rtl">
                                    {editingKey === t.key ? (
                                        <input
                                            value={editValues.ar}
                                            onChange={(e) => setEditValues({ ...editValues, ar: e.target.value })}
                                            className="w-full bg-transparent border-b border-[var(--electric-teal)] py-1 text-sm text-[var(--deep-teal)] focus:outline-none text-right"
                                            dir="rtl"
                                        />
                                    ) : (
                                        <span className={`text-sm ${t.ar ? 'text-[var(--deep-teal)]' : 'text-red-400 italic'}`}>
                                            {t.ar || 'Missing translation'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {editingKey === t.key ? (
                                        <div className="flex gap-1 justify-center">
                                            <button onClick={saveEdit} className="text-[var(--electric-teal)] hover:text-[var(--deep-teal)]">
                                                <span className="material-symbols-outlined text-sm">check</span>
                                            </button>
                                            <button onClick={cancelEdit} className="text-red-400 hover:text-red-600">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => startEdit(t)} className="text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)]">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 border border-dashed border-[var(--ink-line)]">
                    <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] opacity-30 mb-2 block">translate</span>
                    <p className="text-sm text-[var(--paper-plane-grey)]">No translations match your filters.</p>
                </div>
            )}
        </div>
    );
}
