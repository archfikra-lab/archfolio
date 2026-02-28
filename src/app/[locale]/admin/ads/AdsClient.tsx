'use client';

import { useState } from 'react';
import { createAd, updateAd, deleteAd } from '@/app/actions/adActions';

interface Ad {
    id: string;
    title: string;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    placement: string;
    tier: string;
    active: boolean;
    impressions: number;
    clicks: number;
    startDate?: string;
    endDate?: string;
}

export default function AdsClient({ initialAds }: { initialAds: Ad[] }) {
    const [ads, setAds] = useState(initialAds);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [placement, setPlacement] = useState('HOMEPAGE');
    const [tier, setTier] = useState('SILVER');

    const handleCreate = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            const newAd = await createAd({ title, content, imageUrl, linkUrl, placement, tier });
            setAds([newAd, ...ads]);
            setTitle(''); setContent(''); setImageUrl(''); setLinkUrl('');
            setPlacement('HOMEPAGE'); setTier('SILVER');
            setShowForm(false);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleToggle = async (id: string, active: boolean) => {
        await updateAd(id, { active: !active });
        setAds(ads.map(a => a.id === id ? { ...a, active: !active } : a));
    };

    const handleDelete = async (id: string) => {
        await deleteAd(id);
        setAds(ads.filter(a => a.id !== id));
    };

    const tierBadge: Record<string, string> = {
        PLATINUM: 'bg-[var(--mustard-gold)] text-white',
        GOLD: 'bg-[var(--electric-teal)] text-white',
        SILVER: 'bg-[var(--paper-plane-grey)] text-white',
    };

    const placementLabel: Record<string, string> = {
        HOMEPAGE: '🏠 Homepage',
        EXPLORE: '🔍 Explore',
        ARCHIVE: '📦 Archive',
        SIDEBAR: '📐 Sidebar',
        BANNER: '📢 Banner',
    };

    const inputStyle = "w-full bg-transparent border border-[var(--ink-line)] px-3 py-2 text-sm text-[var(--deep-teal)] placeholder:text-[var(--paper-plane-grey)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-[var(--deep-teal)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--electric-teal)]">campaign</span>
                    All Advertisements
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-[var(--electric-teal)] text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancel' : 'Create Ad'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-6 space-y-4 animate-[fadeInUp_0.3s_ease]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--electric-teal)]">New Advertisement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className={inputStyle} placeholder="Ad title *" value={title} onChange={e => setTitle(e.target.value)} />
                        <select className={inputStyle} value={placement} onChange={e => setPlacement(e.target.value)}>
                            <option value="HOMEPAGE">Homepage</option>
                            <option value="EXPLORE">Explore</option>
                            <option value="ARCHIVE">Archive</option>
                            <option value="SIDEBAR">Sidebar</option>
                            <option value="BANNER">Banner</option>
                        </select>
                        <input className={inputStyle} placeholder="Content/Description" value={content} onChange={e => setContent(e.target.value)} />
                        <select className={inputStyle} value={tier} onChange={e => setTier(e.target.value)}>
                            <option value="PLATINUM">Platinum</option>
                            <option value="GOLD">Gold</option>
                            <option value="SILVER">Silver</option>
                        </select>
                        <input className={inputStyle} placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                        <input className={inputStyle} placeholder="Link URL (optional)" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} />
                    </div>
                    <button onClick={handleCreate} disabled={loading || !title.trim()} className="bg-[var(--electric-teal)] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Advertisement'}
                    </button>
                </div>
            )}

            {/* Ads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ads.map(ad => (
                    <div key={ad.id} className={`bg-[var(--card-bg)] border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${ad.active ? 'border-[var(--ink-line)]' : 'border-red-400/30 opacity-60'}`}>
                        {/* Ad preview header */}
                        <div className="p-4 border-b border-[var(--ink-line)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${tierBadge[ad.tier]}`}>
                                    {ad.tier}
                                </span>
                                <span className="text-[10px] text-[var(--paper-plane-grey)] uppercase tracking-widest">
                                    {placementLabel[ad.placement] || ad.placement}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleToggle(ad.id, ad.active)} className={`p-1 transition-colors ${ad.active ? 'text-[var(--electric-teal)]' : 'text-red-400'}`} title={ad.active ? 'Deactivate' : 'Activate'}>
                                    <span className="material-symbols-outlined text-sm">{ad.active ? 'visibility' : 'visibility_off'}</span>
                                </button>
                                <button onClick={() => handleDelete(ad.id)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Ad content */}
                        <div className="p-4">
                            <h4 className="font-medium text-[var(--deep-teal)] mb-1">{ad.title}</h4>
                            {ad.content && <p className="text-xs text-[var(--paper-plane-grey)] mb-3 line-clamp-2">{ad.content}</p>}

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-[var(--paper-plane-grey)]">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">visibility</span>
                                    {(ad.impressions || 0).toLocaleString()} views
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">ads_click</span>
                                    {(ad.clicks || 0).toLocaleString()} clicks
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {ads.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--ink-line)]">
                        <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] mb-3 block">campaign</span>
                        <p className="text-[var(--paper-plane-grey)] font-medium">No advertisements yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
