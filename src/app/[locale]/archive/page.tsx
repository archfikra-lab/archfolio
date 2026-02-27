export default function ArchivePage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <span className="material-symbols-outlined text-6xl text-[var(--paper-plane-grey)] opacity-50">inventory_2</span>
            <h1 className="text-3xl font-bold text-white tracking-tight">The Archfolio Archive</h1>
            <p className="text-[var(--paper-plane-grey)] max-w-md">
                A historical record of all verified projects, filterable strictly by decade and historical significance. Currently under construction.
            </p>
            <div className="border border-[var(--electric-teal)] text-[var(--electric-teal)] px-4 py-2 text-[10px] uppercase tracking-widest font-bold mt-4">
                Coming Soon
            </div>
        </div>
    );
}
