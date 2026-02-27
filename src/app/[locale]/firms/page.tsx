import { prisma } from "@/lib/prisma";

export default async function FirmsDirectoryPage() {
    const firms = await prisma.user.findMany({
        where: { role: 'CONTRIBUTOR' },
        include: {
            authoredProjects: {
                where: { status: 'APPROVED' }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-[var(--deep-teal)] mb-2 tracking-tight">Architectural Firms</h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    The innovative studios and practices driving modern architectural design on Archfolio.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {firms.map(firm => (
                    <div key={firm.id} className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 hover:border-[var(--electric-teal)]/30 transition-colors">
                        <div className="w-12 h-12 bg-[var(--platinum-sheen)]/10 rounded-sm flex items-center justify-center mb-4 border border-[var(--ink-line)]">
                            <span className="material-symbols-outlined text-[var(--paper-plane-grey)]">business</span>
                        </div>
                        <h3 className="text-[var(--deep-teal)] font-medium mb-1 truncate" title={firm.name}>{firm.name}</h3>
                        <p className="text-[10px] text-[var(--paper-plane-grey)] font-mono truncate">{firm.email}</p>

                        <div className="mt-6 pt-4 border-t border-[var(--ink-line)] flex items-center justify-between">
                            <span className="text-xs text-[var(--paper-plane-grey)]">Verified Projects</span>
                            <span className="text-[var(--deep-teal)] font-bold">{firm.authoredProjects.length}</span>
                        </div>
                    </div>
                ))}
            </div>

            {firms.length === 0 && (
                <div className="py-20 text-center border border-[var(--ink-line)] border-dashed bg-[var(--card-bg)]">
                    <p className="text-[var(--paper-plane-grey)]">No firms registered yet.</p>
                </div>
            )}
        </div>
    );
}
