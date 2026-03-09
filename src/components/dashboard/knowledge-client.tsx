"use client";

import { useState } from "react";
import { Plus, FileText, Globe, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface KnowledgeSource {
    id: string;
    title: string;
    type: string;
    status: string;
    updatedAt: Date | string;
}

export default function KnowledgeClient({
    sources,
    workspaceId
}: {
    sources: KnowledgeSource[],
    workspaceId: string
}) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<"TEXT" | "URL">("TEXT");
    const router = useRouter();

    const handleAdd = async () => {
        if (!title || !content) return;
        setLoading(true);
        try {
            const res = await fetch("/api/knowledge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId,
                    title,
                    type,
                    content,
                }),
            });

            if (res.ok) {
                setShowAddModal(false);
                setTitle("");
                setContent("");
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to add source:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Knowledge Base</h1>
                    <p className="mt-2 text-zinc-400">Manage your product documentation and help articles.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Source
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sources.length === 0 ? (
                    <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20">
                        <BookOpen className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white">No knowledge sources yet</h3>
                        <p className="text-zinc-500 mt-1">Add your first source to train your AI assistant.</p>
                    </div>
                ) : (
                    sources.map((source) => (
                        <div key={source.id} className="group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:bg-zinc-800/80 hover:border-zinc-700">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 mb-4">
                                {source.type === 'URL' ? <Globe className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                            </div>
                            <h3 className="text-lg font-semibold text-white truncate">{source.title}</h3>
                            <p className="mt-2 text-sm text-zinc-400">
                                Updated {new Date(source.updatedAt).toLocaleDateString()}
                            </p>
                            <div className="mt-6 flex items-center justify-between">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${source.status === 'READY'
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-blue-500/10 text-blue-400 animate-pulse'
                                    }`}>
                                    {source.status}
                                </span>
                                <button className="text-xs text-zinc-500 hover:text-white transition-colors">Manage</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Add Knowledge Source</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. FAQ or Pricing Page"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setType("TEXT")}
                                        className={`flex items-center justify-center rounded-lg border py-2 text-sm font-medium transition-all ${type === "TEXT" ? "border-blue-500 bg-blue-500/10 text-blue-500" : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                            }`}
                                    >
                                        Plain Text
                                    </button>
                                    <button
                                        onClick={() => setType("URL")}
                                        className={`flex items-center justify-center rounded-lg border py-2 text-sm font-medium transition-all ${type === "URL" ? "border-blue-500 bg-blue-500/10 text-blue-500" : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                            }`}
                                    >
                                        URL (Crawl)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    {type === "TEXT" ? "Content" : "URL"}
                                </label>
                                <textarea
                                    placeholder={type === "TEXT" ? "Paste your documentation here..." : "https://docs.example.com/faq"}
                                    rows={type === "TEXT" ? 6 : 2}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                disabled={loading}
                                onClick={() => setShowAddModal(false)}
                                className="rounded-lg px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading || !title || !content}
                                onClick={handleAdd}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Add Source
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BookOpen(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}
