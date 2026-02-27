import { prisma } from "@/lib/prisma";
import ReviewActionButtons from "@/components/ReviewActionButtons";

export default async function AcademicDashboard() {
    const pendingProjects = await prisma.project.findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { createdAt: "asc" },
        include: { author: true }
    });

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Theoretical Assesssment Queue</h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                    Academic Review & Architectural Theory Validation
                </p>
            </div>

            {/* Academic Queue Table */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                <div className="p-6 border-b border-[var(--ink-line)]">
                    <h2 className="text-lg font-medium text-white">Projects Needing Theoretical Review</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--paper-plane-grey)]">
                        <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                            <tr>
                                <th className="px-6 py-4 font-medium text-white/80">Project Title</th>
                                <th className="px-6 py-4 font-medium text-white/80">Typology</th>
                                <th className="px-6 py-4 font-medium text-white/80">Submitting Firm</th>
                                <th className="px-6 py-4 font-medium text-white/80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ink-line)]">
                            {pendingProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-[var(--ink-line)] px-2 py-1 text-[10px] tracking-wider uppercase text-white rounded-sm">{project.typology}</span>
                                    </td>
                                    <td className="px-6 py-4">{project.author?.name || "Unknown Author"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <ReviewActionButtons projectId={project.id} />
                                    </td>
                                </tr>
                            ))}
                            {pendingProjects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--paper-plane-grey)]">
                                        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">done_all</span>
                                        <p className="text-sm">The assessment queue is currently empty.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
