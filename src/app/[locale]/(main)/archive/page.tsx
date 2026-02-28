import { prisma } from "@/lib/prisma";
import ArchiveClient from "./ArchiveClient";

export default async function ArchivePage() {
    const projects = await (prisma.project as any).findMany({
        where: { status: 'APPROVED' },
        orderBy: { year: 'desc' },
        include: {
            author: true,
            attachments: true,
        }
    });

    return (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10 space-y-8">
            <div className="border-b border-[var(--ink-line)] pb-8">
                <div className="inline-flex items-center gap-4 text-[var(--paper-plane-grey)] mb-4">
                    <span className="h-[1px] w-12 bg-[var(--ink-line)]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Registry // Historical Record</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-[var(--deep-teal)] tracking-tighter uppercase mb-4">
                    The <span className="italic opacity-80">Archive</span>
                </h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    A permanent record of verified architectural and engineering works — organized by era, filterable by historical significance.
                </p>
            </div>

            <ArchiveClient initialProjects={projects} />
        </div>
    );
}
