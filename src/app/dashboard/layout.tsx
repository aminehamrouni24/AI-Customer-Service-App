"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import ChatWidget from "@/components/widget/chat-widget";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const [workspace, setWorkspace] = useState<any>(null);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/workspace")
                .then(res => res.ok ? res.json() : null)
                .then(data => data?.id ? setWorkspace(data) : setWorkspace(null))
                .catch(err => console.error("Failed to fetch workspace:", err));
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-blue-500" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        redirect("/auth/login");
    }

    return (
        <div className="flex h-screen bg-zinc-950">
            <Sidebar workspaceId={workspace?.id} />
            <main className="flex-1 overflow-y-auto bg-zinc-900/50 p-8 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
            {workspace?.id && <ChatWidget workspaceId={workspace.id} />}
        </div>
    );
}
