import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudioDashboard() {
    const myProjects: any[] = await (prisma.project as any).findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        include: { author: true }
    });

    const totalCount = myProjects.length;
    const approvedCount = myProjects.filter((p: any) => p.status === 'APPROVED').length;
    const pendingCount = myProjects.filter((p: any) => p.status === 'PENDING_REVIEW').length;
    const draftCount = myProjects.filter((p: any) => p.status === 'DRAFT').length;

    return (
        <div className="space-y-10 page-enter">
            {/* Hero + CTA */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-[var(--card-bg)] border border-[var(--ink-line)]">
                <div className="max-w-md">
                    <h2 className="text-3xl font-bold text-[var(--deep-teal)] leading-tight mb-2">Studio Workspace</h2>
                    <p className="text-[var(--paper-plane-grey)] font-medium text-sm">Document architectural case studies, manage your engineering submissions, and collaborate with your team.</p>
                </div>
                <Link href="/author/submit" className="flex items-center justify-center gap-3 bg-[var(--mustard-gold)] hover:brightness-110 text-slate-900 px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg whitespace-nowrap">
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    <span>Start New Draft</span>
                </Link>
            </section>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--deep-teal)]">folder_special</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{totalCount}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Total Projects</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--electric-teal)]">public</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{approvedCount}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)]">Published</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/30 p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--mustard-gold)]">hourglass_top</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{pendingCount}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)]">In Review</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-2xl text-[var(--paper-plane-grey)]">edit_note</span>
                        <span className="text-3xl font-light text-[var(--deep-teal)]">{draftCount}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Drafts</p>
                </div>
            </div>

            {/* Projects Grid */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-[var(--ink-line)] pb-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[var(--mustard-gold)]">pending_actions</span>
                        <h3 className="text-xl font-medium uppercase tracking-tight text-[var(--deep-teal)]">All Projects</h3>
                    </div>
                    <Link className="text-sm font-bold text-[var(--mustard-gold)] hover:underline" href="/explore">View Public Archive</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 card-grid">
                    {myProjects.length > 0 ? myProjects.map((project: any, index: number) => (
                        <div key={project.id} className="group relative bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden transition-all hover:-translate-y-1 hover:border-[var(--mustard-gold)] hover:shadow-lg" style={{ animationDelay: `${index * 80}ms` }}>
                            <div className="h-40 bg-[var(--platinum-sheen)] relative overflow-hidden flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] group-hover:scale-110 transition-transform">
                                    {project.status === 'DRAFT' ? 'draft' : 'image'}
                                </span>
                                <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter ${project.status === 'APPROVED' ? 'bg-[var(--electric-teal)]' :
                                        project.status === 'PENDING_REVIEW' ? 'bg-[var(--mustard-gold)]' :
                                            project.status === 'REJECTED' ? 'bg-red-500' :
                                                'bg-[var(--paper-plane-grey)]'
                                    }`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="p-5">
                                <h4 className="font-medium text-lg mb-1 leading-tight text-[var(--deep-teal)] truncate" title={project.title}>{project.title}</h4>
                                <p className="text-xs text-[var(--paper-plane-grey)] mb-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">location_on</span>
                                    {project.location}
                                </p>
                                <p className="text-xs text-[var(--paper-plane-grey)] mb-4">Submitted {new Date(project.createdAt).toLocaleDateString()}</p>
                                <div className="flex items-center justify-between">
                                    {project.status === 'PENDING_REVIEW' ? (
                                        <div className="flex items-center gap-2 text-[var(--mustard-gold)]">
                                            <span className="material-symbols-outlined text-sm">mark_email_unread</span>
                                            <span className="text-[10px] font-bold uppercase truncate">In Queue</span>
                                        </div>
                                    ) : project.status === 'APPROVED' ? (
                                        <div className="flex items-center gap-2 text-[var(--electric-teal)]">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            <span className="text-[10px] font-bold uppercase truncate">Verified</span>
                                        </div>
                                    ) : project.status === 'REJECTED' ? (
                                        <div className="flex items-center gap-2 text-red-400">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            <span className="text-[10px] font-bold uppercase truncate">Revise</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-[var(--paper-plane-grey)]">
                                            <span className="material-symbols-outlined text-sm">draft</span>
                                            <span className="text-[10px] font-bold uppercase truncate">Draft</span>
                                        </div>
                                    )}
                                    <Link href={`/project/${project.id}`} className="text-[var(--paper-plane-grey)] text-sm font-bold flex items-center gap-1 hover:text-[var(--mustard-gold)] transition-colors whitespace-nowrap">
                                        Details <span className="material-symbols-outlined text-sm">info</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : null}

                    {/* Quick Draft Card */}
                    <Link href="/author/submit" className="group relative bg-[var(--card-bg)] border-2 border-dashed border-[var(--mustard-gold)] flex flex-col items-center justify-center p-10 hover:bg-[var(--platinum-sheen)] transition-colors cursor-pointer min-h-[250px]">
                        <span className="material-symbols-outlined text-[var(--mustard-gold)] text-4xl mb-2 group-hover:scale-110 transition-transform">note_add</span>
                        <p className="text-sm font-bold text-[var(--mustard-gold)] uppercase tracking-widest">Quick Draft</p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
