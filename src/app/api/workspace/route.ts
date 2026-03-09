import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createWorkspace } from "@/lib/workspace";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const membership = await prisma.membership.findFirst({
            where: { userId: session.user.id },
            include: { workspace: true },
        });

        if (!membership || !membership.workspace) {
            // Clean up orphaned membership
            if (membership) {
                await prisma.membership.delete({ where: { id: membership.id } }).catch(() => { });
            }
            return NextResponse.json(null, { status: 404 });
        }

        return NextResponse.json(membership.workspace);
    } catch (error) {
        console.error("[WORKSPACE_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json().catch(() => ({}));
        const name = body?.name || "My Workspace";

        const workspace = await createWorkspace(session.user.id, name);

        return NextResponse.json(workspace);
    } catch (error) {
        console.error("[WORKSPACE_POST]", error);
        return NextResponse.json({ error: (error as any)?.message || "Internal Error" }, { status: 500 });
    }
}
