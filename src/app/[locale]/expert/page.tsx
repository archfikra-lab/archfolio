import { prisma } from "@/lib/prisma";
import ReviewActionButtons from "@/components/ReviewActionButtons";
import Link from "next/link";

export default async function ExpertDashboard() {
    const pendingProjects: any[] = await (prisma.project as any).findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { createdAt: "asc" },
        include: { author: true }
    });

    const approvedProjects: any[] = await (prisma.project as any).findMany({
        where: { status: "APPROVED" },
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { author: true, reviewer: true }
    });

    const totalReviewed = await (prisma.project as any).count({ where: { status: { in: ["APPROVED", "REJECTED"] } } });
    const totalApproved = await (prisma.project as any).count({ where: { status: "APPROVED" } });
    const totalRejected = await (prisma.project as any).count({ where: { status: "REJECTED" } });
    const totalFeedback = await prisma.feedback.count({ where: { type: "revision_request" } });

    return (
        <div className="space-y-10 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">Technical Assessment Queue</h1>
                    <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                        Expert Review &amp; Technical Validation
                    </p>
                </div>
                <Link href="/" className="text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] hover:text-[var(--electric-teal)] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to site
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/30 p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--mustard-gold)]">pending_actions</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{pendingProjects.length}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)]">In Queue</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--deep-teal)]">grading</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{totalReviewed}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Total Reviewed</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--electric-teal)]">check_circle</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{totalApproved}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)]">Approved</p>
                    {totalReviewed > 0 && <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1">{Math.round((totalApproved / totalReviewed) * 100)}% rate</p>}
                </div>
                <div className="bg-[var(--card-bg)] border border-red-400/30 p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-red-400">rate_review</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{totalFeedback}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">Revision Notes</p>
                </div>
            </div>

            {/* Pending Review Queue Table */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                <div className="p-6 border-b border-[var(--ink-line)] flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[var(--deep-teal)] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--mustard-gold)]">assignment</span>
                        Projects Needing Technical Review
                    </h2>
                    <span className="bg-[var(--mustard-gold)]/20 text-[var(--mustard-gold)] text-[10px] font-bold px-3 py-1 uppercase border border-[var(--mustard-gold)]">
                        {pendingProjects.length} pending
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--paper-plane-grey)]">
                        <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                            <tr>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Project Title</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Typology</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Location</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Firm</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Date</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ink-line)]">
                            {pendingProjects.map((project: any) => (
                                <tr key={project.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link href={`/project/${project.id}`} className="font-medium text-[var(--deep-teal)] hover:text-[var(--electric-teal)] transition-colors">
                                            {project.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-[var(--ink-line)] px-2 py-1 text-[10px] tracking-wider uppercase text-[var(--deep-teal)]">{project.typology}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">{project.location}</td>
                                    <td className="px-6 py-4 text-xs">{project.author?.name || "Unknown"}</td>
                                    <td className="px-6 py-4 text-xs">{new Date(project.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <ReviewActionButtons projectId={project.id} />
                                    </td>
                                </tr>
                            ))}
                            {pendingProjects.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--paper-plane-grey)]">
                                        <span className="material-symbols-outlined text-4xl mb-3 opacity-50 block">done_all</span>
                                        <p className="text-sm font-medium">All caught up! The queue is empty.</p>
                                        <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1 uppercase tracking-widest">New submissions will appear here</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recently Reviewed Section */}
            {approvedProjects.length > 0 && (
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--ink-line)]">
                        <h2 className="text-lg font-medium text-[var(--deep-teal)] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--electric-teal)]">verified</span>
                            Recently Approved
                        </h2>
                    </div>
                    <div className="divide-y divide-[var(--ink-line)]">
                        {approvedProjects.map((project: any) => (
                            <div key={project.id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--platinum-sheen)]/10 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 border border-[var(--electric-teal)]/30 flex items-center justify-center bg-[var(--electric-teal)]/5">
                                        <span className="material-symbols-outlined text-sm text-[var(--electric-teal)]">check</span>
                                    </div>
                                    <div>
                                        <Link href={`/project/${project.id}`} className="font-medium text-[var(--deep-teal)] hover:text-[var(--electric-teal)] transition-colors text-sm">
                                            {project.title}
                                        </Link>
                                        <p className="text-[10px] text-[var(--paper-plane-grey)] mt-0.5">{project.typology} • {project.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest">{new Date(project.updatedAt).toLocaleDateString()}</span>
                                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-[var(--electric-teal)] text-[var(--electric-teal)]">
                                        Approved
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
