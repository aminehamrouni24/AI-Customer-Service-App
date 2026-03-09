import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import KnowledgeClient from "@/components/dashboard/knowledge-client";
import { getUserWorkspace } from "@/lib/get-user-workspace";

export default async function KnowledgePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    const workspace = await getUserWorkspace(session.user.id);
    if (!workspace) redirect("/dashboard");

    const sources = await prisma.knowledgeSource.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { updatedAt: "desc" },
    });

    // Convert Date objects to ISO strings for the client component
    const serializedSources = sources.map(source => ({
        ...source,
        updatedAt: source.updatedAt.toISOString(),
        createdAt: source.createdAt.toISOString(),
        lastIndexedAt: source.lastIndexedAt?.toISOString() || null,
    }));

    return <KnowledgeClient sources={serializedSources} workspaceId={workspace.id} />;
}
