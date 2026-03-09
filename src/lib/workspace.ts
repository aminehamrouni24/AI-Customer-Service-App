import prisma from "@/lib/prisma";
import { generateEmbedding } from "@/lib/ai";
import crypto from "crypto";

export async function createWorkspace(userId: string, name: string) {
    const randomSuffix = crypto.randomBytes(3).toString("hex");
    const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${randomSuffix}`;
    const apiKey = `sk_${crypto.randomBytes(24).toString("hex")}`;

    console.log("[createWorkspace] Creating workspace for user:", userId);

    // Step 1: Create workspace + membership
    const workspace = await prisma.workspace.create({
        data: {
            name,
            slug,
            apiKey,
            memberships: {
                create: {
                    userId,
                    role: "OWNER",
                },
            },
        },
    });

    console.log("[createWorkspace] Workspace created:", workspace.id);

    // Step 2: Create widgetConfig separately (to isolate failures)
    await prisma.widgetConfig.create({
        data: {
            workspaceId: workspace.id,
        },
    }).catch((e) => {
        console.warn("[createWorkspace] widgetConfig creation failed (non-fatal):", e.message);
    });

    console.log("[createWorkspace] Done.");
    return workspace;
}

export async function addKnowledgeSource(workspaceId: string, title: string, type: string, content: string) {
    const source = await prisma.knowledgeSource.create({
        data: {
            workspaceId,
            title,
            type,
            content,
            status: "INDEXING",
        },
    });

    // Start indexing in the background (simplified for now)
    processKnowledgeSource(source.id, content);

    return source;
}

async function processKnowledgeSource(sourceId: string, content: string) {
    try {
        console.log(`[INDEXING] Starting for source ${sourceId}...`);

        // Basic chunking logic
        const chunks = content.split("\n\n").filter(c => c.trim().length > 0);
        console.log(`[INDEXING] Found ${chunks.length} chunks.`);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(`[INDEXING] Generating embedding for chunk ${i + 1}/${chunks.length}...`);
            const embedding = await generateEmbedding(chunk);

            console.log(`[INDEXING] Saving chunk ${i + 1}/${chunks.length} to database...`);
            await prisma.knowledgeChunk.create({
                data: {
                    sourceId,
                    content: chunk,
                    embedding,
                },
            });
        }

        console.log(`[INDEXING] Indexing successful for source ${sourceId}.`);
        await prisma.knowledgeSource.update({
            where: { id: sourceId },
            data: {
                status: "READY",
                lastIndexedAt: new Date(),
            },
        });
    } catch (error: any) {
        console.error(`[INDEXING ERROR] Failed for source ${sourceId}:`, error);
        if (error.response) {
            console.error(`[INDEXING ERROR] OpenAI API Response:`, error.response.data);
        }
        await prisma.knowledgeSource.update({
            where: { id: sourceId },
            data: { status: "ERROR" },
        });
    }
}
