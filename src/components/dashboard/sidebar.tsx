import { logout } from "@/actions/auth";
import Link from "next/link";
import {
    LayoutDashboard,
    BookOpen,
    MessageSquare,
    Settings,
    Users,
    LogOut,
    Zap
} from "lucide-react";

export function Sidebar({ workspaceId }: { workspaceId?: string }) {
    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
        { name: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
        { name: "Team", href: "/dashboard/team", icon: Users },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Widget Preview", href: `/widget${workspaceId ? `?id=${workspaceId}` : ""}`, icon: Zap },
    ];

    return (
        <div className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-900/50">
            <div className="flex h-16 items-center px-6">
                <Link href="/dashboard" className="text-xl font-bold text-white">
                    SupportIQ
                </Link>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="border-t border-zinc-800 p-4">
                <button
                    onClick={() => logout()}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
