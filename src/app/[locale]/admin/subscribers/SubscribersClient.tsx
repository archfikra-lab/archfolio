'use client';

import { useState } from 'react';
import { updateSubscriberPlanAction, updateRewardSettingsAction } from '@/app/actions/subscribers';
import { useRouter } from 'next/navigation';

export default function SubscribersClient({ initialUsers, initialSettings, plans }: any) {
    const router = useRouter();
    const [users, setUsers] = useState(initialUsers || []);
    const [settings, setSettings] = useState(initialSettings || { rewardUploadsRequired: 1, rewardDownloadsGranted: 5 });
    const [savingSettings, setSavingSettings] = useState(false);

    const [activeUserActivity, setActiveUserActivity] = useState<any>(null); // To show logs modal

    const handlePlanChange = async (userId: string, newPlanId: string) => {
        // Optimistic UI update
        const updatedUsers = users.map((u: any) =>
            u.id === userId
                ? { ...u, subscriptionPlanId: newPlanId === "none" ? null : newPlanId, subscriptionPlan: plans.find((p: any) => p.id === newPlanId) || null }
                : u
        );
        setUsers(updatedUsers);

        await updateSubscriberPlanAction(userId, newPlanId === "none" ? null : newPlanId);
        router.refresh(); // Sync back up
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        await updateRewardSettingsAction(settings.rewardUploadsRequired, settings.rewardDownloadsGranted);
        setSavingSettings(false);
        alert("Reward configuration saved!");
    };

    return (
        <div className="space-y-12">
            <header className="border-b-4 border-[var(--ink-line)] pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-[var(--deep-teal)] mb-2">Subscribers Management</h1>
                    <p className="text-[var(--paper-plane-grey)] font-mono text-sm uppercase tracking-widest max-w-2xl">
                        Monitor active users, assign subscription tiers, and configure automated portfolio upload rewards.
                    </p>
                </div>
            </header>

            {/* Global Settings Block */}
            <div className="bg-[var(--platinum-sheen)]/10 border border-[var(--ink-line)] border-l-4 border-l-[var(--mustard-gold)] p-6 md:p-8">
                <h2 className="text-xl font-bold text-[var(--deep-teal)] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--mustard-gold)]">stars</span>
                    Global Reward System
                </h2>
                <form onSubmit={handleSaveSettings} className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest">Case Uploads Required</label>
                        <input
                            type="number" min="1" required
                            className="w-full bg-white border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] font-mono text-sm focus:border-[var(--electric-teal)] outline-none"
                            value={settings.rewardUploadsRequired}
                            onChange={(e) => setSettings({ ...settings, rewardUploadsRequired: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest">Free Downloads Granted</label>
                        <input
                            type="number" min="0" required
                            className="w-full bg-white border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] font-mono text-sm focus:border-[var(--electric-teal)] outline-none"
                            value={settings.rewardDownloadsGranted}
                            onChange={(e) => setSettings({ ...settings, rewardDownloadsGranted: parseInt(e.target.value) })}
                        />
                    </div>
                    <button
                        type="submit" disabled={savingSettings}
                        className="bg-[var(--deep-teal)] text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[var(--mustard-gold)] transition-colors h-[46px] disabled:opacity-50"
                    >
                        {savingSettings ? 'Saving...' : 'Update Logic'}
                    </button>
                </form>
            </div>

            {/* Subscribers Table */}
            <div className="overflow-x-auto bg-white border border-[var(--ink-line)]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--platinum-sheen)]/50 border-b-2 border-[var(--ink-line)]">
                            <th className="p-4 text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest">User Details</th>
                            <th className="p-4 text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest">Role</th>
                            <th className="p-4 text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest">Current Plan</th>
                            <th className="p-4 text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest">Downloads (Used / Earned)</th>
                            <th className="p-4 text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--ink-line)]">
                        {users.map((user: any) => (
                            <tr key={user.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-[var(--deep-teal)] text-sm">{user.name || 'Unnamed User'}</div>
                                    <div className="text-[10px] text-[var(--paper-plane-grey)] font-mono">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-[var(--platinum-sheen)] text-[var(--deep-teal)] px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm border border-[var(--ink-line)]">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="bg-white border border-[var(--ink-line)] p-2 text-xs font-bold text-[var(--deep-teal)] outline-none focus:border-[var(--electric-teal)] min-w-[140px]"
                                        value={user.subscriptionPlanId || "none"}
                                        onChange={(e) => handlePlanChange(user.id, e.target.value)}
                                    >
                                        <option value="none" className="text-black bg-white">No Plan</option>
                                        {plans.map((p: any) => (
                                            <option key={p.id} value={p.id} className="text-black bg-white">{p.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-4 font-mono text-sm text-[var(--deep-teal)]">
                                    <span className={user.downloadCount > 0 ? "text-[var(--alert-red)]" : ""}>{user.downloadCount}</span>
                                    <span className="text-[var(--paper-plane-grey)]"> / </span>
                                    <span className={user.earnedDownloads > 0 ? "text-[var(--mustard-gold)] font-bold" : ""}>{user.earnedDownloads}</span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setActiveUserActivity(user)}
                                        className="text-[10px] font-bold text-[var(--deep-teal)] uppercase tracking-widest hover:text-[var(--mustard-gold)] transition-colors flex items-center justify-end gap-1 w-full"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">history</span>
                                        Audit Log
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-[var(--paper-plane-grey)] font-mono text-sm">No registered users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Activity Log Modal */}
            {activeUserActivity && (
                <div className="fixed inset-0 bg-[var(--deep-teal)]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[80vh] border-2 border-[var(--ink-line)] shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-[var(--ink-line)] flex justify-between items-center bg-[var(--platinum-sheen)]/10">
                            <div>
                                <h3 className="text-xl font-bold text-[var(--deep-teal)]">Activity Audit Log</h3>
                                <p className="text-xs font-mono text-[var(--paper-plane-grey)] mt-1">{activeUserActivity.email}</p>
                            </div>
                            <button onClick={() => setActiveUserActivity(null)} className="text-[var(--paper-plane-grey)] hover:text-[var(--alert-red)]">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {!activeUserActivity.activityLogs || activeUserActivity.activityLogs.length === 0 ? (
                                <p className="text-center text-[var(--paper-plane-grey)] font-mono text-sm py-8">No activity recorded yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {activeUserActivity.activityLogs.map((log: any) => (
                                        <div key={log.id} className="border-l-2 border-[var(--mustard-gold)] pl-4 py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-[10px] uppercase tracking-widest bg-[var(--electric-teal)]/10 text-[var(--deep-teal)] px-2 py-0.5 inline-block border border-[var(--electric-teal)]/20">
                                                    {log.action}
                                                </span>
                                                <span className="text-[10px] text-[var(--paper-plane-grey)] font-mono">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            {log.details && (
                                                <p className="text-xs text-[var(--deep-teal)] font-mono mt-2 bg-[var(--platinum-sheen)]/30 p-2 break-all">
                                                    {log.details}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
