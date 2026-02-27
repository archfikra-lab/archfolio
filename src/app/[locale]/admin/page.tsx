import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
    const totalProjects = await prisma.project.count();
    const pendingProjects = await prisma.project.count({
        where: { status: "PENDING_REVIEW" },
    });

    const projects = await prisma.project.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
            author: true,
            reviewer: true,
        }
    });

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Platform Overview</h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                    System Analytics and Moderation
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Total Submissions</h3>
                    <p className="text-4xl font-light text-white">{totalProjects}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)]/50 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-[var(--mustard-gold)]/10 text-[var(--mustard-gold)]">
                        <span className="material-symbols-outlined text-sm">pending_actions</span>
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-2">Awaiting Expert Review</h3>
                    <p className="text-4xl font-light text-white">{pendingProjects}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Active Users</h3>
                    <p className="text-4xl font-light text-white">--</p>
                    <p className="text-[10px] text-[var(--paper-plane-grey)] mt-2 italic">Analytics syncing...</p>
                </div>
            </div>

            {/* Ads Management Module */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                <div className="p-6 border-b border-[var(--ink-line)] flex items-center justify-between">
                    <h2 className="text-lg font-medium text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--electric-teal)]">campaign</span>
                        Ads Management
                    </h2>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" defaultChecked />
                                <div className="block bg-neutral-700 w-10 h-6 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4 bg-[var(--electric-teal)]"></div>
                            </div>
                            <div className="ml-3 text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] tracking-widest">
                                Ads Active
                            </div>
                        </label>
                        <button className="px-3 py-1 bg-[var(--platinum-sheen)]/10 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[var(--platinum-sheen)]/20 transition-colors border border-[var(--ink-line)]">
                            Configure Rotation
                        </button>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-[var(--platinum-sheen)]/5 border border-[var(--ink-line)]">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Active Campaigns</p>
                        <p className="text-2xl text-white font-light">3</p>
                    </div>
                    <div className="p-4 bg-[var(--platinum-sheen)]/5 border border-[var(--ink-line)]">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Total Impressions</p>
                        <p className="text-2xl text-white font-light">12,450</p>
                    </div>
                    <div className="p-4 bg-[var(--platinum-sheen)]/5 border border-[var(--ink-line)]">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Click-Through Rate</p>
                        <p className="text-2xl text-white font-light">2.4%</p>
                    </div>
                    <div className="p-4 bg-[var(--platinum-sheen)]/5 border border-[var(--ink-line)]">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Placement Frequency</p>
                        <p className="text-xl text-white font-light mt-1 text-sm">Every 3 Projects</p>
                    </div>
                </div>
            </div>

            {/* Recent Projects Table */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                <div className="p-6 border-b border-[var(--ink-line)] flex items-center justify-between">
                    <h2 className="text-lg font-medium text-white">Recent Project Submissions</h2>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] hover:text-white transition-colors flex items-center gap-1">
                        View All <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--paper-plane-grey)]">
                        <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                            <tr>
                                <th className="px-6 py-4 font-medium text-white/80">Project Title</th>
                                <th className="px-6 py-4 font-medium text-white/80">Author</th>
                                <th className="px-6 py-4 font-medium text-white/80">Submitted</th>
                                <th className="px-6 py-4 font-medium text-white/80">Status</th>
                                <th className="px-6 py-4 font-medium text-white/80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ink-line)]">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                                    <td className="px-6 py-4">{project.author?.name || "System Import"}</td>
                                    <td className="px-6 py-4">{new Date(project.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${project.status === 'APPROVED' ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' :
                                            project.status === 'PENDING_REVIEW' ? 'border-[var(--mustard-gold)] text-[var(--mustard-gold)]' :
                                                'border-[var(--paper-plane-grey)] text-[var(--paper-plane-grey)]'
                                            }`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)] transition-colors p-1" title="Manage">
                                            <span className="material-symbols-outlined text-sm">settings</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center italic text-[var(--paper-plane-grey)] text-xs">
                                        No projects found in the system.
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
