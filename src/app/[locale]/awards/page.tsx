export default function AwardsPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <span className="material-symbols-outlined text-6xl text-[var(--mustard-gold)] opacity-80">workspace_premium</span>
            <h1 className="text-3xl font-bold text-white tracking-tight">Archfolio Honors</h1>
            <p className="text-[var(--paper-plane-grey)] max-w-md">
                Recognizing unparalleled excellence in structural engineering and architectural theory over the past year.
            </p>
            <div className="border border-[var(--mustard-gold)] text-[var(--mustard-gold)] px-4 py-2 text-[10px] uppercase tracking-widest font-bold mt-4">
                Coming Soon
            </div>
        </div>
    );
}
