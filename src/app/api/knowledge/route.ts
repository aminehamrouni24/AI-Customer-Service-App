import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addKnowledgeSource } from "@/lib/workspace";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { workspaceId, title, type, content } = await req.json();

        if (!workspaceId || !title || !type || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const source = await addKnowledgeSource(workspaceId, title, type, content);

        return NextResponse.json(source);
    } catch (error) {
        console.error("Knowledge Source API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
