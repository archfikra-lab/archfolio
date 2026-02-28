export default function SkeletonCard() {
    return (
        <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
            <div className="h-48 skeleton" />
            <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 skeleton" />
                <div className="h-3 w-1/2 skeleton" />
                <div className="space-y-2 mt-4">
                    <div className="h-3 w-full skeleton" />
                    <div className="h-3 w-5/6 skeleton" />
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--ink-line)]">
                    <div className="h-3 w-16 skeleton" />
                    <div className="h-3 w-12 skeleton" />
                </div>
            </div>
        </div>
    );
}
