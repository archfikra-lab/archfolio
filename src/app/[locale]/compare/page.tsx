import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
    if (!searchParams.ids) {
        return (
            <div className="py-20 text-center border border-[var(--ink-line)] border-dashed bg-[var(--card-bg)]">
                <p className="text-[var(--paper-plane-grey)] text-lg mb-4">No projects selected for comparison.</p>
                <Link href="/explore" className="text-[var(--deep-teal)] underline hover:text-[var(--bright-rust)] font-bold uppercase tracking-widest text-sm">
                    Go to Explore
                </Link>
            </div>
        );
    }

    const ids = searchParams.ids.split(',');

    if (ids.length > 4) {
        return (
            <div className="py-20 text-center border border-[var(--ink-line)] border-dashed bg-[var(--card-bg)]">
                <p className="text-[var(--paper-plane-grey)] text-lg mb-4">You can only compare up to 4 projects at a time.</p>
                <Link href="/explore" className="text-[var(--deep-teal)] underline hover:text-[var(--bright-rust)] font-bold uppercase tracking-widest text-sm">
                    Go back
                </Link>
            </div>
        );
    }

    const projects = await prisma.project.findMany({
        where: { id: { in: ids } },
        include: { disciplines: true }
    });

    if (projects.length === 0) {
        notFound();
    }

    // Helper to safely extract parsed JSON from disciplines
    const getLayerData = (project: any, layer: string, key: string) => {
        const discipline = project.disciplines.find((d: any) => d.layer === layer);
        if (!discipline || !discipline.contentJson) return "N/A";
        try {
            const data = typeof discipline.contentJson === 'string' ? JSON.parse(discipline.contentJson) : discipline.contentJson;
            return data[key] || "N/A";
        } catch {
            return "N/A";
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-[var(--deep-teal)] mb-2 tracking-tight">Project Matrix Comparison</h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    Side-by-side technical evaluation across multiple A/E disciplines.
                </p>
            </div>

            <div className="overflow-x-auto pb-6">
                <table className="w-full min-w-[800px] border-collapse bg-[var(--card-bg)] border border-[var(--ink-line)] shadow-sm">
                    <thead>
                        {/* Headers */}
                        <tr>
                            <th className="p-4 border border-[var(--ink-line)] bg-[var(--ink-line)]/20 text-left w-1/5">
                                <span className="text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Feature Matrix</span>
                            </th>
                            {projects.map(project => (
                                <th key={project.id} className="p-4 border border-[var(--ink-line)] bg-[var(--ink-line)]/5 text-left align-top min-w-[250px]">
                                    <h3 className="text-lg font-bold text-[var(--deep-teal)] mb-1">{project.title}</h3>
                                    <p className="text-sm text-[var(--paper-plane-grey)] italic mb-4">{project.typology} • {project.location}</p>
                                    <Link href={`/project/${project.id}`} className="inline-block bg-[var(--deep-teal)] text-white text-xs px-3 py-1 font-bold uppercase tracking-wider hover:bg-[var(--mustard-gold)] hover:text-[var(--deep-teal)] transition-colors">
                                        View Full Spec
                                    </Link>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-[var(--deep-teal)]">
                        {/* Section: General Info */}
                        <tr className="bg-[var(--platinum-sheen)]/30">
                            <td colSpan={projects.length + 1} className="p-3 border border-[var(--ink-line)] font-bold tracking-widest uppercase text-xs">
                                1. General Characteristics
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">Architectural Style</td>
                            {projects.map(project => (
                                <td key={`style-${project.id}`} className="p-4 border border-[var(--ink-line)]">{project.architecturalStyle || "N/A"}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">Completion Year</td>
                            {projects.map(project => (
                                <td key={`year-${project.id}`} className="p-4 border border-[var(--ink-line)]">{project.year || "N/A"}</td>
                            ))}
                        </tr>

                        {/* Section: Architectural Layer */}
                        <tr className="bg-[var(--platinum-sheen)]/30">
                            <td colSpan={projects.length + 1} className="p-3 border border-[var(--ink-line)] font-bold tracking-widest uppercase text-xs">
                                2. Architectural Analysis
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">Massing Strategy</td>
                            {projects.map(project => (
                                <td key={`massing-${project.id}`} className="p-4 border border-[var(--ink-line)]">{getLayerData(project, "ARCHITECTURAL", "formalStrategy")}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">Materiality & Skin</td>
                            {projects.map(project => (
                                <td key={`materiality-${project.id}`} className="p-4 border border-[var(--ink-line)]">{getLayerData(project, "ARCHITECTURAL", "materiality")}</td>
                            ))}
                        </tr>

                        {/* Section: Structural Layer */}
                        <tr className="bg-[var(--platinum-sheen)]/30">
                            <td colSpan={projects.length + 1} className="p-3 border border-[var(--ink-line)] font-bold tracking-widest uppercase text-xs">
                                3. Structural Engineering
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">Primary Structural System</td>
                            {projects.map(project => (
                                <td key={`structural-${project.id}`} className="p-4 border border-[var(--ink-line)]">{getLayerData(project, "STRUCTURAL", "primarySystem")}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">Foundation Type</td>
                            {projects.map(project => (
                                <td key={`foundation-${project.id}`} className="p-4 border border-[var(--ink-line)]">{getLayerData(project, "STRUCTURAL", "foundation")}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">Lateral Load Strategy</td>
                            {projects.map(project => (
                                <td key={`lateral-${project.id}`} className="p-4 border border-[var(--ink-line)]">{getLayerData(project, "STRUCTURAL", "lateralStrategy")}</td>
                            ))}
                        </tr>

                        {/* Section: MEP Layer */}
                        <tr className="bg-[var(--platinum-sheen)]/30">
                            <td colSpan={projects.length + 1} className="p-3 border border-[var(--ink-line)] font-bold tracking-widest uppercase text-xs">
                                4. MEP & Environmental
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">HVAC Systems</td>
                            {projects.map(project => (
                                <td key={`hvac-${project.id}`} className="p-4 border border-[var(--ink-line)]">{getLayerData(project, "MEP", "hvacSystem")}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border border-[var(--ink-line)] font-medium text-[var(--paper-plane-grey)] bg-[var(--card-bg)]">Sustainability Rating</td>
                            {projects.map(project => (
                                <td key={`sus-${project.id}`} className="p-4 border border-[var(--ink-line)]">{getLayerData(project, "CROSS_DISCIPLINARY", "sustainability")}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
