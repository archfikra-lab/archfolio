'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Project = {
    id: string;
    title: string;
    location: string;
    typology: string;
    year: number;
    shortDescription: string | null;
    architecturalStyle: string | null;
    author?: { name: string | null } | null;
    attachments?: { id: string; url: string; type: string }[];
};

function getDecade(year: number): string {
    const d = Math.floor(year / 10) * 10;
    return `${d}s`;
}

export default function ArchiveClient({ initialProjects }: { initialProjects: Project[] }) {
    const [selectedDecade, setSelectedDecade] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const decades = useMemo(() => {
        const d = Array.from(new Set(initialProjects.map(p => getDecade(p.year)))).sort().reverse();
        return d;
    }, [initialProjects]);

    const filteredProjects = useMemo(() => {
        return initialProjects.filter(p => {
            const matchesDecade = selectedDecade === 'all' || getDecade(p.year) === selectedDecade;
            const matchesSearch = searchQuery === '' ||
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDecade && matchesSearch;
        });
    }, [initialProjects, selectedDecade, searchQuery]);

    // Group by decade
    const groupedProjects = useMemo(() => {
        const groups: Record<string, Project[]> = {};
        filteredProjects.forEach(p => {
            const decade = getDecade(p.year);
            if (!groups[decade]) groups[decade] = [];
            groups[decade].push(p);
        });
        return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
    }, [filteredProjects]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-1/5 space-y-6">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 tracing-paper">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper-plane-grey)] mb-4 border-b border-[var(--ink-line)] pb-2">
                        Filter by Era
                    </h3>

                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search archive..."
                                className="w-full bg-transparent border-b border-[var(--ink-line)] py-2 text-sm text-[var(--deep-teal)] placeholder-[var(--paper-plane-grey)]/50 focus:outline-none focus:border-[var(--electric-teal)] transition-colors pr-8"
                            />
                            <span className="material-symbols-outlined absolute right-1 top-2 text-[var(--paper-plane-grey)] text-sm">search</span>
                        </div>
                    </div>

                    {/* Decade Buttons */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setSelectedDecade('all')}
                            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all ${selectedDecade === 'all'
                                ? 'bg-[var(--deep-teal)] text-[var(--drafting-white)]'
                                : 'text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] hover:bg-[var(--platinum-sheen)]/20'
                                }`}
                        >
                            All Eras ({initialProjects.length})
                        </button>
                        {decades.map(decade => {
                            const count = initialProjects.filter(p => getDecade(p.year) === decade).length;
                            return (
                                <button
                                    key={decade}
                                    onClick={() => setSelectedDecade(decade)}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-between ${selectedDecade === decade
                                        ? 'bg-[var(--deep-teal)] text-[var(--drafting-white)]'
                                        : 'text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] hover:bg-[var(--platinum-sheen)]/20'
                                        }`}
                                >
                                    <span>{decade}</span>
                                    <span className={`text-[10px] ${selectedDecade === decade ? 'text-[var(--drafting-white)]/70' : 'text-[var(--paper-plane-grey)]/60'}`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Stats */}
                    <div className="mt-6 pt-4 border-t border-[var(--ink-line)] space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)]">Total Archived</span>
                            <span className="text-lg font-light text-[var(--deep-teal)]">{initialProjects.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)]">Eras Covered</span>
                            <span className="text-lg font-light text-[var(--deep-teal)]">{decades.length}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-4/5">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm font-bold text-[var(--paper-plane-grey)] tracking-widest uppercase">
                        <span className="text-[var(--electric-teal)]">{filteredProjects.length}</span> Records Found
                    </p>
                </div>

                {groupedProjects.length > 0 ? groupedProjects.map(([decade, projects]) => (
                    <div key={decade} className="mb-12">
                        {/* Decade Header */}
                        <div className="flex items-center gap-6 mb-6">
                            <h2 className="text-5xl font-light text-[var(--mustard-gold)] tracking-tighter">{decade}</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-[var(--mustard-gold)]/40 to-transparent"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">
                                {projects.length} {projects.length === 1 ? 'entry' : 'entries'}
                            </span>
                        </div>

                        {/* Timeline List */}
                        <div className="space-y-4">
                            {projects.map((project, idx) => {
                                const img = project.attachments?.find((a: any) => a.type === 'photo' || a.type?.startsWith('image'));
                                return (
                                    <Link
                                        key={project.id}
                                        href={`/en/project/${project.id}`}
                                        className="group flex gap-6 p-5 bg-[var(--card-bg)] border border-[var(--ink-line)] hover:border-[var(--electric-teal)] transition-all hand-drawn-card"
                                    >
                                        {/* Year Badge */}
                                        <div className="flex-shrink-0 w-20 text-center">
                                            <div className="text-2xl font-light text-[var(--deep-teal)] group-hover:text-[var(--mustard-gold)] transition-colors">
                                                {project.year}
                                            </div>
                                            <div className="w-px h-6 bg-[var(--ink-line)] mx-auto mt-1"></div>
                                            <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-sm">location_on</span>
                                        </div>

                                        <div className="flex-shrink-0 w-24 h-24 border border-[var(--ink-line)] overflow-hidden hidden sm:block chalk-border">
                                            {img?.url ? (
                                                <img src={img.url} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            ) : (
                                                <div className="w-full h-full bg-[var(--platinum-sheen)]/10 flex items-center justify-center tracing-paper relative">
                                                    <div className="absolute inset-0 opacity-[0.06]"
                                                        style={{
                                                            backgroundImage: 'linear-gradient(var(--deep-teal) 1px, transparent 1px), linear-gradient(90deg, var(--deep-teal) 1px, transparent 1px)',
                                                            backgroundSize: '10px 10px'
                                                        }}>
                                                    </div>
                                                    <span className="material-symbols-outlined text-[var(--paper-plane-grey)] opacity-40 text-2xl relative z-10">domain</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-medium text-[var(--deep-teal)] group-hover:text-[var(--electric-teal)] transition-colors truncate">
                                                        {project.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">{project.typology}</span>
                                                        <span className="w-1 h-1 rounded-full bg-[var(--ink-line)]"></span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] italic">{project.location}</span>
                                                        {project.architecturalStyle && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-[var(--ink-line)]"></span>
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)]">{project.architecturalStyle}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-[var(--paper-plane-grey)] group-hover:text-[var(--electric-teal)] transition-colors flex-shrink-0">open_in_new</span>
                                            </div>
                                            {project.shortDescription && (
                                                <p className="text-sm text-[var(--paper-plane-grey)] mt-2 line-clamp-2 font-light">{project.shortDescription}</p>
                                            )}
                                            {project.author?.name && (
                                                <p className="text-[10px] text-[var(--paper-plane-grey)] mt-2 uppercase tracking-widest flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px]">person</span>
                                                    {project.author.name}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center border border-[var(--ink-line)] border-dashed bg-[var(--platinum-sheen)]/5">
                        <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] opacity-50 mb-3 block">inventory_2</span>
                        <h3 className="text-lg font-bold text-[var(--deep-teal)] mb-1">No Archived Records</h3>
                        <p className="text-sm text-[var(--paper-plane-grey)]">
                            {searchQuery ? 'Try adjusting your search query.' : 'No verified projects found for this era.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
