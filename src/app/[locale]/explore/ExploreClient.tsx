'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet
const ProjectMap = dynamic(() => import('@/components/ProjectMap'), { ssr: false });

type Project = {
    id: string;
    title: string;
    location: string;
    typology: string;
    latitude: number | null;
    longitude: number | null;
    shortDescription: string | null;
    architecturalStyle: string | null;
    year: number;
};

type ExploreClientProps = {
    initialProjects: Project[];
};

export default function ExploreClient({ initialProjects }: ExploreClientProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [projects, setProjects] = useState<Project[]>(initialProjects);

    // Advanced Filtering States
    const [typologyFilter, setTypologyFilter] = useState<string>('');
    const [yearFilter, setYearFilter] = useState<string>('');
    const [styleFilter, setStyleFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Apply Filters
    const filteredProjects = projects.filter(project => {
        let matches = true;
        if (typologyFilter && project.typology !== typologyFilter) matches = false;
        if (yearFilter && project.year.toString() !== yearFilter) matches = false;
        if (styleFilter && project.architecturalStyle !== styleFilter) matches = false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!project.title.toLowerCase().includes(query) &&
                !project.location.toLowerCase().includes(query) &&
                !(project.shortDescription && project.shortDescription.toLowerCase().includes(query))) {
                matches = false;
            }
        }
        return matches;
    });

    // Comparison State
    const [compareQueue, setCompareQueue] = useState<string[]>([]);

    const toggleCompare = (e: React.MouseEvent, projectId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setCompareQueue(prev => {
            if (prev.includes(projectId)) return prev.filter(id => id !== projectId);
            if (prev.length >= 4) return prev; // Max 4
            return [...prev, projectId];
        });
    };

    return (
        <div className="space-y-6">
            {/* Control Bar (Filters + View Toggle) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-[var(--ink-line)] bg-[var(--card-bg)] p-4 relative z-10">
                <div className="flex flex-wrap gap-4 items-center flex-1">
                    <span className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest hidden md:inline">Filters:</span>
                    <select
                        value={typologyFilter}
                        onChange={(e) => setTypologyFilter(e.target.value)}
                        className="bg-[var(--card-bg)] border border-[var(--ink-line)] text-[var(--deep-teal)] text-sm p-2 outline-none focus:border-[var(--mustard-gold)] transition-colors min-w-[140px]"
                    >
                        <option value="">All Typologies</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Residential">Residential</option>
                        <option value="Educational">Educational</option>
                    </select>

                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="bg-[var(--card-bg)] border border-[var(--ink-line)] text-[var(--deep-teal)] text-sm p-2 outline-none focus:border-[var(--mustard-gold)] transition-colors min-w-[120px]"
                    >
                        <option value="">Any Year</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>

                    <select
                        value={styleFilter}
                        onChange={(e) => setStyleFilter(e.target.value)}
                        className="bg-[var(--card-bg)] border border-[var(--ink-line)] text-[var(--deep-teal)] text-sm p-2 outline-none focus:border-[var(--mustard-gold)] transition-colors min-w-[140px]"
                    >
                        <option value="">All Styles</option>
                        <option value="Modern">Modern</option>
                        <option value="High-Tech">High-Tech</option>
                        <option value="Islamic Revival">Islamic Revival</option>
                        <option value="Contemporary">Contemporary</option>
                        <option value="Vernacular">Vernacular</option>
                    </select>

                    <div className="relative flex-1 min-w-[200px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-plane-grey)] text-sm pointer-events-none">search</span>
                        <input
                            type="text"
                            placeholder="Search projects by title, location, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[var(--card-bg)] border border-[var(--ink-line)] text-[var(--deep-teal)] text-sm p-2 pl-9 outline-none focus:border-[var(--mustard-gold)] transition-colors w-full"
                        />
                    </div>
                </div>

                <div className="flex bg-[var(--ink-line)] p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-1 px-4 py-2 text-sm transition-colors ${viewMode === 'grid' ? 'bg-[var(--card-bg)] text-[var(--deep-teal)] font-bold shadow-sm' : 'text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)]'}`}
                    >
                        <span className="material-symbols-outlined text-lg">grid_view</span>
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-1 px-4 py-2 text-sm transition-colors ${viewMode === 'map' ? 'bg-[var(--card-bg)] text-[var(--deep-teal)] font-bold shadow-sm' : 'text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)]'}`}
                    >
                        <span className="material-symbols-outlined text-lg">map</span>
                        Map
                    </button>
                </div>
            </div>

            {/* Results Counter */}
            <div className="text-[var(--paper-plane-grey)] text-xs uppercase tracking-wider mb-4">
                {filteredProjects.length === 1 ? '1 PROJECT FOUND' : `${filteredProjects.length} PROJECTS FOUND`}
            </div>

            {filteredProjects.length === 0 && (
                <div className="py-20 text-center border border-[var(--ink-line)] border-dashed bg-[var(--card-bg)]">
                    <p className="text-[var(--paper-plane-grey)]">No projects match the selected filters. Try broadening your search.</p>
                </div>
            )}

            {/* Content View */}
            {filteredProjects.length > 0 && viewMode === 'map' && (
                <div className="animate-in fade-in duration-500 relative z-0">
                    <ProjectMap projects={filteredProjects} />
                </div>
            )}

            {filteredProjects.length > 0 && viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 relative z-0">
                    {filteredProjects.map(project => {
                        const isSelected = compareQueue.includes(project.id);
                        return (
                            <div key={project.id} className={`group relative flex flex-col bg-[var(--card-bg)] border transition-colors h-full ${isSelected ? 'border-[var(--mustard-gold)] shadow-[0_0_0_1px_var(--mustard-gold)]' : 'border-[var(--ink-line)] hover:border-[var(--electric-teal)]'}`}>
                                <Link href={`/project/${project.id}`} className="flex flex-col flex-1">
                                    <div className="h-48 bg-[var(--platinum-sheen)]/10 relative overflow-hidden flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] opacity-20 group-hover:scale-110 transition-transform duration-500">architecture</span>
                                        <div className="absolute top-3 right-3 bg-[var(--midnight-charcoal)]/80 backdrop-blur-sm border border-[var(--ink-line)] px-2 py-1 flex items-center gap-1.5 z-10">
                                            <span className="material-symbols-outlined text-[10px] text-[var(--electric-teal)]">verified</span>
                                            <span className="text-[9px] uppercase tracking-widest text-white font-bold">Verified</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-[var(--deep-teal)] mb-2 group-hover:text-[var(--mustard-gold)] transition-colors">{project.title}</h3>
                                            <p className="text-sm text-[var(--paper-plane-grey)] line-clamp-2 mb-4">
                                                {project.shortDescription || "A verified architectural project demonstrating excellence in planning and execution."}
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-[var(--ink-line)] flex items-center justify-between text-xs">
                                            <span className="text-[var(--paper-plane-grey)] flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                {project.location}
                                            </span>
                                            <div className="flex gap-2">
                                                {project.architecturalStyle && (
                                                    <span className="bg-[var(--ink-line)]/50 text-[var(--deep-teal)] px-2 py-0.5 rounded-sm">{project.architecturalStyle}</span>
                                                )}
                                                <span className="bg-[var(--ink-line)] text-[var(--deep-teal)] font-medium px-2 py-0.5 rounded-sm">{project.typology} {project.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Compare Button Overlay */}
                                <div className={`absolute top-3 left-3 transition-opacity z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <button
                                        onClick={(e) => toggleCompare(e, project.id)}
                                        className={`px-2 py-1 flex items-center gap-1.5 transition-colors shadow-md border 
                                            ${isSelected ? 'bg-[var(--mustard-gold)] text-[var(--deep-teal)] border-[var(--mustard-gold)]' : 'bg-[var(--deep-teal)] text-white border-[var(--ink-line)] hover:bg-[var(--mustard-gold)] hover:text-[var(--deep-teal)]'}`}
                                    >
                                        <span className="material-symbols-outlined text-[12px]">{isSelected ? 'check_circle' : 'compare_arrows'}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest">{isSelected ? 'Selected' : 'Compare'}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Floating Compare Action Bar */}
            {compareQueue.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--midnight-charcoal)] text-white px-6 py-4 border border-[var(--ink-line)] shadow-xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-[var(--mustard-gold)]">compare_arrows</span>
                        <span className="font-bold text-sm tracking-wide">{compareQueue.length} {compareQueue.length === 1 ? 'Project' : 'Projects'} Selected</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setCompareQueue([])}
                            className="bg-white/10 border border-white/20 hover:bg-white/20 px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors"
                        >
                            Clear
                        </button>
                        <Link
                            href={`/compare?ids=${compareQueue.join(',')}`}
                            className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors border ${compareQueue.length > 1 ? 'bg-[var(--mustard-gold)] text-[var(--deep-teal)] border-[var(--mustard-gold)] hover:brightness-110' : 'bg-white/10 text-white/50 border-white/10 cursor-not-allowed pointer-events-none'}`}
                        >
                            Compare Now
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
