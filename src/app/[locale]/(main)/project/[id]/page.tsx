import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectViewerClient from "./ProjectViewerClient";

export default async function ProjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string, locale: string }>
}) {
    const { id, locale } = await params;
    const project: any = await prisma.project.findUnique({
        where: { id },
        include: {
            disciplines: true,
            author: true,
            attachments: true,
            prizes: {
                include: { prizeType: true }
            }
        }
    });

    if (!project) return notFound();

    // Fetch related projects (same typology, excluding current)
    const relatedProjects: any[] = await (prisma.project as any).findMany({
        where: {
            typology: project.typology,
            status: 'APPROVED',
            id: { not: project.id },
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { attachments: true },
    });

    const photos = project.attachments?.filter((a: any) => a.type === 'photo' || a.type?.startsWith('image')) || [];
    const documents = project.attachments?.filter((a: any) => a.type === 'document' || a.type === 'pdf' || a.type === 'drawing') || [];

    // Extract discipline data
    const getDiscipline = (type: string) => {
        const disc = project.disciplines?.find((d: any) => d.type === type);
        if (!disc?.contentJson) return null;
        try { return JSON.parse(disc.contentJson); } catch { return null; }
    };

    const archData = getDiscipline('Architectural');
    const structData = getDiscipline('Structural');
    const mepData = getDiscipline('MEP');
    const sustainData = getDiscipline('Sustainability');

    return (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-8 space-y-12 page-enter">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[var(--paper-plane-grey)]">
                <Link href={`/${locale}/explore`} className="hover:text-[var(--electric-teal)] transition-colors">Explore</Link>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-[var(--deep-teal)]">{project.typology}</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-[var(--deep-teal)] truncate max-w-[200px]">{project.title}</span>
            </nav>

            {/* Hero Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content — 2 cols */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Title Block */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[var(--deep-teal)] text-[var(--drafting-white)] text-[10px] uppercase tracking-widest px-3 py-1.5 font-bold">
                                {project.typology}
                            </span>
                            <span className={`text-[10px] uppercase tracking-widest px-3 py-1.5 font-bold ${project.fikraVerificationStatus === 'Verified'
                                ? 'bg-[var(--electric-teal)] text-black'
                                : 'bg-[var(--mustard-gold)] text-black'
                                }`}>
                                <span className="material-symbols-outlined text-[10px] mr-1">verified</span>
                                {project.fikraVerificationStatus || 'Pending'}
                            </span>
                            {project.year && (
                                <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">
                                    EST. {project.year}
                                </span>
                            )}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light text-[var(--deep-teal)] tracking-tighter uppercase leading-none mb-4">
                            {project.title}
                        </h1>
                        <div className="flex items-center gap-6 text-sm text-[var(--paper-plane-grey)]">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {project.location}
                            </span>
                            {project.author && (
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    {project.author.name || project.author.email}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Hero Image */}
                    {photos.length > 0 ? (
                        <div className="relative overflow-hidden border border-[var(--ink-line)] group">
                            <img
                                src={photos[0].url}
                                alt={project.title}
                                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                <p className="text-white text-sm font-medium">{photos[0].description || project.title}</p>
                            </div>
                            {photos.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-3 py-1.5 backdrop-blur-sm font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-[10px] mr-1">photo_library</span>
                                    {photos.length} Photos
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-[400px] border-2 border-dashed border-[var(--ink-line)] flex items-center justify-center bg-[var(--card-bg)]">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-5xl text-[var(--paper-plane-grey)] opacity-30 mb-3 block">image</span>
                                <p className="text-[var(--paper-plane-grey)] text-sm">No images uploaded yet</p>
                            </div>
                        </div>
                    )}

                    {/* Photo Gallery Thumbnails */}
                    {photos.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                            {photos.slice(1, 5).map((photo: any, i: number) => (
                                <div key={photo.id || i} className="aspect-square overflow-hidden border border-[var(--ink-line)] group/thumb cursor-pointer">
                                    <img
                                        src={photo.url}
                                        alt={photo.description || `Photo ${i + 2}`}
                                        className="w-full h-full object-cover opacity-70 group-hover/thumb:opacity-100 grayscale group-hover/thumb:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    {project.shortDescription && (
                        <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-[var(--electric-teal)]">description</span>
                                Project Overview
                            </h3>
                            <p className="text-[var(--deep-teal)] leading-relaxed">{project.shortDescription}</p>
                        </div>
                    )}

                    {/* Disciplines Tabs */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--deep-teal)] border-b border-[var(--ink-line)] pb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--mustard-gold)]">layers</span>
                            Technical Analysis
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {archData && (
                                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 hover-lift transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 border-2 border-[var(--deep-teal)] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[var(--deep-teal)]">apartment</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-tight text-[var(--deep-teal)]">Architectural</h4>
                                            <p className="text-[9px] uppercase tracking-widest text-[var(--paper-plane-grey)]">Skin & Soul</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {archData.materiality && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">Materiality:</strong> <span className="block mt-1">{archData.materiality}</span></p>}
                                        {archData.description && <p className="text-[var(--deep-teal)]/80 text-sm mt-3 line-clamp-4">{archData.description}</p>}
                                    </div>
                                </div>
                            )}
                            {structData && (
                                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 hover-lift transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 border-2 border-[var(--electric-teal)] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[var(--electric-teal)]">foundation</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-tight text-[var(--deep-teal)]">Structural</h4>
                                            <p className="text-[9px] uppercase tracking-widest text-[var(--paper-plane-grey)]">Lines & Systems</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {structData.systemType && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">System:</strong> <span className="block mt-1">{structData.systemType}</span></p>}
                                        {structData.foundation && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">Foundation:</strong> <span className="block mt-1">{structData.foundation}</span></p>}
                                        {structData.loadCapacity && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">Load Capacity:</strong> <span className="block mt-1">{structData.loadCapacity}</span></p>}
                                    </div>
                                </div>
                            )}
                            {mepData && (
                                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 hover-lift transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 border-2 border-[var(--mustard-gold)] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[var(--mustard-gold)]">hvac</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-tight text-[var(--deep-teal)]">MEP</h4>
                                            <p className="text-[9px] uppercase tracking-widest text-[var(--paper-plane-grey)]">Circulation & Nerve</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {mepData.hvacSystem && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">HVAC:</strong> <span className="block mt-1">{mepData.hvacSystem}</span></p>}
                                        {mepData.powerLoad && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">Power Load:</strong> <span className="block mt-1">{mepData.powerLoad}</span></p>}
                                        {mepData.plumbing && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">Plumbing:</strong> <span className="block mt-1">{mepData.plumbing}</span></p>}
                                    </div>
                                </div>
                            )}
                            {sustainData && (
                                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 hover-lift transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 border-2 border-green-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-green-600">eco</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-tight text-[var(--deep-teal)]">Sustainability</h4>
                                            <p className="text-[9px] uppercase tracking-widest text-[var(--paper-plane-grey)]">Context & Timeline</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {sustainData.rating && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">Rating:</strong> <span className="block mt-1">{sustainData.rating}</span></p>}
                                        {sustainData.energyPerformance && <p><strong className="text-[var(--paper-plane-grey)] text-[10px] uppercase tracking-widest">Energy:</strong> <span className="block mt-1">{sustainData.energyPerformance}</span></p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documents */}
                    {documents.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--deep-teal)] border-b border-[var(--ink-line)] pb-3 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--electric-teal)]">folder_open</span>
                                Attached Documents ({documents.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {documents.map((doc: any, i: number) => (
                                    <a key={doc.id || i} href={doc.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-[var(--card-bg)] border border-[var(--ink-line)] hover:border-[var(--electric-teal)] transition-colors group">
                                        <span className="material-symbols-outlined text-2xl text-[var(--paper-plane-grey)] group-hover:text-[var(--electric-teal)] transition-colors">
                                            {doc.type === 'pdf' ? 'picture_as_pdf' : doc.type === 'drawing' ? 'draw' : 'description'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[var(--deep-teal)] truncate">{doc.description || `Document ${i + 1}`}</p>
                                            <p className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest">{doc.type}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-sm text-[var(--paper-plane-grey)]">open_in_new</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ProjectViewerClient fallback */}
                    <ProjectViewerClient project={project} isLoggedIn={false} />
                </div>

                {/* Sidebar — 1 col */}
                <aside className="space-y-6">
                    {/* Quick Info Card */}
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 sticky top-24">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-4 pb-3 border-b border-[var(--ink-line)]">
                            Project Specifications
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Location</span>
                                <span className="text-sm text-[var(--deep-teal)] font-medium">{project.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Year</span>
                                <span className="text-sm text-[var(--deep-teal)] font-medium">{project.year || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Typology</span>
                                <span className="text-sm text-[var(--deep-teal)] font-medium">{project.typology}</span>
                            </div>
                            {project.architecturalStyle && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Style</span>
                                    <span className="text-sm text-[var(--deep-teal)] font-medium">{project.architecturalStyle}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Status</span>
                                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 font-bold ${project.status === 'APPROVED' ? 'bg-[var(--electric-teal)] text-black' :
                                    project.status === 'PENDING_REVIEW' ? 'bg-[var(--mustard-gold)] text-black' :
                                        'bg-[var(--paper-plane-grey)] text-white'
                                    }`}>
                                    {project.status?.replace('_', ' ')}
                                </span>
                            </div>
                            {project.prizes && project.prizes.length > 0 && (
                                <div className="flex justify-between items-start gap-4">
                                    <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Prizes</span>
                                    <div className="flex flex-col gap-1 items-end">
                                        {project.prizes.map((p: any) => (
                                            <span key={p.id} className="text-xs text-[var(--mustard-gold)] font-bold">{p.prizeType.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Photos</span>
                                <span className="text-sm text-[var(--deep-teal)] font-medium">{photos.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold">Documents</span>
                                <span className="text-sm text-[var(--deep-teal)] font-medium">{documents.length}</span>
                            </div>
                        </div>

                        {/* Share buttons */}
                        <div className="mt-6 pt-4 border-t border-[var(--ink-line)]">
                            <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold mb-3">Share Project</p>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 border border-[var(--ink-line)] text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] hover:border-[var(--deep-teal)] transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">content_copy</span>
                                    Copy
                                </button>
                                <button className="flex-1 py-2 border border-[var(--ink-line)] text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] hover:border-[var(--deep-teal)] transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                    Email
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Author Card */}
                    {project.author && (
                        <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-4 pb-3 border-b border-[var(--ink-line)]">
                                Author
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[var(--deep-teal)] flex items-center justify-center text-[var(--drafting-white)] text-xl font-bold">
                                    {(project.author.name || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--deep-teal)]">{project.author.name || 'Anonymous'}</p>
                                    <p className="text-xs text-[var(--paper-plane-grey)]">{project.author.email}</p>
                                </div>
                            </div>
                            <Link href={`/${locale}/explore?author=${project.author.id}`} className="mt-4 w-full block text-center text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] hover:text-[var(--deep-teal)] transition-colors py-2 border border-[var(--ink-line)] hover:border-[var(--electric-teal)]">
                                View All Projects →
                            </Link>
                        </div>
                    )}

                    {/* Reviews Summary */}
                    {project.reviews?.length > 0 && (
                        <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-4 pb-3 border-b border-[var(--ink-line)]">
                                Review Notes ({project.reviews.length})
                            </h3>
                            <div className="space-y-3">
                                {project.reviews.map((review: any) => (
                                    <div key={review.id} className="border-l-2 border-[var(--electric-teal)] pl-3 py-1">
                                        <p className="text-xs text-[var(--deep-teal)] line-clamp-2">{review.comment || 'No comment'}</p>
                                        <p className="text-[9px] text-[var(--paper-plane-grey)] mt-1">
                                            {review.reviewer?.name || 'Reviewer'} · {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
                <section className="border-t border-[var(--ink-line)] pt-12">
                    <h3 className="text-2xl font-light uppercase tracking-widest text-[var(--deep-teal)] mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-[var(--mustard-gold)]">auto_awesome</span>
                        Related Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedProjects.map((rp: any) => {
                            const rpImg = rp.attachments?.find((a: any) => a.type === 'photo' || a.type?.startsWith('image'));
                            return (
                                <Link key={rp.id} href={`/${locale}/project/${rp.id}`}
                                    className="group bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden hover:border-[var(--electric-teal)] transition-colors hover-lift">
                                    <div className="h-48 overflow-hidden">
                                        {rpImg?.url ? (
                                            <img src={rpImg.url} alt={rp.title}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[var(--platinum-sheen)]/10">
                                                <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] opacity-20">domain</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h4 className="text-lg font-medium text-[var(--deep-teal)] group-hover:text-[var(--electric-teal)] transition-colors mb-1 truncate">{rp.title}</h4>
                                        <p className="text-xs text-[var(--paper-plane-grey)] flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">location_on</span>
                                            {rp.location}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
