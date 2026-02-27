import { prisma } from "@/lib/prisma";
import ReviewActionButtons from "@/components/ReviewActionButtons";

export default async function ExpertDashboard() {
    const pendingProjects = await prisma.project.findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { createdAt: "asc" },
        include: { author: true }
    });

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">Review Queue</h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                    Academic Verification & Quality Control
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-[var(--mustard-gold)]/10 text-[var(--mustard-gold)]">
                        <span className="material-symbols-outlined text-sm">assignment_late</span>
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-2">Awaiting Verification</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{pendingProjects.length}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] mb-2">My Verified Projects</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">--</p>
                </div>
            </div>

            {/* Review Queue Table */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                <div className="p-6 border-b border-[var(--ink-line)]">
                    <h2 className="text-lg font-medium text-[var(--deep-teal)]">Projects Needing Review</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--paper-plane-grey)]">
                        <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                            <tr>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Project Title</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Submitting Firm</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Submission Date</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ink-line)]">
                            {pendingProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[var(--deep-teal)]">{project.title}</td>
                                    <td className="px-6 py-4">{project.author?.name || "Unknown Author"}</td>
                                    <td className="px-6 py-4">{new Date(project.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <ReviewActionButtons projectId={project.id} />
                                    </td>
                                </tr>
                            ))}
                            {pendingProjects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--paper-plane-grey)]">
                                        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">done_all</span>
                                        <p className="text-sm">The review queue is currently empty.</p>
                                        <p className="text-[10px] uppercase tracking-widest mt-2 text-[var(--electric-teal)]">Great job keeping up!</p>
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
