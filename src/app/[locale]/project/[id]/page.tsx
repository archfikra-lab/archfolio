import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            author: true,
            reviewer: true,
            disciplines: true,
            attachments: true
        }
    });

    if (!project) return notFound();

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 mt-10">
            {/* Header Area */}
            <header className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${project.status === 'APPROVED' ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' :
                        project.status === 'PENDING_REVIEW' ? 'border-[var(--mustard-gold)] text-[var(--mustard-gold)]' :
                            'border-[var(--paper-plane-grey)] text-[var(--paper-plane-grey)]'
                        }`}>
                        {project.status === 'APPROVED' && <span className="material-symbols-outlined text-[12px]">check_circle</span>}
                        {project.status === 'PENDING_REVIEW' && <span className="material-symbols-outlined text-[12px]">schedule</span>}
                        {project.status.replace('_', ' ')}
                    </span>
                    <span className="text-[var(--paper-plane-grey)] text-sm">{project.typology} / {project.year}</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-[var(--deep-teal)] tracking-tight">{project.title}</h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--paper-plane-grey)] pt-4 border-t border-[var(--ink-line)]">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">business</span>
                        <span className="text-[var(--deep-teal)]">{project.author?.name || "Unknown Firm"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">location_on</span>
                        <span>{project.location}</span>
                        {project.mapLink && (
                            <a href={project.mapLink} target="_blank" rel="noreferrer" className="text-[var(--electric-teal)] hover:underline ml-1">View Map</a>
                        )}
                    </div>
                </div>
            </header>

            {/* Description */}
            <section className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--platinum-sheen)]/5 transform translate-x-16 -translate-y-16 rounded-full blur-2xl pointer-events-none"></div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-4">Project Synopsis</h2>
                <p className="text-lg lg:text-xl text-[var(--deep-teal)]/90 leading-relaxed font-light">
                    {project.shortDescription || "No synopsis provided for this project."}
                </p>
            </section>

            {/* Disciplines & Attachments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-medium text-[var(--deep-teal)] flex items-center gap-2 border-b border-[var(--ink-line)] pb-4">
                        <span className="material-symbols-outlined text-[var(--mustard-gold)]">engineering</span>
                        Technical Disciplines
                    </h2>
                    <div className="space-y-4">
                        {project.disciplines.map(disc => (
                            <div key={disc.id} className="border border-[var(--ink-line)] bg-[var(--card-bg)] p-6">
                                <h3 className="text-sm font-bold text-[var(--deep-teal)] uppercase tracking-widest mb-3">{disc.type}</h3>
                                <pre className="text-xs text-[var(--paper-plane-grey)] font-mono overflow-auto bg-[var(--midnight-charcoal)] p-4 border border-[var(--ink-line)]/50">
                                    {JSON.stringify(JSON.parse(disc.contentJson), null, 2)}
                                </pre>
                            </div>
                        ))}
                        {project.disciplines.length === 0 && (
                            <p className="text-[var(--paper-plane-grey)] italic text-sm">No technical disciplines recorded.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-medium text-[var(--deep-teal)] flex items-center gap-2 border-b border-[var(--ink-line)] pb-4">
                        <span className="material-symbols-outlined text-[var(--electric-teal)]">folder_open</span>
                        Project Attachments
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {project.attachments.map(att => (
                            <a href={att.url} target="_blank" rel="noreferrer" key={att.id} className="border border-[var(--ink-line)] bg-[var(--card-bg)] p-4 hover:border-[var(--electric-teal)] transition-colors group flex flex-col justify-between aspect-square">
                                <span className={`material-symbols-outlined text-4xl mb-4 ${att.type === 'photo' ? 'text-[var(--mustard-gold)]' : 'text-[var(--paper-plane-grey)]'} group-hover:scale-110 transition-transform`}>
                                    {att.type === 'photo' ? 'image' : att.type === 'cad' ? 'architecture' : 'description'}
                                </span>
                                <div>
                                    <p className="text-[var(--deep-teal)] text-sm font-medium truncate" title={att.description || "Attachment"}>{att.description || "Untitled File"}</p>
                                    <p className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest mt-1">{att.type}</p>
                                </div>
                            </a>
                        ))}
                        {project.attachments.length === 0 && (
                            <p className="text-[var(--paper-plane-grey)] italic text-sm col-span-2">No attachments available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviewer Info */}
            {project.reviewer && (
                <div className="mt-12 pt-8 border-t border-[var(--ink-line)] flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-full bg-[var(--platinum-sheen)]/10 flex items-center justify-center border border-[var(--ink-line)]">
                        <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-lg">verified_user</span>
                    </div>
                    <div>
                        <p className="text-[var(--deep-teal)] font-medium">Verified by: {project.reviewer.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] border border-[var(--ink-line)] inline-block px-1.5 mt-1 rounded-sm">expert reviewer</p>
                    </div>
                </div>
            )}
        </div>
    );
}
