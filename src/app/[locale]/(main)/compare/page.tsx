import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
    if (!searchParams.ids) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-4">No Projects Selected</h1>
                <p className="text-[var(--paper-plane-grey)] mb-6">Please select projects from the Explore page to compare them.</p>
                <Link href="/en/explore" className="bg-[var(--electric-teal)] text-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors border border-transparent">
                    Go to Explore
                </Link>
            </div>
        );
    }

    const ids = searchParams.ids.split(',');

    if (ids.length < 2) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-4">Insufficient Projects Selected</h1>
                <p className="text-[var(--paper-plane-grey)] mb-6">Please select at least two projects to compare.</p>
                <Link href="/en/explore" className="bg-[var(--electric-teal)] text-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors border border-transparent">
                    Select More Projects
                </Link>
            </div>
        );
    }

    const projects = await prisma.project.findMany({
        where: {
            id: { in: ids }
        },
        include: {
            disciplines: true
        }
    });

    if (projects.length === 0) {
        redirect('/en/explore');
    }

    // Helper to safely extract typed string from discipline JSON
    const extractDisciplineData = (project: any, disciplineType: string, key: string) => {
        const discipline = project.disciplines.find((d: any) => d.type === disciplineType);
        if (!discipline || !discipline.contentJson) return 'N/A';
        try {
            const parsed = JSON.parse(discipline.contentJson as string);
            return parsed[key] || 'N/A';
        } catch (e) {
            return 'N/A';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-[var(--deep-teal)] mb-2 tracking-tight">Project Comparison</h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    Side-by-side analysis of architectural and structural specifications.
                </p>
            </div>

            <div className="overflow-x-auto pb-6">
                <table className="min-w-full bg-[var(--card-bg)] border border-[var(--ink-line)]">
                    <thead>
                        <tr>
                            <th className="p-6 border-b border-r border-[var(--ink-line)] bg-[var(--platinum-sheen)]/10 text-left w-1/4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Select Criteria</span>
                            </th>
                            {projects.map(project => (
                                <th key={project.id} className="p-6 border-b border-r border-[var(--ink-line)] min-w-[300px] align-top">
                                    <div className="flex flex-col h-full">
                                        <div className="text-[10px] uppercase tracking-widest text-[var(--electric-teal)] mb-1 font-bold">{project.typology}</div>
                                        <h2 className="text-xl font-bold text-[var(--deep-teal)] leading-tight mb-2">
                                            <Link href={`/en/project/${project.id}`} className="hover:text-[var(--bright-rust)] transition-colors">
                                                {project.title}
                                            </Link>
                                        </h2>
                                        <p className="text-xs text-[var(--paper-plane-grey)] flex items-center gap-1 font-medium tracking-wide">
                                            <span className="material-symbols-outlined text-[10px]">location_on</span>
                                            {project.location}
                                        </p>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-[var(--ink-line)] text-[var(--deep-teal)]">
                        {/* Basic Info */}
                        <tr className="bg-[var(--platinum-sheen)]/5">
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Year Established</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)]">{p.year || 'N/A'}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Architectural Style</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)]">{(p as any).architecturalStyle || 'N/A'}</td>
                            ))}
                        </tr>

                        {/* Conceptual Data */}
                        <tr className="bg-[var(--platinum-sheen)]/5">
                            <td colSpan={projects.length + 1} className="py-3 px-4 font-bold text-[var(--electric-teal)] uppercase tracking-widest text-xs border-y border-[var(--ink-line)]">Concept & Aesthetics</td>
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Materiality</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)] text-sm">{extractDisciplineData(p, 'Architectural', 'materiality')}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Description</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)] text-sm line-clamp-4">{extractDisciplineData(p, 'Architectural', 'description')}</td>
                            ))}
                        </tr>

                        {/* Structural Data */}
                        <tr className="bg-[var(--platinum-sheen)]/5">
                            <td colSpan={projects.length + 1} className="py-3 px-4 font-bold text-[var(--mustard-gold)] uppercase tracking-widest text-xs border-y border-[var(--ink-line)]">Structural Engineering</td>
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Structural System</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)]">{extractDisciplineData(p, 'Structural', 'systemType')}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Foundation Type</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)]">{extractDisciplineData(p, 'Structural', 'foundation')}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Load Bearing Capacity</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)]">{extractDisciplineData(p, 'Structural', 'loadCapacity')}</td>
                            ))}
                        </tr>

                        {/* MEP Data */}
                        <tr className="bg-[var(--platinum-sheen)]/5">
                            <td colSpan={projects.length + 1} className="py-3 px-4 font-bold text-[#b44b36] uppercase tracking-widest text-xs border-y border-[var(--ink-line)]">MEP Systems</td>
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">HVAC Configuration</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)]">{extractDisciplineData(p, 'MEP', 'hvacSystem')}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Power Load (kVA)</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)]">{extractDisciplineData(p, 'MEP', 'powerLoad')}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-[var(--ink-line)] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-[10px]">Plumbing Info</td>
                            {projects.map(p => (
                                <td key={p.id} className="p-4 border-r border-[var(--ink-line)] text-sm">{extractDisciplineData(p, 'MEP', 'plumbing')}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
