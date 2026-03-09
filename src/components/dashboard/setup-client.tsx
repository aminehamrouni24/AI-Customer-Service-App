"use client";

import { useState } from "react";
import { Zap, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SetupClient() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCreate = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/workspace", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "My Workspace" }),
            });

            const data = await res.json().catch(() => null);

            if (res.ok) {
                router.refresh();
            } else {
                const msg = data?.error || data?.message || `Error ${res.status}: ${res.statusText}`;
                setError(msg);
                console.error("[SetupClient] POST /api/workspace failed:", res.status, data);
            }
        } catch (err: any) {
            const msg = err?.message || "Network error — check console";
            setError(msg);
            console.error("[SetupClient] Exception:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/10">
                <Zap className="h-12 w-12" />
            </div>
            <div className="max-w-md">
                <h2 className="text-3xl font-bold text-white">Scale your support with AI</h2>
                <p className="mt-3 text-zinc-400">Create your first workspace to start training your AI assistant and managing customer conversations.</p>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 max-w-md w-full">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button
                disabled={loading}
                onClick={handleCreate}
                className="group relative inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
            >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                Create Your Workspace
                <div className="absolute -inset-0.5 rounded-xl bg-blue-500 opacity-0 blur group-hover:opacity-20 transition-opacity" />
            </button>
        </div>
    );
}
