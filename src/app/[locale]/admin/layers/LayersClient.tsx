'use client';

import { useState } from 'react';
import { AnalyticalLayer } from '@prisma/client';
import { createLayer, updateLayer, deleteLayer } from '@/app/actions/layers';

export default function LayersClient({ initialLayers }: { initialLayers: AnalyticalLayer[] }) {
    const [layers, setLayers] = useState<AnalyticalLayer[]>(initialLayers);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        icon: 'apartment',
        titleEn: '', titleAr: '',
        subtitleEn: '', subtitleAr: '',
        descEn: '', descAr: '',
        color: 'var(--deep-teal)',
        order: 0,
        active: true
    });

    const resetForm = () => {
        setFormData({
            icon: 'apartment', titleEn: '', titleAr: '', subtitleEn: '', subtitleAr: '', descEn: '', descAr: '', color: 'var(--deep-teal)', order: 0, active: true
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (layer: AnalyticalLayer) => {
        setFormData({
            icon: layer.icon,
            titleEn: layer.titleEn, titleAr: layer.titleAr,
            subtitleEn: layer.subtitleEn, subtitleAr: layer.subtitleAr,
            descEn: layer.descEn, descAr: layer.descAr,
            color: layer.color, order: layer.order, active: layer.active
        });
        setEditingId(layer.id);
        setIsAdding(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                const res = await updateLayer(editingId, formData);
                if (res.success && res.layer) {
                    setLayers(layers.map(l => l.id === editingId ? res.layer : l) as AnalyticalLayer[]);
                }
            } else {
                const res = await createLayer(formData);
                if (res.success && res.layer) {
                    setLayers([...layers, res.layer] as AnalyticalLayer[]);
                }
            }
            resetForm();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this layer?')) return;
        setLoading(true);
        const res = await deleteLayer(id);
        if (res.success) {
            setLayers(layers.filter(l => l.id !== id));
        }
        setLoading(false);
    };

    const toggleActive = async (id: string, current: boolean) => {
        setLoading(true);
        const res = await updateLayer(id, { active: !current });
        if (res.success && res.layer) {
            setLayers(layers.map(l => l.id === id ? res.layer : l) as AnalyticalLayer[]);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            {!isAdding && !editingId && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="chalk-btn px-6 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add New Layer
                </button>
            )}

            {(isAdding || editingId) && (
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-6 chalk-border animate-[fadeInUp_0.3s_ease]">
                    <h2 className="text-xl font-black uppercase tracking-tight text-[var(--deep-teal)] mb-6 border-b border-[var(--ink-line)] pb-2">
                        {editingId ? 'Edit Layer' : 'Create New Layer'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Title (EN)</label>
                                <input type="text" required value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)]" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Title (AR)</label>
                                <input type="text" required value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)] text-right" dir="rtl" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Subtitle (EN)</label>
                                <input type="text" required value={formData.subtitleEn} onChange={e => setFormData({ ...formData, subtitleEn: e.target.value })} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)]" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Subtitle (AR)</label>
                                <input type="text" required value={formData.subtitleAr} onChange={e => setFormData({ ...formData, subtitleAr: e.target.value })} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)] text-right" dir="rtl" />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Description (EN)</label>
                                <textarea required value={formData.descEn} onChange={e => setFormData({ ...formData, descEn: e.target.value })} rows={3} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)]"></textarea>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Description (AR)</label>
                                <textarea required value={formData.descAr} onChange={e => setFormData({ ...formData, descAr: e.target.value })} rows={3} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)] text-right" dir="rtl"></textarea>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Icon (Material Symbols)</label>
                                <input type="text" required value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)]" placeholder="e.g., apartment, eco, hvac" />
                                <span className="material-symbols-outlined mt-2 text-2xl">{formData.icon}</span>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Theme Color (CSS Var / Hex)</label>
                                <input type="text" required value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)]" placeholder="var(--deep-teal)" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Sort Order</label>
                                <input type="number" required value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full bg-transparent border border-[var(--ink-line)] p-2 text-sm focus:outline-none focus:border-[var(--electric-teal)]" />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-[var(--ink-line)]">
                            <button type="submit" disabled={loading} className="chalk-btn px-6 py-2 bg-[var(--deep-teal)] text-[var(--drafting-white)] text-xs font-bold uppercase tracking-widest hover:opacity-90">
                                {loading ? 'Saving...' : 'Save Layer'}
                            </button>
                            <button type="button" onClick={resetForm} className="chalk-btn px-6 py-2 text-[var(--paper-plane-grey)] text-xs font-bold uppercase tracking-widest hover:text-[var(--deep-teal)]">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-2">
                {layers.length === 0 ? (
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-12 text-center border-dashed">
                        <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] opacity-50 mb-2">layers_clear</span>
                        <h3 className="text-lg font-bold text-[var(--deep-teal)]">No Layers Defined</h3>
                        <p className="text-sm text-[var(--paper-plane-grey)]">Start by creating analytical layers for the homepage.</p>
                    </div>
                ) : (
                    layers.map(layer => (
                        <div key={layer.id} className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-4 flex items-center justify-between hover:border-[var(--electric-teal)] transition-colors group">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 border border-[var(--ink-line)] flex items-center justify-center bg-[var(--platinum-sheen)]/20" style={{ borderColor: layer.color }}>
                                    <span className="material-symbols-outlined text-2xl" style={{ color: layer.color }}>{layer.icon}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg text-[var(--deep-teal)] uppercase">{layer.titleEn}</h3>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${layer.active ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' : 'border-[var(--paper-plane-grey)] text-[var(--paper-plane-grey)]'}`}>
                                            {layer.active ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--paper-plane-grey)] font-light line-clamp-1">{layer.descEn}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] uppercase font-bold text-[var(--paper-plane-grey)] mr-4">Order: {layer.order}</span>
                                <button onClick={() => toggleActive(layer.id, layer.active)} className="p-2 border border-[var(--ink-line)] hover:bg-[var(--platinum-sheen)]/50 transition-colors" title="Toggle visibility">
                                    <span className="material-symbols-outlined text-sm">{layer.active ? 'visibility_off' : 'visibility'}</span>
                                </button>
                                <button onClick={() => handleEdit(layer)} className="p-2 border border-[var(--ink-line)] hover:bg-[var(--platinum-sheen)]/50 transition-colors text-[var(--electric-teal)]" title="Edit">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button onClick={() => handleDelete(layer.id)} className="p-2 border border-[var(--ink-line)] hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
