import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function CollaboratorDashboard() {
    const myProjects = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" }
    });

    return (
        <>
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-white dark:bg-[#1a180c] sketch-border">
                <div className="max-w-md">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2">Create a New Engineering Case Study</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Document your latest architectural breakthrough with our structured drafting tools.</p>
                </div>
                <Link href="/en/contributor/submit" className="flex items-center justify-center gap-3 bg-[#dab80b] hover:bg-[#dab80b]/90 text-slate-900 px-8 py-5 rounded-2xl font-black text-lg transition-transform active:scale-95 shadow-lg shadow-[#dab80b]/20 whitespace-nowrap">
                    <span className="material-symbols-outlined text-2xl">add_circle</span>
                    <span>START NEW DRAFT</span>
                </Link>
            </section>

            <section>
                <div className="flex items-center justify-between mb-6 ink-line pb-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#dab80b]">pending_actions</span>
                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Active Drafts</h3>
                    </div>
                    <Link className="text-sm font-bold text-[#dab80b] hover:underline" href="/en/explore">View All</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Draft Item */}
                    <div className="group relative bg-white dark:bg-[#1a180c] rounded-2xl overflow-hidden sketch-border transition-all hover:-translate-y-1">
                        <div className="h-40 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #dab80b 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Draft sketch" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMaQwqsldnNRxPLrHRE1YLAXGL4A8LptkWcz_8kq8MEFK8AKuLeK4SZRYxwGl5atXM_vVEuzQE4OUwHlysJfCD70gPmpxsWyxbNzJdnnp4PBZED9006Uzn2MNk-15BWIG4d3N3iL560nwXITsX83g3330AKLZ1c9KbZScOGLTE4W_JzETi5LhsClsJZPKs7hGrItIloCtHvkSskDpPtzPhov1RzW3j5eDxyKpJkj0zZ9lygit1DBT4Bqjk5Uvggro5Eup4FBqu3Smc" />
                            <span className="absolute top-3 left-3 bg-[#dab80b] text-slate-900 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">Drafting</span>
                        </div>
                        <div className="p-5">
                            <h4 className="font-black text-lg mb-1 leading-tight text-slate-900 dark:text-white">Metropolitan Library Annex</h4>
                            <p className="text-xs text-slate-400 mb-4 font-medium italic">Last edited 2 hours ago</p>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1a180c] bg-slate-200"></div>
                                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1a180c] bg-[#dab80b] flex items-center justify-center text-[10px] font-bold text-slate-900">+2</div>
                                </div>
                                <button className="text-[#dab80b] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    Edit <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Real Data Projects */}
                    {myProjects.length > 0 ? myProjects.map((project) => (
                        <div key={project.id} className="group relative bg-white dark:bg-[#1a180c] rounded-2xl overflow-hidden sketch-border transition-all hover:-translate-y-1">
                            <div className="h-40 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                                    <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                                </div>
                                <span className={`absolute top-3 left-3 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${project.fikraVerificationStatus === 'APPROVED' ? 'bg-green-600' : project.fikraVerificationStatus === 'PENDING_REVIEW' ? 'bg-orange-500' : 'bg-slate-900 dark:bg-slate-600'}`}>
                                    {project.fikraVerificationStatus.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="p-5">
                                <h4 className="font-black text-lg mb-1 leading-tight text-slate-900 dark:text-white truncate" title={project.title}>{project.title}</h4>
                                <p className="text-xs text-slate-400 mb-4 font-medium italic">Submitted {new Date(project.createdAt).toLocaleDateString()}</p>
                                <div className="flex items-center justify-between">
                                    {project.fikraVerificationStatus === 'PENDING_REVIEW' ? (
                                        <div className="flex items-center gap-2 text-[#dab80b]">
                                            <span className="material-symbols-outlined text-sm">mark_email_unread</span>
                                            <span className="text-[10px] font-bold uppercase truncate">In Queue</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            <span className="text-[10px] font-bold uppercase truncate">Verified</span>
                                        </div>
                                    )}
                                    <Link href={`/en/project/${project.id}`} className="text-slate-400 text-sm font-bold flex items-center gap-1 hover:text-[#dab80b] transition-colors whitespace-nowrap">
                                        Details <span className="material-symbols-outlined text-sm">info</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : null}

                    <Link href="/en/contributor/submit" className="group relative bg-white dark:bg-[#1a180c] rounded-2xl border-2 border-dashed border-[#dab80b]/20 flex flex-col items-center justify-center p-10 hover:bg-[#dab80b]/5 transition-colors cursor-pointer min-h-[250px]">
                        <span className="material-symbols-outlined text-[#dab80b] text-4xl mb-2">note_add</span>
                        <p className="text-sm font-black text-[#dab80b] uppercase">Quick Draft</p>
                    </Link>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-6 ink-line pb-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#dab80b]">hub</span>
                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Shared Engineering Projects</h3>
                    </div>
                    <span className="bg-[#dab80b]/20 text-[#dab80b] text-[10px] font-black px-3 py-1 rounded-full uppercase">Global Team Access</span>
                </div>
                <div className="bg-white dark:bg-[#1a180c] rounded-2xl sketch-border divide-y divide-[#dab80b]/10 overflow-hidden">
                    <div className="flex items-center p-6 hover:bg-[#dab80b]/5 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#dab80b] border border-[#dab80b]/20">
                            <span className="material-symbols-outlined">foundation</span>
                        </div>
                        <div className="ml-4 flex-1">
                            <h5 className="font-black text-slate-900 dark:text-white">Bridge Infrastructure 2024</h5>
                            <p className="text-xs text-slate-500 font-medium italic">Civil Engineering Dept • 12 Active Contributors</p>
                        </div>
                        <div className="hidden md:flex gap-4 items-center">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Stability Index</p>
                                <p className="text-sm font-black text-green-600">98.4% PASS</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">chevron_right</span>
                        </div>
                    </div>
                    <div className="flex items-center p-6 hover:bg-[#dab80b]/5 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#dab80b] border border-[#dab80b]/20">
                            <span className="material-symbols-outlined">bolt</span>
                        </div>
                        <div className="ml-4 flex-1">
                            <h5 className="font-black text-slate-900 dark:text-white">Solar Grid Integration - Sector 7</h5>
                            <p className="text-xs text-slate-500 font-medium italic">Energy Solutions • 4 Active Contributors</p>
                        </div>
                        <div className="hidden md:flex gap-4 items-center">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Deadline</p>
                                <p className="text-sm font-black text-[#dab80b] uppercase">14 Days Left</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">chevron_right</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
