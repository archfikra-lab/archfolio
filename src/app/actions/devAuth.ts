"use server";

import { cookies } from "next/headers";
import { Role } from "@prisma/client";

export async function setDevRole(role: Role) {
    (await cookies()).set("dev_role", role, { path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function getDevRole(): Promise<Role> {
    const role = (await cookies()).get("dev_role")?.value;
    return (role as Role) || "ADMIN"; // Default to ADMIN for dev
}
