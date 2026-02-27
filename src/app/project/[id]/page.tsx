import { PrismaClient } from '@prisma/client';
import ProjectViewer from '@/components/ProjectViewer';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const p = await params;

    const project = await prisma.project.findUnique({
        where: { id: p.id },
        include: { disciplines: true }
    });

    if (!project) return notFound();

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>←</span> Back to Archive
                </Link>
            </div>
            <ProjectViewer project={project} />
        </div>
    );
}
