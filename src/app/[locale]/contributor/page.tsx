import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ContributorDashboard() {
    const myProjects = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { attachments: true }
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">My Works</h1>
                    <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                        Firm Portfolio Management
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button className="bg-[var(--ink-line)] text-[var(--deep-teal)] px-6 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--platinum-sheen)] transition-colors flex items-center gap-2 border border-[var(--paper-plane-grey)]/20">
                        <span className="material-symbols-outlined text-sm text-[var(--electric-teal)]">auto_awesome</span>
                        AI Assist Upload
                    </button>
                    <Link href="/contributor/submit" className="bg-[var(--electric-teal)] text-black px-6 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--drafting-white)] transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Submit New Project
                    </Link>
                </div>
            </div>

            {/* Quick Upload Section */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 border-dashed opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center min-h-[160px] cursor-pointer group hover:border-[var(--electric-teal)]/50">
                <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] group-hover:text-[var(--electric-teal)] mb-2 transition-colors">cloud_upload</span>
                    <p className="text-[var(--deep-teal)] text-sm">Drag and drop photos, CAD files, or documents here</p>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mt-2">Max 50MB per file. Supports JPG, PDF, DWG</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Published Works</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{myProjects.filter(p => p.status === 'APPROVED').length}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-2">In Review</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{myProjects.filter(p => p.status === 'PENDING_REVIEW').length}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 border-dashed">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Drafts</h3>
                    <p className="text-4xl font-light text-[var(--deep-teal)]">{myProjects.filter(p => p.status === 'DRAFT').length}</p>
                </div>
            </div>

            {/* Firm Projects Table */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                <div className="p-6 border-b border-[var(--ink-line)] flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[var(--deep-teal)]">Project Submissions</h2>
                    <span className="material-symbols-outlined text-[var(--paper-plane-grey)]">map</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--paper-plane-grey)]">
                        <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                            <tr>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]">Project Title & Attachments</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]">Location</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]">Last Updated</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]">Status</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ink-line)]">
                            {myProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[var(--deep-teal)]">
                                        <div className="flex flex-col">
                                            <Link href={`/project/${project.id}`} className="hover:text-[var(--mustard-gold)] transition-colors">{project.title}</Link>
                                            {project.attachments.length > 0 && (
                                                <span className="text-[10px] flex items-center gap-1 mt-1 text-[var(--paper-plane-grey)]"><span className="material-symbols-outlined text-[12px]">attachment</span> {project.attachments.length} files attached</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 leading-relaxed">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-[var(--paper-plane-grey)]">location_on</span>
                                            {project.location} {project.mapLink && <a href={project.mapLink} target="_blank" rel="noreferrer" className="text-[var(--electric-teal)] hover:underline ml-1 text-xs">Map</a>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{new Date(project.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${project.status === 'APPROVED' ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' :
                                            project.status === 'PENDING_REVIEW' ? 'border-[var(--mustard-gold)] text-[var(--mustard-gold)]' :
                                                'border-[var(--paper-plane-grey)] text-[var(--paper-plane-grey)]'
                                            }`}>
                                            {project.status === 'APPROVED' && <span className="material-symbols-outlined text-[12px]">check_circle</span>}
                                            {project.status === 'PENDING_REVIEW' && <span className="material-symbols-outlined text-[12px]">schedule</span>}
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors p-1" title="Edit Draft">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {myProjects.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center italic text-[var(--paper-plane-grey)] text-xs">
                                        You haven't submitted any projects yet.
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
