'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUserAction } from "@/app/actions/auth";
import { Link } from "@/i18n/routing";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await registerUserAction(formData);

        if (!result.success) {
            setError(result.error || "Registration failed.");
            setIsLoading(false);
        } else {
            // Redirect to login upon successful registration
            router.push('/en/login?registered=true');
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 tracing-paper p-8 border border-[var(--ink-line)] chalk-border relative shadow-lg">
                <div className="absolute -top-3 -left-3 border-t border-l border-[var(--ink-line)] w-6 h-6"></div>
                <div className="absolute -bottom-3 -right-3 border-b border-r border-[var(--ink-line)] w-6 h-6"></div>
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-[var(--deep-teal)] font-serif tracking-wider">
                        Join Archfolio
                    </h2>
                    <p className="mt-2 text-center text-sm text-[var(--paper-plane-grey)] font-mono">
                        Register for a free Academic License
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
                            <label className="text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold mb-1 block">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[var(--ink-line)] text-[var(--deep-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--mustard-gold)] focus:border-[var(--mustard-gold)] text-sm bg-black/5"
                                placeholder="Architect Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold mb-1 block">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[var(--ink-line)] text-[var(--deep-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--mustard-gold)] focus:border-[var(--mustard-gold)] text-sm bg-black/5"
                                placeholder="name@studio.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] font-bold mb-1 block">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={8}
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
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 border-t border-[var(--ink-line)]/50 pt-4 text-center">
                    <p className="text-[10px] text-[var(--paper-plane-grey)] mt-1">
                        Already have an account? <Link href="/login" className="text-[var(--mustard-gold)] hover:underline font-bold">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
