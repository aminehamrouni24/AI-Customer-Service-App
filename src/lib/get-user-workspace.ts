import prisma from "@/lib/prisma";

/**
 * Safely gets the user's workspace.
 * If the membership exists but the workspace is null (orphaned), it cleans up and returns null.
 */
export async function getUserWorkspace(userId: string) {
    const membership = await prisma.membership.findFirst({
        where: { userId },
        include: { workspace: true },
    }).catch(() => null);

    if (!membership) return null;

    // Orphaned membership: workspace was deleted but membership wasn't
    if (!membership.workspace) {
        await prisma.membership.delete({ where: { id: membership.id } }).catch(() => { });
        return null;
    }

    return membership.workspace;
}
