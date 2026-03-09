import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, Mail, Shield, MoreVertical, UserPlus } from "lucide-react";
import { getUserWorkspace } from "@/lib/get-user-workspace";

export default async function TeamPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    const workspace = await getUserWorkspace(session.user.id);
    if (!workspace) redirect("/dashboard");

    const membersData = await prisma.membership.findMany({
        where: { workspaceId: workspace.id },
        include: { user: true },
    });

    const members = membersData;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Team Management</h1>
                    <p className="mt-2 text-zinc-400">Manage your team members and their roles within {workspace.name}.</p>
                </div>
                <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                </button>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left">
                    <thead className="border-b border-zinc-800 bg-zinc-950/50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm">
                        {members.map((m) => (
                            <tr key={m.id} className="group hover:bg-zinc-800/30 transition-all">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                                            {m.user.image ? (
                                                <img src={m.user.image} alt="" className="h-full w-full rounded-full" />
                                            ) : (
                                                <Users className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{m.user.name}</p>
                                            <p className="text-xs text-zinc-500">{m.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-3.5 w-3.5 text-blue-500" />
                                        <span className="text-zinc-300 font-medium">{m.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-zinc-500 hover:text-white transition-colors">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
