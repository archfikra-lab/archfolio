import { prisma } from "@/lib/prisma";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage() {
    const projects = await (prisma.project as any).findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: "desc" },
        include: {
            attachments: true,
        }
    });

    // Stats
    const totalApproved = projects.length;
    const typologies = [...new Set(projects.map((p: any) => p.typology))].filter(Boolean);
    const locations = [...new Set(projects.map((p: any) => p.location))].filter(Boolean);
    const withImages = projects.filter((p: any) => p.attachments?.some((a: any) => a.type === 'photo' || a.type?.startsWith('image'))).length;

    return (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10 space-y-8 page-enter">
            {/* Rich Header */}
            <div className="border-b border-[var(--ink-line)] pb-8">
                <div className="inline-flex items-center gap-4 text-[var(--paper-plane-grey)] mb-4">
                    <span className="h-[1px] w-12 bg-[var(--ink-line)]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Archive // Global Registry</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-[var(--deep-teal)] tracking-tighter uppercase leading-none mb-4">
                    Explore <span className="italic opacity-80">Architecture</span>
                </h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    Discover verified structural and theoretical projects from leading studios across the globe.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 text-center">
                    <p className="text-3xl font-black text-[var(--deep-teal)]">{totalApproved}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Published Projects</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 text-center">
                    <p className="text-3xl font-black text-[var(--electric-teal)]">{typologies.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Typologies</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 text-center">
                    <p className="text-3xl font-black text-[var(--mustard-gold)]">{locations.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">Locations</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 text-center">
                    <p className="text-3xl font-black text-[var(--deep-teal)]">{withImages}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-1">With Photos</p>
                </div>
            </div>

            <ExploreClient initialProjects={projects} />
        </div>
    );
}
