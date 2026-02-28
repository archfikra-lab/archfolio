"use client";

import { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import { setDevRole, getDevRole } from "@/app/actions/devAuth";

export default function UserSelector() {
    const [role, setCurrentRole] = useState<Role>("ADMIN");

    useEffect(() => {
        // Fetch the initial role on mount
        getDevRole().then(setCurrentRole);
    }, []);

    const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as Role;
        setCurrentRole(newRole);
        await setDevRole(newRole);
        window.location.reload(); // Refresh to apply new role across the app
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-neutral-900 border border-neutral-700 rounded-lg p-2 shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-neutral-400">DEV MODE</span>
            </div>
            <div className="h-4 w-px bg-neutral-700" />
            <select
                value={role}
                onChange={handleRoleChange}
                className="bg-neutral-800 text-white text-sm rounded px-2 py-1 outline-none border border-neutral-700 hover:border-neutral-600 transition-colors cursor-pointer"
            >
                <option value="ADMIN">Admin</option>
                <option value="AUTHOR">Author</option>
                <option value="ACADEMIC">Academic</option>
                <option value="EXPERT">Expert</option>
            </select>
        </div>
    );
}
