'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

// Dynamically import map to avoid SSR issues with window object in Leaflet
const ProjectMap = dynamic(() => import('@/components/ProjectMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full bg-[var(--platinum-sheen)]/10 animate-pulse flex items-center justify-center border border-[var(--ink-line)]">
            <span className="text-[var(--paper-plane-grey)] font-bold tracking-widest uppercase text-sm">Organizing Cartography...</span>
        </div>
    )
});

type Project = {
    id: string;
    title: string;
    location: string;
    typology: string;
    latitude: number | null;
    longitude: number | null;
    shortDescription: string | null;
    architecturalStyle: string | null;
    year: number | null;
    attachments?: { id: string; url: string; type: string; description?: string | null }[];
};

export default function ExploreClient({ initialProjects }: { initialProjects: Project[] }) {
    const t = useTranslations('Explore');
    const tData = useTranslations('Data');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypology, setSelectedTypology] = useState<string>('');
    const [selectedStyle, setSelectedStyle] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('newest');

    // Comparison State
    const [compareIds, setCompareIds] = useState<string[]>([]);

    // Extract unique values for filters
    const typologies = useMemo(() => Array.from(new Set(initialProjects.map(p => p.typology))).filter(Boolean).sort(), [initialProjects]);
    const styles = useMemo(() => Array.from(new Set(initialProjects.map(p => p.architecturalStyle))).filter(Boolean).sort(), [initialProjects]);

    // Apply filters and sort
    const filteredProjects = useMemo(() => {
        let result = initialProjects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTypology = selectedTypology === '' || project.typology === selectedTypology;
            const matchesStyle = selectedStyle === '' || project.architecturalStyle === selectedStyle;
            return matchesSearch && matchesTypology && matchesStyle;
        });
        // Apply sorting
        switch (sortBy) {
            case 'oldest':
                result = [...result].reverse();
                break;
            case 'az':
                result = [...result].sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'za':
                result = [...result].sort((a, b) => b.title.localeCompare(a.title));
                break;
            default: // newest — already sorted by createdAt desc from server
                break;
        }
        return result;
    }, [initialProjects, searchQuery, selectedTypology, selectedStyle, sortBy]);

    const handleCompareToggle = (id: string) => {
        setCompareIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-1/4 space-y-6">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                    <h2 className="text-md font-bold text-[var(--deep-teal)] uppercase tracking-widest mb-4 border-b border-[var(--ink-line)] pb-2 flex items-center justify-between">
                        {t('filters')}
                        <span className="material-symbols-outlined text-[var(--electric-teal)] text-sm">tune</span>
                    </h2>

                    <div className="space-y-4">
                        {/* Status / View Toggle */}
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] tracking-widest mb-2">{t('presentationMode')}</label>
                            <div className="flex bg-[var(--platinum-sheen)]/10 p-1 border border-[var(--ink-line)]">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${viewMode === 'grid' ? 'bg-[var(--deep-teal)] text-white' : 'text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)]'}`}
                                >
                                    {t('grid')}
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${viewMode === 'map' ? 'bg-[var(--deep-teal)] text-white' : 'text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)]'}`}
                                >
                                    {t('map')}
                                </button>
                            </div>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] tracking-widest mb-2">{t('searchQuery')}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('searchPlaceholder')}
                                    className="w-full bg-transparent border-b border-[var(--ink-line)] py-2 text-sm text-[var(--deep-teal)] placeholder-[var(--paper-plane-grey)]/50 focus:outline-none focus:border-[var(--electric-teal)] transition-colors pr-8"
                                />
                                <span className="material-symbols-outlined absolute right-2 top-2 text-[var(--paper-plane-grey)] text-sm">search</span>
                            </div>
                        </div>

                        {/* Typology */}
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] tracking-widest mb-2">{t('typology')}</label>
                            <select
                                value={selectedTypology}
                                onChange={(e) => setSelectedTypology(e.target.value)}
                                className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] appearance-none rounded-none cursor-pointer"
                            >
                                <option value="">{t('allTypologies')}</option>
                                {typologies.map((tOp, i) => (
                                    <option key={i} value={tOp as string}>{tData.has(`Typology.${tOp}` as any) ? tData(`Typology.${tOp}` as any) : tOp}</option>
                                ))}
                            </select>
                        </div>

                        {/* Style */}
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] tracking-widest mb-2">{t('architecturalStyle')}</label>
                            <select
                                value={selectedStyle}
                                onChange={(e) => setSelectedStyle(e.target.value)}
                                className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] appearance-none rounded-none cursor-pointer"
                            >
                                <option value="">{t('allStyles')}</option>
                                {styles.map((s, i) => (
                                    <option key={i} value={s as string}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] tracking-widest mb-2">{t('sortBy')}</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] appearance-none rounded-none cursor-pointer"
                            >
                                <option value="newest">{t('newestFirst')}</option>
                                <option value="oldest">{t('oldestFirst')}</option>
                                <option value="az">{t('az')}</option>
                                <option value="za">{t('za')}</option>
                            </select>
                        </div>

                        {(searchQuery || selectedTypology || selectedStyle) && (
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedTypology(''); setSelectedStyle(''); setSortBy('newest'); }}
                                className="w-full text-center text-xs text-[var(--bright-rust)] hover:underline pt-2 tracking-widest uppercase font-bold"
                            >
                                {t('clearAllFilters')}
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:w-3/4 flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-[var(--paper-plane-grey)] tracking-widest uppercase">
                        {t('showing')} <span className="text-[var(--electric-teal)]">{filteredProjects.length}</span> {t('results')}
                    </p>
                    {compareIds.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--paper-plane-grey)] font-bold tracking-widest uppercase">{compareIds.length} {t('selected')}</span>
                            <Link
                                href={`/en/compare?ids=${compareIds.join(',')}`}
                                className={`px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] transition-colors ${compareIds.length > 1 ? 'bg-[var(--electric-teal)] text-black hover:bg-white' : 'bg-[var(--platinum-sheen)]/20 text-[var(--paper-plane-grey)] cursor-not-allowed'}`}
                                onClick={(e) => {
                                    if (compareIds.length < 2) e.preventDefault();
                                }}
                            >
                                {t('compareProjects')}
                            </Link>
                        </div>
                    )}
                </div>

                {viewMode === 'map' ? (
                    <ProjectMap projects={filteredProjects} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-0 card-grid">
                        {filteredProjects.map(project => (
                            <div key={project.id} className="group flex flex-col bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden hover:border-[var(--electric-teal)] transition-colors duration-300 hover-lift-dynamic chalk-border">
                                <Link href={`/en/project/${project.id}`} className="block h-56 bg-[var(--platinum-sheen)]/20 relative overflow-hidden flex-shrink-0">
                                    {(() => {
                                        const img = project.attachments?.find((a: any) => a.type === 'photo' || a.type?.startsWith('image'));
                                        return img?.url ? (
                                            <img src={img.url} alt={project.title} className="w-full h-full object-cover grayscale opacity-90 image-reveal" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[var(--paper-plane-grey)] opacity-50 relative tracing-paper">
                                                <div className="absolute inset-0 opacity-[0.06]"
                                                    style={{
                                                        backgroundImage: 'linear-gradient(var(--deep-teal) 1px, transparent 1px), linear-gradient(90deg, var(--deep-teal) 1px, transparent 1px)',
                                                        backgroundSize: '10px 10px'
                                                    }}>
                                                </div>
                                                <span className="material-symbols-outlined text-4xl relative z-10">architecture</span>
                                            </div>
                                        );
                                    })()}

                                    {/* Blueprint Overlay on Hover */}
                                    <div className="absolute inset-0 bg-[var(--deep-teal)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none tracing-paper" style={{ mixBlendMode: 'overlay' }}></div>

                                    <div className="absolute top-2 left-2 bg-[var(--deep-teal)] text-[var(--drafting-white)] text-[9px] uppercase tracking-widest px-2 py-1 flex items-center gap-1 shadow-sm">
                                        <span className="material-symbols-outlined text-[10px]">domain</span>
                                        {tData.has(`Typology.${project.typology}` as any) ? tData(`Typology.${project.typology}` as any) : project.typology}
                                    </div>
                                    <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                                        <label className="flex items-center justify-center p-1 bg-white/90 shadow-sm cursor-pointer hover:bg-[var(--electric-teal)] transition-colors group/check">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 cursor-pointer accent-[var(--deep-teal)]"
                                                checked={compareIds.includes(project.id)}
                                                onChange={() => handleCompareToggle(project.id)}
                                            />
                                        </label>
                                    </div>
                                    {project.year && (
                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] uppercase tracking-widest px-2 py-1 backdrop-blur-sm pointer-events-none">
                                            {t('est')} {project.year}
                                        </div>
                                    )}
                                </Link>
                                <div className="p-5 flex flex-col flex-grow hover-drawer-container">
                                    <h3 className="font-bold text-lg text-[var(--deep-teal)] leading-tight mb-1 group-hover:text-[var(--mustard-gold)] transition-colors line-clamp-2">
                                        <Link href={`/en/project/${project.id}`}>
                                            {project.title}
                                        </Link>
                                    </h3>
                                    <p className="text-xs text-[var(--paper-plane-grey)] mb-3 flex items-center gap-1 font-medium tracking-wide">
                                        <span className="material-symbols-outlined text-xs">location_on</span>
                                        {tData.has(`Location.${project.location}` as any) ? tData(`Location.${project.location}` as any) : project.location}
                                    </p>

                                    {/* Hover Drawer Content */}
                                    <div className="hover-drawer-content">
                                        <p className="text-sm text-[var(--deep-teal)]/80 line-clamp-3 mb-4">
                                            {project.shortDescription || t('noTechOverview')}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--ink-line)]">
                                        <div className="text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] text-[var(--mustard-gold)]">verified</span>
                                            {t('verifiedRecord')}
                                        </div>
                                        <Link href={`/en/project/${project.id}`} className="text-[10px] uppercase tracking-widest text-[var(--electric-teal)] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                            {t('viewDetails')}
                                            <span className="material-symbols-outlined text-[12px]">east</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredProjects.length === 0 && (
                    <div className="py-20 text-center border border-[var(--ink-line)] border-dashed bg-[var(--platinum-sheen)]/5">
                        <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] opacity-50 mb-3">search_off</span>
                        <h3 className="text-lg font-bold text-[var(--deep-teal)] mb-1">{t('noProjectsFound')}</h3>
                        <p className="text-sm text-[var(--paper-plane-grey)]">{t('tryAdjustingFilters')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
