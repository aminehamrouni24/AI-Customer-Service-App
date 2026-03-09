import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/dashboard/settings-client";
import { getUserWorkspace } from "@/lib/get-user-workspace";
import prisma from "@/lib/prisma";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    const workspace = await getUserWorkspace(session.user.id);
    if (!workspace) redirect("/dashboard");

    // Fetch widgetConfig separately since getUserWorkspace only returns base workspace
    const workspaceWithConfig = await prisma.workspace.findUnique({
        where: { id: workspace.id },
        include: { widgetConfig: true },
    });

    return <SettingsClient workspace={workspaceWithConfig!} />;
}
