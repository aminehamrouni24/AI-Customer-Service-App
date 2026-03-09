"use client";

import { useState } from "react";
import { Search, Filter, MessageSquare, User, Clock, ChevronRight } from "lucide-react";

interface Conversation {
    id: string;
    visitorId: string;
    status: string;
    updatedAt: string;
    messages: {
        content: string;
        createdAt: string;
        role: string;
    }[];
}

export default function ConversationsClient({ conversations }: { conversations: Conversation[] }) {
    const [search, setSearch] = useState("");

    const filtered = conversations.filter(c =>
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Conversations</h1>
                <p className="mt-2 text-zinc-400">Monitor and respond to customer interactions in real-time.</p>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 py-2 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left">
                    <thead className="border-b border-zinc-800 bg-zinc-950/50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <tr>
                            <th className="px-6 py-4 underline decoration-zinc-800 underline-offset-4">Visitor</th>
                            <th className="px-6 py-4 underline decoration-zinc-800 underline-offset-4">Status</th>
                            <th className="px-6 py-4 underline decoration-zinc-800 underline-offset-4">Last Message</th>
                            <th className="px-6 py-4 text-right underline decoration-zinc-800 underline-offset-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                                    No conversations found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((conv) => (
                                <tr key={conv.id} className="group hover:bg-zinc-800/30 transition-all cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-zinc-600 transition-colors">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">Visitor #{conv.id.slice(-4)}</p>
                                                <p className="text-xs text-zinc-500">{new Date(conv.updatedAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${conv.status === 'OPEN'
                                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                            }`}>
                                            {conv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 max-w-[300px] truncate">
                                        {conv.messages[0]?.content || "No messages"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="inline-flex items-center text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors group/btn">
                                            View
                                            <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
