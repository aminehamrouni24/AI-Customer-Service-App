import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ConversationsClient from "@/components/dashboard/conversations-client";
import { getUserWorkspace } from "@/lib/get-user-workspace";

export default async function ConversationsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    const workspace = await getUserWorkspace(session.user.id);
    if (!workspace) redirect("/dashboard");

    const conversations = await prisma.conversation.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { updatedAt: "desc" },
        include: {
            messages: {
                take: 1,
                orderBy: { createdAt: "desc" },
            }
        }
    });

    const serialized = conversations.map(c => ({
        ...c,
        updatedAt: c.updatedAt.toISOString(),
        createdAt: c.createdAt.toISOString(),
        messages: c.messages.map(m => ({
            ...m,
            createdAt: m.createdAt.toISOString(),
        }))
    }));

    return <ConversationsClient conversations={serialized} />;
}
