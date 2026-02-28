import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface UserWithCounts {
    id: string;
    email: string | null;
    name: string | null;
    role: string;
    createdAt: Date;
    _count: {
        authoredProjects: number;
        reviewedProjects: number;
    };
}

export default async function AdminUsersPage() {
    const users: UserWithCounts[] = await (prisma as any).user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    authoredProjects: true,
                    reviewedProjects: true,
                }
            }
        }
    });

    const roleCounts = {
        ADMIN: users.filter((u: UserWithCounts) => u.role === 'ADMIN').length,
        AUTHOR: users.filter((u: UserWithCounts) => u.role === 'AUTHOR').length,
        EXPERT: users.filter((u: UserWithCounts) => u.role === 'EXPERT').length,
        ACADEMIC: users.filter((u: UserWithCounts) => u.role === 'ACADEMIC').length,
    };

    return (
        <div className="space-y-10 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--deep-teal)] mb-2">User Management</h1>
                    <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                        {users.length} registered accounts
                    </p>
                </div>
                <button className="bg-[var(--electric-teal)] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[var(--deep-teal)] transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    Add User
                </button>
            </div>

            {/* Role Distribution Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {([
                    { role: 'ADMIN', icon: 'admin_panel_settings', color: 'var(--bright-rust, #C0392B)' },
                    { role: 'AUTHOR', icon: 'edit_square', color: 'var(--electric-teal)' },
                    { role: 'EXPERT', icon: 'engineering', color: 'var(--mustard-gold)' },
                    { role: 'ACADEMIC', icon: 'school', color: 'var(--blueprint-blue, #003366)' },
                ] as const).map(({ role, icon, color }) => (
                    <div key={role} className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-5 hover-lift transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="material-symbols-outlined text-2xl" style={{ color }}>{icon}</span>
                            <span className="text-3xl font-light text-[var(--deep-teal)]">{roleCounts[role]}</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)]">{role}s</p>
                        <div className="mt-3 h-1 w-full bg-[var(--platinum-sheen)] overflow-hidden">
                            <div
                                className="h-full transition-all duration-1000"
                                style={{
                                    width: `${users.length > 0 ? (roleCounts[role] / users.length) * 100 : 0}%`,
                                    backgroundColor: color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] overflow-hidden">
                <div className="p-6 border-b border-[var(--ink-line)] flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[var(--deep-teal)] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--electric-teal)]">group</span>
                        All Users
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[var(--ink-line)] px-3 py-1.5">
                            <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-sm mr-2">search</span>
                            <input
                                className="bg-transparent border-none text-sm w-40 placeholder:text-[var(--paper-plane-grey)] text-[var(--deep-teal)] focus:outline-none"
                                placeholder="Search users..."
                                type="text"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--paper-plane-grey)]">
                        <thead className="bg-[var(--platinum-sheen)]/50 text-[10px] uppercase tracking-widest border-b border-[var(--ink-line)]">
                            <tr>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">User</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Email</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Role</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Projects</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Reviews</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80">Joined</th>
                                <th className="px-6 py-4 font-medium text-[var(--deep-teal)]/80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ink-line)]">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-[var(--platinum-sheen)]/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 border border-[var(--ink-line)] flex items-center justify-center bg-[var(--platinum-sheen)]/30 group-hover:border-[var(--electric-teal)] transition-colors">
                                                <span className="material-symbols-outlined text-sm text-[var(--paper-plane-grey)]">person</span>
                                            </div>
                                            <span className="font-medium text-[var(--deep-teal)]">{user.name || 'Unnamed'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono">{user.email || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${user.role === 'ADMIN' ? 'border-red-400/50 text-red-500 bg-red-500/5' :
                                            user.role === 'AUTHOR' ? 'border-[var(--electric-teal)]/50 text-[var(--electric-teal)] bg-[var(--electric-teal)]/5' :
                                                user.role === 'EXPERT' ? 'border-[var(--mustard-gold)]/50 text-[var(--mustard-gold)] bg-[var(--mustard-gold)]/5' :
                                                    'border-blue-400/50 text-blue-500 bg-blue-500/5'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-[var(--deep-teal)]">{user._count.authoredProjects}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-[var(--deep-teal)]">{user._count.reviewedProjects}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-[var(--platinum-sheen)]/30 transition-colors" title="Edit User">
                                                <span className="material-symbols-outlined text-sm text-[var(--paper-plane-grey)] hover:text-[var(--electric-teal)]">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-[var(--platinum-sheen)]/30 transition-colors" title="View Projects">
                                                <span className="material-symbols-outlined text-sm text-[var(--paper-plane-grey)] hover:text-[var(--mustard-gold)]">folder_open</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-red-50 transition-colors" title="Suspend">
                                                <span className="material-symbols-outlined text-sm text-[var(--paper-plane-grey)] hover:text-red-500">block</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <span className="material-symbols-outlined text-4xl text-[var(--paper-plane-grey)] opacity-50 block mb-2">group_off</span>
                                        <p className="text-sm text-[var(--paper-plane-grey)] italic">No registered users found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-[var(--ink-line)] flex items-center justify-between text-xs text-[var(--paper-plane-grey)]">
                    <span className="uppercase tracking-widest font-bold">Showing {users.length} users</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-[var(--ink-line)] hover:bg-[var(--platinum-sheen)]/20 transition-colors font-bold uppercase tracking-widest" disabled>Previous</button>
                        <span className="px-3 py-1 bg-[var(--deep-teal)] text-white font-bold">1</span>
                        <button className="px-3 py-1 border border-[var(--ink-line)] hover:bg-[var(--platinum-sheen)]/20 transition-colors font-bold uppercase tracking-widest" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
