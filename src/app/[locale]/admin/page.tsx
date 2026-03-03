import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SeedButton from "@/components/SeedButton";
import { getTranslations } from 'next-intl/server'; // Correct import for async Server Components

export default async function AdminDashboard() {
    const t = await getTranslations('AdminDashboard'); // Initialize translations for the 'AdminDashboard' namespace

    const totalProjects = await prisma.project.count();
    const pendingProjects = await (prisma.project as any).count({ where: { status: "PENDING_REVIEW" } });
    const approvedProjects = await (prisma.project as any).count({ where: { status: "APPROVED" } });
    const rejectedProjects = await (prisma.project as any).count({ where: { status: "REJECTED" } });
    const draftProjects = await (prisma.project as any).count({ where: { status: "DRAFT" } });
    const totalUsers = await (prisma as any).user.count();
    const totalFeedback = await prisma.feedback.count();

    const projects: any[] = await (prisma.project as any).findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { author: true, reviewer: true }
    });

    const recentFeedback: any[] = await prisma.feedback.findMany({
        take: 5,
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-10 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">Platform Overview</h1>
                    <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                        System Analytics and Moderation
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/en/admin/partners" className="bg-[var(--mustard-gold)] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">handshake</span>
                        Partners & Donors
                    </Link>
                    <Link href="/en/admin/ads" className="bg-[var(--card-bg)] border border-[var(--ink-line)] text-[var(--deep-teal)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-[var(--electric-teal)] transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">campaign</span>
                        Manage Ads
                    </Link>
                    <Link href="/en/admin/subscribers" className="bg-[var(--electric-teal)] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">group</span>
                        Manage Users
                    </Link>
                    <Link href="/en/admin/localization" className="bg-[var(--card-bg)] border border-[var(--ink-line)] text-[var(--deep-teal)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-[var(--mustard-gold)] transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">translate</span>
                        Localization
                    </Link>
                </div>
                <SeedButton />
            </div>

            {/* KPI Cards — 5 columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift transition-all">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Total Submissions</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{totalProjects}</p>
                    <p className="text-[10px] text-[var(--paper-plane-grey)] mt-2 font-bold uppercase tracking-widest">All Projects</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/50 p-5 relative overflow-hidden hover-lift transition-all">
                    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-[var(--mustard-gold)]/10 text-[var(--mustard-gold)]">
                        <span className="material-symbols-outlined text-sm">pending_actions</span>
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-2">Pending Review</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{pendingProjects}</p>
                    <p className="text-[10px] text-[var(--mustard-gold)] mt-2 font-bold uppercase tracking-widest">Needs Action</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/50 p-5 hover-lift transition-all">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] mb-2">Approved</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{approvedProjects}</p>
                    <p className="text-[10px] text-[var(--electric-teal)] mt-2 font-bold uppercase tracking-widest">Published</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-red-400/30 p-5 hover-lift transition-all">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">Rejected</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{rejectedProjects}</p>
                    <p className="text-[10px] text-red-400 mt-2 font-bold uppercase tracking-widest">Revisions</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift transition-all">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Registered Users</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{totalUsers}</p>
                    <Link href="/en/admin/subscribers" className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] hover:text-[var(--deep-teal)] transition-colors mt-2 inline-flex items-center gap-1">
                        Manage <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                    </Link>
                </div>
            </div>

            {/* Status Distribution Bar */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-4">Submission Pipeline</h3>
                <div className="flex h-3 w-full overflow-hidden gap-0.5">
                    {totalProjects > 0 && (
                        <>
                            <div className="bg-[var(--paper-plane-grey)]" style={{ width: `${(draftProjects / totalProjects) * 100}% ` }} title={`Draft: ${draftProjects} `} />
                            <div className="bg-[var(--mustard-gold)]" style={{ width: `${(pendingProjects / totalProjects) * 100}% ` }} title={`Pending: ${pendingProjects} `} />
                            <div className="bg-[var(--electric-teal)]" style={{ width: `${(approvedProjects / totalProjects) * 100}% ` }} title={`Approved: ${approvedProjects} `} />
                            <div className="bg-red-400" style={{ width: `${(rejectedProjects / totalProjects) * 100}% ` }} title={`Rejected: ${rejectedProjects} `} />
                        </>
                    )}
                </div>
                <div className="flex items-center gap-6 mt-3 text-[10px] uppercase tracking-widest font-bold text-[var(--paper-plane-grey)]">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[var(--paper-plane-grey)] inline-block" />Draft ({draftProjects})</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[var(--mustard-gold)] inline-block" />Pending ({pendingProjects})</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[var(--electric-teal)] inline-block" />Approved ({approvedProjects})</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-400 inline-block" />Rejected ({rejectedProjects})</span>
                </div>
            </div>

            {/* Two-column layout: Projects Table + Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Projects Table — 2 cols */}
                <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--ink-line)] flex items-center justify-between">
                        <h2 className="text-lg font-medium text-[var(--deep-teal)] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--electric-teal)]">folder_open</span>
                            Recent Submissions
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-[var(--paper-plane-grey)]">
                            <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Project</th>
                                    <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Author</th>
                                    <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Date</th>
                                    <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Status</th>
                                    <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--ink-line)]">
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors group">
                                        <td className="px-5 py-3">
                                            <Link href={`/ project / ${project.id} `} className="font-medium text-[var(--deep-teal)] hover:text-[var(--electric-teal)] transition-colors">
                                                {project.title}
                                            </Link>
                                            <p className="text-[10px] text-[var(--paper-plane-grey)] mt-0.5">{project.typology} • {project.location}</p>
                                        </td>
                                        <td className="px-5 py-3 text-xs">{project.author?.name || "System"}</td>
                                        <td className="px-5 py-3 text-xs">{new Date(project.createdAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline - flex items - center px - 2 py - 0.5 text - [10px] font - bold uppercase tracking - wider border ${project.status === 'APPROVED' ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' :
                                                    project.status === 'PENDING_REVIEW' ? 'border-[var(--mustard-gold)] text-[var(--mustard-gold)]' :
                                                        project.status === 'REJECTED' ? 'border-red-400 text-red-400' :
                                                            'border-[var(--paper-plane-grey)] text-[var(--paper-plane-grey)]'
                                                } `}>
                                                {project.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <Link href={`/ project / ${project.id} `} className="text-[var(--paper-plane-grey)] hover:text-[var(--electric-teal)] transition-colors p-1 inline-flex" title="View Project">
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {projects.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-8 text-center italic text-[var(--paper-plane-grey)] text-xs">No projects found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Feed — 1 col */}
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--ink-line)]">
                        <h2 className="text-lg font-medium text-[var(--deep-teal)] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--mustard-gold)]">history</span>
                            Recent Activity
                        </h2>
                    </div>
                    <div className="p-4 space-y-0 max-h-[400px] overflow-y-auto">
                        {recentFeedback.length > 0 ? recentFeedback.map((fb: any) => (
                            <div key={fb.id} className="flex gap-3 p-3 border-b border-[var(--ink-line)] last:border-0 hover:bg-[var(--platinum-sheen)]/10 transition-colors">
                                <div className="w-8 h-8 flex-shrink-0 border border-[var(--ink-line)] flex items-center justify-center bg-[var(--platinum-sheen)]/20">
                                    <span className="material-symbols-outlined text-sm text-[var(--mustard-gold)]">
                                        {fb.type === 'revision_request' ? 'rate_review' : 'comment'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[var(--deep-teal)] font-medium truncate">{fb.content.substring(0, 60)}...</p>
                                    <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1 uppercase tracking-widest">
                                        {fb.type.replace('_', ' ')} • {new Date(fb.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-6 text-center">
                                <span className="material-symbols-outlined text-3xl text-[var(--paper-plane-grey)] opacity-40 block mb-2">inbox</span>
                                <p className="text-xs text-[var(--paper-plane-grey)] italic">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ads Management Module */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                <div className="p-6 border-b border-[var(--ink-line)] flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[var(--deep-teal)] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--electric-teal)]">campaign</span>
                        Ads Management
                    </h2>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" defaultChecked />
                                <div className="block bg-neutral-700 w-10 h-6 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-[var(--drafting-white)] w-4 h-4 rounded-full transition transform translate-x-4 bg-[var(--electric-teal)]"></div>
                            </div>
                            <div className="ml-3 text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] tracking-widest">Ads Active</div>
                        </label>
                        <button className="px-3 py-1 bg-[var(--platinum-sheen)]/10 text-[var(--deep-teal)] text-[10px] uppercase tracking-widest font-bold hover:bg-[var(--platinum-sheen)]/20 transition-colors border border-[var(--ink-line)]">
                            Configure Rotation
                        </button>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-[var(--platinum-sheen)]/5 border border-[var(--ink-line)]">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Active Campaigns</p>
                        <p className="text-2xl text-[var(--deep-teal)] font-light">3</p>
                    </div>
                    <div className="p-4 bg-[var(--platinum-sheen)]/5 border border-[var(--ink-line)]">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Total Impressions</p>
                        <p className="text-2xl text-[var(--deep-teal)] font-light">12,450</p>
                    </div>
                    <div className="p-4 bg-[var(--platinum-sheen)]/5 border border-[var(--ink-line)]">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Click-Through Rate</p>
                        <p className="text-2xl text-[var(--deep-teal)] font-light">2.4%</p>
                    </div>
                    <div className="p-4 bg-[var(--platinum-sheen)]/5 border border-[var(--ink-line)]">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Placement Frequency</p>
                        <p className="text-xl text-[var(--deep-teal)] font-light mt-1">Every 3 Projects</p>
                    </div>
                </div>
            </div>
        </div >
    );
}
