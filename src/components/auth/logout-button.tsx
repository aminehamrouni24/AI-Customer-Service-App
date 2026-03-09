"use client";

import { logout } from "@/actions/auth";

export function LogoutButton() {
    return (
        <button
            onClick={() => logout()}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
            Sign Out
        </button>
    );
}
