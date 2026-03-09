import prisma from "./prisma";
import { openai, generateEmbedding } from "./ai";

export async function getRelevantContext(workspaceId: string, query: string, limit: number = 3) {
    const embedding = await generateEmbedding(query);

    // Note: MongoDB Atlas Vector Search requires careful setup.
    // For this implementation, we'll fetch the most recent chunks as a fallback
    // if vector search is not yet fully configured in the environment.
    // In a production environment, this would use $vectorSearch.

    const chunks = await prisma.knowledgeChunk.findMany({
        where: {
            source: {
                workspaceId,
            },
        },
        take: 10, // Fetch top candidates to sub-filter or just use as context
    });

    // Simple cosine similarity in JS as a robust fallback
    const scoredChunks = chunks.map(chunk => ({
        ...chunk,
        score: cosineSimilarity(embedding, chunk.embedding)
    }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scoredChunks.map(c => c.content).join("\n\n");
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
}

export async function getChatResponse(workspaceId: string, messages: { role: string, content: string }[]) {
    const lastUserMessage = messages[messages.length - 1].content;
    const context = await getRelevantContext(workspaceId, lastUserMessage);

    const systemMessage = {
        role: "system" as const,
        content: `You are a helpful AI support assistant. Use the following pieces of context to answer the user's question. If you don't know the answer, say you don't know - don't try to make up an answer.
    
    Context:
    ${context}`
    };

    const response = await openai.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [systemMessage, ...messages.map(m => ({
            role: m.role as "user" | "assistant" | "system",
            content: m.content
        }))],
    });

    return response.choices[0].message.content;
}
