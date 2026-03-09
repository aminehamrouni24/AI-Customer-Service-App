import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getChatResponse } from "@/lib/ai-service";

export async function POST(req: Request) {
    try {
        const { messages, workspaceId } = await req.json();

        if (!messages || !workspaceId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Basic MongoDB ObjectId validation (24 hex chars)
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(workspaceId)) {
            return NextResponse.json({ error: "Invalid workspace ID format" }, { status: 400 });
        }

        // Auth check for dashboard-side chat
        const session = await auth();
        if (!session) {
            // For public widget, we might skip auth or use API key
        }

        const conversationId = messages[0].conversationId || null;

        let conversation;
        if (conversationId) {
            conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        } else {
            conversation = await prisma.conversation.create({
                data: {
                    workspaceId,
                    visitorId: "anonymous", // Fallback for now
                }
            });
        }

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // Save user message
        const lastMessage = messages[messages.length - 1];
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: "USER",
                content: lastMessage.content,
            }
        });

        const response = await getChatResponse(workspaceId, messages);

        // Save assistant message
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: "ASSISTANT",
                content: response || "",
            }
        });

        return NextResponse.json({
            content: response,
            conversationId: conversation.id
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
