'use client';

import { useState } from 'react';
import { createPartner, updatePartner, deletePartner } from '@/app/actions/partnerActions';
import { createDonor, updateDonor, deleteDonor } from '@/app/actions/donorActions';

interface Partner {
    id: string;
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    tier: string;
    active: boolean;
    order: number;
}

interface Donor {
    id: string;
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    amount?: number;
    message?: string;
    featured: boolean;
    active: boolean;
}

export default function PartnersClient({
    initialPartners,
    initialDonors,
}: {
    initialPartners: Partner[];
    initialDonors: Donor[];
}) {
    const [activeTab, setActiveTab] = useState<'partners' | 'donors'>('partners');
    const [partners, setPartners] = useState(initialPartners);
    const [donors, setDonors] = useState(initialDonors);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Partner form
    const [pName, setPName] = useState('');
    const [pLogo, setPLogo] = useState('');
    const [pWebsite, setPWebsite] = useState('');
    const [pTier, setPTier] = useState('SILVER');

    // Donor form
    const [dName, setDName] = useState('');
    const [dLogo, setDLogo] = useState('');
    const [dWebsite, setDWebsite] = useState('');
    const [dAmount, setDAmount] = useState('');
    const [dMessage, setDMessage] = useState('');
    const [dFeatured, setDFeatured] = useState(false);

    const handleAddPartner = async () => {
        if (!pName.trim()) return;
        setLoading(true);
        try {
            const newPartner = await createPartner({
                name: pName,
                logoUrl: pLogo || undefined,
                websiteUrl: pWebsite || undefined,
                tier: pTier,
            });
            setPartners([...partners, newPartner]);
            setPName(''); setPLogo(''); setPWebsite(''); setPTier('SILVER');
            setShowForm(false);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleAddDonor = async () => {
        if (!dName.trim()) return;
        setLoading(true);
        try {
            const newDonor = await createDonor({
                name: dName,
                logoUrl: dLogo || undefined,
                websiteUrl: dWebsite || undefined,
                amount: dAmount ? parseFloat(dAmount) : undefined,
                message: dMessage || undefined,
                featured: dFeatured,
            });
            setDonors([...donors, newDonor]);
            setDName(''); setDLogo(''); setDWebsite(''); setDAmount(''); setDMessage(''); setDFeatured(false);
            setShowForm(false);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleTogglePartner = async (id: string, active: boolean) => {
        await updatePartner(id, { active: !active });
        setPartners(partners.map(p => p.id === id ? { ...p, active: !active } : p));
    };

    const handleToggleDonor = async (id: string, active: boolean) => {
        await updateDonor(id, { active: !active });
        setDonors(donors.map(d => d.id === id ? { ...d, active: !active } : d));
    };

    const handleDeletePartner = async (id: string) => {
        await deletePartner(id);
        setPartners(partners.filter(p => p.id !== id));
    };

    const handleDeleteDonor = async (id: string) => {
        await deleteDonor(id);
        setDonors(donors.filter(d => d.id !== id));
    };

    const tierBadge: Record<string, string> = {
        PLATINUM: 'bg-[var(--mustard-gold)] text-white',
        GOLD: 'bg-[var(--electric-teal)] text-white',
        SILVER: 'bg-[var(--paper-plane-grey)] text-white',
    };

    const inputStyle = "w-full bg-transparent border border-[var(--ink-line)] px-3 py-2 text-sm text-[var(--deep-teal)] placeholder:text-[var(--paper-plane-grey)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors";

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-[var(--ink-line)]">
                <button
                    onClick={() => { setActiveTab('partners'); setShowForm(false); }}
                    className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'partners' ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' : 'border-transparent text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)]'}`}
                >
                    <span className="material-symbols-outlined text-sm mr-1 align-middle">handshake</span>
                    Partners ({partners.length})
                </button>
                <button
                    onClick={() => { setActiveTab('donors'); setShowForm(false); }}
                    className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'donors' ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' : 'border-transparent text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)]'}`}
                >
                    <span className="material-symbols-outlined text-sm mr-1 align-middle">volunteer_activism</span>
                    Donors ({donors.length})
                </button>
                <div className="flex-1" />
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-[var(--electric-teal)] text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancel' : `Add ${activeTab === 'partners' ? 'Partner' : 'Donor'}`}
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-[var(--card-bg)] border border-[var(--electric-teal)]/30 p-6 space-y-4 animate-[fadeInUp_0.3s_ease]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--electric-teal)] mb-4">
                        {activeTab === 'partners' ? 'New Partner' : 'New Donor'}
                    </h3>

                    {activeTab === 'partners' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className={inputStyle} placeholder="Partner name *" value={pName} onChange={e => setPName(e.target.value)} />
                                <select className={inputStyle} value={pTier} onChange={e => setPTier(e.target.value)}>
                                    <option value="PLATINUM">Platinum</option>
                                    <option value="GOLD">Gold</option>
                                    <option value="SILVER">Silver</option>
                                </select>
                                <input className={inputStyle} placeholder="Logo URL (optional)" value={pLogo} onChange={e => setPLogo(e.target.value)} />
                                <input className={inputStyle} placeholder="Website URL (optional)" value={pWebsite} onChange={e => setPWebsite(e.target.value)} />
                            </div>
                            <button onClick={handleAddPartner} disabled={loading || !pName.trim()} className="bg-[var(--electric-teal)] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors disabled:opacity-50">
                                {loading ? 'Saving...' : 'Add Partner'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className={inputStyle} placeholder="Donor name *" value={dName} onChange={e => setDName(e.target.value)} />
                                <input className={inputStyle} placeholder="Amount (optional)" type="number" value={dAmount} onChange={e => setDAmount(e.target.value)} />
                                <input className={inputStyle} placeholder="Logo URL (optional)" value={dLogo} onChange={e => setDLogo(e.target.value)} />
                                <input className={inputStyle} placeholder="Website URL (optional)" value={dWebsite} onChange={e => setDWebsite(e.target.value)} />
                                <input className={`${inputStyle} md:col-span-2`} placeholder="Message (optional)" value={dMessage} onChange={e => setDMessage(e.target.value)} />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={dFeatured} onChange={e => setDFeatured(e.target.checked)} className="accent-[var(--electric-teal)]" />
                                <span className="text-xs font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">Featured Donor</span>
                            </label>
                            <button onClick={handleAddDonor} disabled={loading || !dName.trim()} className="bg-[var(--electric-teal)] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors disabled:opacity-50">
                                {loading ? 'Saving...' : 'Add Donor'}
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Partners Table */}
            {activeTab === 'partners' && (
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                            <tr>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Partner</th>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Tier</th>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Website</th>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Status</th>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ink-line)]">
                            {partners.map(partner => (
                                <tr key={partner.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            {partner.logoUrl ? (
                                                <img src={partner.logoUrl} alt="" className="w-8 h-8 object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-[var(--paper-plane-grey)]">business</span>
                                            )}
                                            <span className="font-medium text-[var(--deep-teal)]">{partner.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${tierBadge[partner.tier]}`}>
                                            {partner.tier}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-[var(--paper-plane-grey)]">
                                        {partner.websiteUrl ? (
                                            <a href={partner.websiteUrl} target="_blank" className="hover:text-[var(--electric-teal)] transition-colors">{partner.websiteUrl}</a>
                                        ) : '—'}
                                    </td>
                                    <td className="px-5 py-3">
                                        <button onClick={() => handleTogglePartner(partner.id, partner.active)} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${partner.active ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' : 'border-red-400 text-red-400'}`}>
                                            {partner.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button onClick={() => handleDeletePartner(partner.id)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {partners.length === 0 && (
                                <tr><td colSpan={5} className="px-5 py-8 text-center italic text-[var(--paper-plane-grey)] text-xs">No partners yet. Add your first partner above.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Donors Table */}
            {activeTab === 'donors' && (
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                            <tr>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Donor</th>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Amount</th>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Featured</th>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80">Status</th>
                                <th className="px-5 py-3 font-medium text-[var(--deep-teal)]/80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ink-line)]">
                            {donors.map(donor => (
                                <tr key={donor.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[var(--electric-teal)]">favorite</span>
                                            <div>
                                                <span className="font-medium text-[var(--deep-teal)]">{donor.name}</span>
                                                {donor.message && <p className="text-[10px] text-[var(--paper-plane-grey)] mt-0.5 italic">{donor.message}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-[var(--paper-plane-grey)]">
                                        {donor.amount ? `$${donor.amount.toLocaleString()}` : '—'}
                                    </td>
                                    <td className="px-5 py-3">
                                        {donor.featured && <span className="text-[var(--mustard-gold)] material-symbols-outlined text-sm">star</span>}
                                    </td>
                                    <td className="px-5 py-3">
                                        <button onClick={() => handleToggleDonor(donor.id, donor.active)} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${donor.active ? 'border-[var(--electric-teal)] text-[var(--electric-teal)]' : 'border-red-400 text-red-400'}`}>
                                            {donor.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button onClick={() => handleDeleteDonor(donor.id)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {donors.length === 0 && (
                                <tr><td colSpan={5} className="px-5 py-8 text-center italic text-[var(--paper-plane-grey)] text-xs">No donors yet. Add your first donor above.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
