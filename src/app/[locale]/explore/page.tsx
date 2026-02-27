import { prisma } from "@/lib/prisma";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage() {
    const projects = await prisma.project.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            location: true,
            typology: true,
            latitude: true,
            longitude: true,
            shortDescription: true,
            architecturalStyle: true,
            year: true,
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-[var(--deep-teal)] mb-2 tracking-tight">Explore Architecture</h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest max-w-2xl">
                    Discover verified structural and theoretical projects from leading firms across the globe.
                </p>
            </div>

            <ExploreClient initialProjects={projects} />
        </div>
    );
}
