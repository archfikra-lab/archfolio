'use client';

import { useState } from 'react';
import { createSubscriptionPlanAction, toggleSubscriptionPlanAction } from '@/app/actions/subscriptions';

export default function SubscriptionsClient({ initialPlans }: { initialPlans: any[] }) {
    const [plans, setPlans] = useState(initialPlans);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '0',
        downloadLimit: '0',
        features: '',
        perMonth: true,
        canDownloadHighRes: true,
        canDownloadCad: false,
        canDownloadBim: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const fd = new FormData(e.currentTarget);
        const featuresText = fd.get('features') as string;
        const featuresJson = JSON.stringify(featuresText.split('\n').filter(f => f.trim() !== ''));

        fd.set('featuresJson', featuresJson);

        const result = await createSubscriptionPlanAction(fd);
        if (result.success) {
            // Very simple optimistic update or reload
            window.location.reload();
        } else {
            alert(result.error || "Failed to create/update plan");
            setIsSubmitting(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        setPlans(plans.map(p => p.id === id ? { ...p, active: newStatus } : p));
        const result = await toggleSubscriptionPlanAction(id, newStatus);
        if (!result.success) {
            setPlans(plans); // Revert on failure
            alert(result.error);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">Manage Subscription Plans</h1>
                <p className="text-[var(--paper-plane-grey)]">Define the access tiers for users downloading case studies.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 xl:col-span-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-[var(--deep-teal)]">Create / Update Plan</h2>
                        <button
                            onClick={() => setFormData({ name: '', description: '', price: '0', downloadLimit: '0', features: '', perMonth: true, canDownloadHighRes: true, canDownloadCad: false, canDownloadBim: false })}
                            className="text-xs text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] font-bold uppercase tracking-widest border border-transparent hover:border-[var(--ink-line)] px-2 py-1"
                        >
                            Reset
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Plan Name</label>
                            <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g., Professional" className="w-full bg-transparent border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:border-[var(--mustard-gold)] outline-none" />
                            <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1">Updates existing plan if name matches.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Description</label>
                            <input name="description" value={formData.description} onChange={handleChange} type="text" placeholder="Short description..." className="w-full bg-transparent border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:border-[var(--mustard-gold)] outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Price</label>
                                <input required name="price" value={formData.price} onChange={handleChange} type="number" step="0.01" min="0" className="w-full bg-transparent border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:border-[var(--mustard-gold)] outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Download Limit</label>
                                <input required name="downloadLimit" value={formData.downloadLimit} onChange={handleChange} type="number" min="-1" className="w-full bg-transparent border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:border-[var(--mustard-gold)] outline-none" title="-1 for unlimited, 0 for none" />
                                <p className="text-[9px] text-[var(--paper-plane-grey)] mt-1">-1 = Unlimited</p>
                            </div>
                        </div>

                        {/* Functional Toggles */}
                        <div className="border border-[var(--ink-line)] p-4 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--deep-teal)] mb-3">Functional Toggles</h3>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="perMonth" checked={formData.perMonth} onChange={handleChange} className="form-checkbox text-[var(--mustard-gold)] rounded-none border-[var(--ink-line)]" />
                                <span className="text-sm font-medium text-[var(--deep-teal)]">Billed Monthly (False = Annual)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="canDownloadHighRes" checked={formData.canDownloadHighRes} onChange={handleChange} className="form-checkbox text-[var(--mustard-gold)] rounded-none border-[var(--ink-line)]" />
                                <span className="text-sm font-medium text-[var(--deep-teal)]">High-Res Image Downloads</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="canDownloadCad" checked={formData.canDownloadCad} onChange={handleChange} className="form-checkbox text-[var(--mustard-gold)] rounded-none border-[var(--ink-line)]" />
                                <span className="text-sm font-medium text-[var(--deep-teal)]">CAD Drafts (DXF / DWG)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="canDownloadBim" checked={formData.canDownloadBim} onChange={handleChange} className="form-checkbox text-[var(--mustard-gold)] rounded-none border-[var(--ink-line)]" />
                                <span className="text-sm font-medium text-[var(--deep-teal)]">BIM Geometries (Revit)</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Display Features (Text List)</label>
                            <textarea name="features" value={formData.features} onChange={handleChange} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" className="w-full bg-transparent border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:border-[var(--mustard-gold)] outline-none resize-none" rows={4}></textarea>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--deep-teal)] text-white p-3 font-bold uppercase tracking-widest text-xs hover:bg-[var(--mustard-gold)] transition-colors">
                            {isSubmitting ? 'Saving...' : 'Save Plan'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="xl:col-span-2 space-y-4">
                    {plans.length === 0 ? (
                        <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 text-center text-[var(--paper-plane-grey)]">
                            No subscription plans found. Please create the Free, Professional, and Enterprise tiers.
                        </div>
                    ) : plans.map(plan => {
                        let features: string[] = [];
                        try { features = JSON.parse(plan.featuresJson); } catch (e) { }

                        return (
                            <div key={plan.id} className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-[var(--deep-teal)] text-xl">{plan.name}</h3>
                                            <span className="bg-[var(--platinum-sheen)] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--deep-teal)]">
                                                ${plan.price} / {plan.perMonth ? 'mo' : 'yr'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--paper-plane-grey)] mb-4">{plan.description}</p>

                                        {/* Functional Status Chips */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${plan.canDownloadHighRes ? 'bg-[var(--deep-teal)]/10 text-[var(--deep-teal)] border border-[var(--deep-teal)]/20' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>High-Res</span>
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${plan.canDownloadCad ? 'bg-[var(--deep-teal)]/10 text-[var(--deep-teal)] border border-[var(--deep-teal)]/20' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>CAD (DXF/DWG)</span>
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${plan.canDownloadBim ? 'bg-[var(--deep-teal)]/10 text-[var(--deep-teal)] border border-[var(--deep-teal)]/20' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>BIM (Revit)</span>
                                        </div>

                                        <div className="text-sm border-l-2 border-[var(--mustard-gold)] pl-4 mb-4">
                                            <p className="font-bold text-[var(--deep-teal)] mb-1">
                                                Downloads: {plan.downloadLimit === -1 ? 'Unlimited' : `${plan.downloadLimit} per ${plan.perMonth ? 'month' : 'year'}`}
                                            </p>
                                            <ul className="list-disc list-inside text-[var(--paper-plane-grey)] space-y-1">
                                                {features.map((f, i) => <li key={i}>{f}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                setFormData({
                                                    name: plan.name,
                                                    description: plan.description || '',
                                                    price: plan.price.toString(),
                                                    downloadLimit: plan.downloadLimit.toString(),
                                                    features: features.join('\n'),
                                                    perMonth: plan.perMonth,
                                                    canDownloadHighRes: plan.canDownloadHighRes,
                                                    canDownloadCad: plan.canDownloadCad,
                                                    canDownloadBim: plan.canDownloadBim
                                                });
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="px-4 py-2 font-bold uppercase tracking-widest text-xs border whitespace-nowrap border-[var(--deep-teal)] text-[var(--deep-teal)] hover:bg-[var(--deep-teal)] hover:text-[var(--drafting-white)]"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(plan.id, plan.active)}
                                            className={`px-4 py-2 font-bold uppercase tracking-widest text-xs border whitespace-nowrap ${plan.active ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-[var(--mustard-gold)] text-[var(--mustard-gold)] hover:bg-[var(--mustard-gold)]/10'}`}
                                        >
                                            {plan.active ? 'Disable' : 'Enable'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
