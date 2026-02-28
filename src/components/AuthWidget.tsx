'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthWidget() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="fixed bottom-4 left-4 z-50 bg-neutral-900 border border-neutral-700 rounded-lg p-2 shadow-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-pulse" />
                <span className="text-xs font-mono text-neutral-400">Loading Auth...</span>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="fixed bottom-4 left-4 z-50 bg-neutral-900 border border-neutral-700 rounded-lg p-2 shadow-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-mono text-neutral-400">UNAUTHENTICATED</span>
                <div className="h-4 w-px bg-neutral-700" />
                <button onClick={() => signIn()} className="text-xs font-bold uppercase tracking-widest text-[#e2b13c] hover:text-white transition-colors">SignIn</button>
            </div>
        );
    }

    // Determine the dashboard path based on role
    const getDashboardPath = (role: string) => {
        const lowerRole = role.toLowerCase();
        if (lowerRole === 'platform_admin' || lowerRole === 'admin') return '/en/admin';
        if (lowerRole === 'subject_expert' || lowerRole === 'expert') return '/en/expert';
        if (lowerRole === 'academic_researcher' || lowerRole === 'academic') return '/en/academic';
        if (lowerRole === 'professional_author' || lowerRole === 'author') return '/en/author';
        return '/en';
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-neutral-900 border border-neutral-700 rounded-lg p-2 shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-bold">{session.user.role}</span>
            </div>
            <div className="h-4 w-px bg-neutral-700" />
            <span className="text-xs text-white truncate max-w-[150px]">{session.user.name || session.user.email}</span>
            <div className="h-4 w-px bg-neutral-700" />
            <Link href={getDashboardPath(session.user.role)} className="text-xs text-[var(--electric-teal)] hover:text-white transition-colors uppercase font-bold tracking-widest">
                Dashboard
            </Link>
            <div className="h-4 w-px bg-neutral-700" />
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase font-bold tracking-widest">SignOut</button>
        </div>
    );
}
