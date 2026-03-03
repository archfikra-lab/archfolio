'use client';

import { useState } from 'react';
import { createPrizeAction, togglePrizeStatusAction } from '@/app/actions/prizes';

export default function PrizesClient({ initialPrizes }: { initialPrizes: any[] }) {
    const [prizes, setPrizes] = useState(initialPrizes);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const fd = new FormData(e.currentTarget);
        const name = fd.get('name') as string;
        const description = fd.get('description') as string;

        const result = await createPrizeAction(name, description);
        if (result.success) {
            // Optimistic update
            setPrizes([{ id: Date.now().toString(), name, description, active: true }, ...prizes]);
            (e.target as HTMLFormElement).reset();
        } else {
            alert(result.error || "Failed to create prize");
        }
        setIsSubmitting(false);
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        setPrizes(prizes.map(p => p.id === id ? { ...p, active: newStatus } : p));
        const result = await togglePrizeStatusAction(id, newStatus);
        if (!result.success) {
            setPrizes(prizes); // Revert on failure
            alert(result.error);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">Manage Prizes</h1>
                <p className="text-[var(--paper-plane-grey)]">Create and manage architectural awards and prizes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                    <h2 className="text-xl font-medium text-[var(--deep-teal)] mb-6">Create New Prize</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Name</label>
                            <input required name="name" type="text" placeholder="e.g., Arab Architects Awards" className="w-full bg-transparent border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:border-[var(--mustard-gold)] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Description</label>
                            <textarea name="description" placeholder="Short description..." className="w-full bg-transparent border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:border-[var(--mustard-gold)] outline-none resize-none" rows={3}></textarea>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--deep-teal)] text-white p-3 font-bold uppercase tracking-widest text-xs hover:bg-[var(--mustard-gold)] transition-colors">
                            {isSubmitting ? 'Creating...' : 'Create Prize'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {prizes.length === 0 ? (
                        <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 text-center text-[var(--paper-plane-grey)]">
                            No prizes found.
                        </div>
                    ) : prizes.map(prize => (
                        <div key={prize.id} className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-[var(--deep-teal)] text-lg mb-1">{prize.name}</h3>
                                <p className="text-sm text-[var(--paper-plane-grey)]">{prize.description}</p>
                            </div>
                            <button
                                onClick={() => toggleStatus(prize.id, prize.active)}
                                className={`px-4 py-2 font-bold uppercase tracking-widest text-xs border ${prize.active ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-[var(--mustard-gold)] text-[var(--mustard-gold)] hover:bg-[var(--mustard-gold)]/10'}`}
                            >
                                {prize.active ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
