import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MessageSquare, Users, Zap, BookOpen, Clock } from "lucide-react";
import SetupClient from "@/components/dashboard/setup-client";
import { getUserWorkspace } from "@/lib/get-user-workspace";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    const workspace = await getUserWorkspace(session.user.id);

    if (!workspace) {
        return <SetupClient />;
    }

    // Fetch real stats
    const [totalConversations, activeLeads, totalKnowledge, recentConversations, recentKnowledge] = await Promise.all([
        prisma.conversation.count({ where: { workspaceId: workspace.id } }),
        prisma.conversation.count({ where: { workspaceId: workspace.id, status: "OPEN" } }),
        prisma.knowledgeSource.count({ where: { workspaceId: workspace.id } }),
        prisma.conversation.findMany({
            where: { workspaceId: workspace.id },
            take: 5,
            orderBy: { updatedAt: "desc" },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                }
            }
        }),
        prisma.knowledgeSource.findMany({
            where: { workspaceId: workspace.id },
            take: 3,
            orderBy: { updatedAt: "desc" },
        })
    ]);

    const stats = [
        { name: "Total Conversations", value: totalConversations.toString(), change: "+0%", label: "All time", icon: MessageSquare },
        { name: "Active Leads", value: activeLeads.toString(), change: "+0%", label: "Currently open", icon: Users },
        { name: "Support Efficiency", value: "N/A", change: "0%", label: "AI Response rate", icon: Zap },
        { name: "Knowledge Base", value: `${totalKnowledge} sources`, change: "Active", label: "Indexing status", icon: BookOpen },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {session.user.name}!</h1>
                <p className="mt-2 text-zinc-400">Here's what's happening with {workspace.name}.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm group hover:border-zinc-700 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                            <stat.icon className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                    <h2 className="text-lg font-semibold text-white">Recent Conversations</h2>
                    <div className="mt-4 space-y-4">
                        {recentConversations.length === 0 ? (
                            <p className="text-sm text-zinc-500 py-4 text-center italic">No conversations yet.</p>
                        ) : (
                            recentConversations.map((conv) => (
                                <div key={conv.id} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Visitor #{conv.id.slice(-4)}</p>
                                            <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                                                {conv.messages[0]?.content || "No messages yet"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${conv.status === 'OPEN' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {conv.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                    <h2 className="text-lg font-semibold text-white">Knowledge Sync</h2>
                    <div className="mt-4 space-y-4">
                        {recentKnowledge.length === 0 ? (
                            <p className="text-sm text-zinc-500 py-4 text-center italic">No knowledge sources added.</p>
                        ) : (
                            recentKnowledge.map((source) => (
                                <div key={source.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">{source.title}</p>
                                        <p className="text-xs text-zinc-500">
                                            {source.status} • {new Date(source.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-semibold ${source.status === 'READY' ? 'text-emerald-400' : 'text-blue-400 animate-pulse'
                                        }`}>
                                        {source.status === 'READY' ? 'Indexed' : source.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
