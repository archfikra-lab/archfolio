import SkeletonCard from '@/components/SkeletonCard';

export default function ExploreLoading() {
    return (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
            <div className="mb-8">
                <div className="skeleton h-8 w-64 mb-4" />
                <div className="skeleton h-4 w-96" />
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/4 space-y-6">
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 space-y-4">
                        <div className="skeleton h-5 w-24" />
                        <div className="skeleton h-10 w-full" />
                        <div className="skeleton h-10 w-full" />
                        <div className="skeleton h-10 w-full" />
                    </div>
                </aside>
                <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
