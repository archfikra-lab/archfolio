import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AuthorDashboard() {
    // Fetch all projects (MVP: no user session filtering yet)
    const myProjects: any[] = await (prisma.project as any).findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        include: { author: true }
    });

    const totalCount = myProjects.length;
    const approvedCount = myProjects.filter((p: any) => p.status === 'APPROVED').length;
    const pendingCount = myProjects.filter((p: any) => p.status === 'PENDING_REVIEW').length;
    const rejectedCount = myProjects.filter((p: any) => p.status === 'REJECTED').length;
    const draftCount = myProjects.filter((p: any) => p.status === 'DRAFT').length;

    // Fetch feedback/revision requests
    const feedback: any[] = await prisma.feedback.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { type: "revision_request" }
    });

    return (
        <div className="space-y-10 page-enter">
            {/* Hero + CTA */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-[var(--card-bg)] border border-[var(--ink-line)]">
                <div className="max-w-md">
                    <h2 className="text-3xl font-bold text-[var(--deep-teal)] leading-tight mb-2">Author Dashboard</h2>
                    <p className="text-[var(--paper-plane-grey)] font-medium text-sm">Publish technical case studies, track peer reviews, and manage your architectural portfolio.</p>
                </div>
                <Link href="/author/submit" className="flex items-center justify-center gap-3 bg-[var(--electric-teal)] hover:bg-[var(--deep-teal)] text-white px-8 py-4 font-bold text-sm uppercase tracking-widest transition-colors shadow-lg whitespace-nowrap">
                    <span className="material-symbols-outlined text-xl">publish</span>
                    <span>Submit Project</span>
                </Link>
            </section>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--deep-teal)]">inventory_2</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{totalCount}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Total Projects</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--electric-teal)]">verified</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{approvedCount}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)]">Approved</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/30 p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--mustard-gold)]">hourglass_bottom</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{pendingCount}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)]">Pending Review</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-red-400/30 p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-red-400">error_outline</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{rejectedCount}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">Needs Revision</p>
                </div>
            </div>

            {/* Feedback Notifications */}
            {feedback.length > 0 && (
                <section className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/30 overflow-hidden">
                    <div className="p-5 border-b border-[var(--ink-line)] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--mustard-gold)]">notifications_active</span>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--mustard-gold)]">Revision Requests</h3>
                        <span className="ml-auto bg-[var(--mustard-gold)] text-black text-[10px] font-bold px-2 py-0.5">{feedback.length}</span>
                    </div>
                    <div className="divide-y divide-[var(--ink-line)]">
                        {feedback.map((fb: any) => (
                            <div key={fb.id} className="p-4 flex items-start gap-3 hover:bg-[var(--platinum-sheen)]/10 transition-colors">
                                <span className="material-symbols-outlined text-[var(--mustard-gold)] text-sm mt-0.5 flex-shrink-0">rate_review</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[var(--deep-teal)] line-clamp-2">{fb.content}</p>
                                    <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1 uppercase tracking-widest">{new Date(fb.createdAt).toLocaleDateString()}</p>
                                </div>
                                {fb.projectId && (
                                    <Link href={`/project/${fb.projectId}`} className="text-[10px] font-bold text-[var(--electric-teal)] uppercase tracking-widest whitespace-nowrap hover:text-[var(--deep-teal)] transition-colors">
                                        View →
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects Grid */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-[var(--ink-line)] pb-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[var(--electric-teal)]">inventory_2</span>
                        <h3 className="text-xl font-medium uppercase tracking-tight text-[var(--deep-teal)]">My Projects</h3>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">
                        <span>{totalCount} total</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 card-grid">
                    {myProjects.length > 0 ? myProjects.map((project: any, index: number) => (
                        <div key={project.id} className="group relative bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden transition-all hover:-translate-y-1 hover:border-[var(--electric-teal)] hover:shadow-lg" style={{ animationDelay: `${index * 80}ms` }}>
                            <div className="h-40 bg-[var(--platinum-sheen)] relative overflow-hidden flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] group-hover:scale-110 transition-transform">domain</span>
                                <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter ${project.status === 'APPROVED' ? 'bg-[var(--electric-teal)]' :
                                        project.status === 'PENDING_REVIEW' ? 'bg-[var(--mustard-gold)]' :
                                            project.status === 'REJECTED' ? 'bg-red-500' :
                                                'bg-[var(--paper-plane-grey)]'
                                    }`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                                <span className="absolute top-3 right-3 text-[10px] font-bold text-[var(--paper-plane-grey)] bg-white/80 px-2 py-0.5">
                                    {project.year}
                                </span>
                            </div>
                            <div className="p-5">
                                <h4 className="font-medium text-lg mb-1 leading-tight text-[var(--deep-teal)] truncate" title={project.title}>{project.title}</h4>
                                <p className="text-xs text-[var(--paper-plane-grey)] mb-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">location_on</span>
                                    {project.location}
                                </p>
                                <p className="text-xs text-[var(--paper-plane-grey)] mb-4 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">category</span>
                                    {project.typology}
                                </p>
                                <div className="flex items-center justify-between">
                                    {project.status === 'PENDING_REVIEW' ? (
                                        <div className="flex items-center gap-2 text-[var(--mustard-gold)]">
                                            <span className="material-symbols-outlined text-sm">hourglass_bottom</span>
                                            <span className="text-[10px] font-bold uppercase truncate">In Validation</span>
                                        </div>
                                    ) : project.status === 'REJECTED' ? (
                                        <div className="flex items-center gap-2 text-red-500">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            <span className="text-[10px] font-bold uppercase truncate">Revise</span>
                                        </div>
                                    ) : project.status === 'APPROVED' ? (
                                        <div className="flex items-center gap-2 text-[var(--electric-teal)]">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                            <span className="text-[10px] font-bold uppercase truncate">Published</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-[var(--paper-plane-grey)]">
                                            <span className="material-symbols-outlined text-sm">draft</span>
                                            <span className="text-[10px] font-bold uppercase truncate">Draft</span>
                                        </div>
                                    )}
                                    <Link href={`/project/${project.id}`} className="text-[var(--paper-plane-grey)] text-sm font-bold flex items-center gap-1 hover:text-[var(--electric-teal)] transition-colors whitespace-nowrap">
                                        View <span className="material-symbols-outlined text-sm">visibility</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--ink-line)]">
                            <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] mb-3 block">search_off</span>
                            <p className="text-[var(--paper-plane-grey)] font-medium mb-4">No projects authored yet.</p>
                            <Link href="/author/submit" className="inline-flex items-center gap-2 bg-[var(--electric-teal)] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Submit Your First Project
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
