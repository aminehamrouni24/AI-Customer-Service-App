import { OpenAI } from "openai";
import { pipeline } from "@xenova/transformers";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const openai = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

let embeddingPipeline: any = null;

async function getEmbeddingPipeline() {
    if (!embeddingPipeline) {
        embeddingPipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    return embeddingPipeline;
}

export async function generateEmbedding(text: string): Promise<number[]> {
    const extractor = await getEmbeddingPipeline();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
}
