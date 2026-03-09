import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { workspaceId, name, widgetConfig } = await req.json();

        // Verify membership
        const membership = await prisma.membership.findFirst({
            where: { userId: session.user.id, workspaceId },
        });

        if (!membership || membership.role !== "OWNER") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Update workspace
        if (name) {
            await prisma.workspace.update({
                where: { id: workspaceId },
                data: { name },
            });
        }

        // Update widget config
        if (widgetConfig) {
            await prisma.widgetConfig.upsert({
                where: { workspaceId },
                update: {
                    primaryColor: widgetConfig.primaryColor,
                    greeting: widgetConfig.greeting,
                    welcomeMessage: widgetConfig.welcomeMessage,
                },
                create: {
                    workspaceId,
                    primaryColor: widgetConfig.primaryColor,
                    greeting: widgetConfig.greeting,
                    welcomeMessage: widgetConfig.welcomeMessage,
                },
            });
        }

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        console.error("[SETTINGS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
