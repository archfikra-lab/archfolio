'use client';

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDemoAccounts } from "@/app/actions/auth";
import { getRegisteredUsers } from "@/app/actions/users";

export default function LoginPage() {
    const [selectedEmail, setSelectedEmail] = useState("");
    const [password, setPassword] = useState("password123");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        getRegisteredUsers().then(data => {
            setUsers(data);
            if (data.length > 0) {
                setSelectedEmail(data[0].email || "");
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email: selectedEmail,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials");
            setIsLoading(false);
        } else {
            // Redirect based on user role
            const selectedUser = users.find(u => u.email === selectedEmail);
            const role = selectedUser?.role || 'AUTHOR';
            const dashboardMap: Record<string, string> = {
                ADMIN: '/en/admin',
                EXPERT: '/en/expert',
                ACADEMIC: '/en/academic',
                AUTHOR: '/en/author',
            };
            router.push(dashboardMap[role] || '/en/author');
            router.refresh();
        }
    };

    const handleCreateDemo = async () => {
        setIsDemoLoading(true);
        const res = await createDemoAccounts();
        if (res.success) {
            alert("Demo accounts created! You can now log in with roles like admin@archfolio.com / password123");
        } else {
            alert("Failed to create demo accounts: " + res.error);
        }
        setIsDemoLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 tracing-paper p-8 border border-[var(--ink-line)] chalk-border relative shadow-lg">
                <div className="absolute -top-3 -left-3 border-t border-l border-[var(--ink-line)] w-6 h-6"></div>
                <div className="absolute -bottom-3 -right-3 border-b border-r border-[var(--ink-line)] w-6 h-6"></div>
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-[var(--deep-teal)] font-serif tracking-wider">
                        Archfolio Access
                    </h2>
                    <p className="mt-2 text-center text-sm text-[var(--paper-plane-grey)] font-mono">
                        Authenticate to your workspace
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 border border-red-200 text-sm italic font-mono flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold mb-1 block">Select Demo User</label>
                            <select
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[var(--ink-line)] text-[var(--deep-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--mustard-gold)] focus:border-[var(--mustard-gold)] text-sm bg-black/5"
                                value={selectedEmail}
                                onChange={(e) => setSelectedEmail(e.target.value)}
                            >
                                {users.length === 0 ? (
                                    <option value="" disabled>Loading users...</option>
                                ) : (
                                    users.map(user => (
                                        <option key={user.id} value={user.email}>
                                            {user.name} - {user.email}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold mb-1 block">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[var(--ink-line)] placeholder-[var(--silver-grey)] text-[var(--deep-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--mustard-gold)] focus:border-[var(--mustard-gold)] text-sm bg-black/5"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium text-[var(--drafting-white)] bg-[var(--deep-teal)] hover:bg-[var(--blueprint-blue)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--deep-teal)] uppercase tracking-widest disabled:opacity-50"
                        >
                            {isLoading ? "Authenticating..." : "Sign In"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 border-t border-[var(--ink-line)]/50 pt-4 text-center">
                    <button
                        onClick={handleCreateDemo}
                        disabled={isDemoLoading}
                        className="text-xs text-[var(--mustard-gold)] hover:underline font-mono"
                    >
                        {isDemoLoading ? "Processing..." : "Initialize Demo Accounts"}
                    </button>
                    <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1">
                        Creates demo accounts for each role (e.g., admin@archfolio.com / password123)
                    </p>
                </div>
            </div>
        </div>
    );
}
