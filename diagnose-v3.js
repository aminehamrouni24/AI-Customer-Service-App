const { OpenAI } = require("openai");
const { pipeline } = require("@xenova/transformers");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const prisma = new PrismaClient();

async function diagnose() {
    console.log("--- SupportIQ Groq + Local AI Stack Diagnosis ---");

    // 1. Check Env
    console.log("1. Checking Environment Variables...");
    if (!process.env.GROQ_API_KEY) {
        console.error("❌ GROQ_API_KEY is missing!");
    } else {
        console.log("✅ GROQ_API_KEY is present.");
    }

    // 2. Check Local Embeddings
    console.log("\n2. Checking Local Embedding Generation (@xenova/transformers)...");
    try {
        const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        const output = await extractor("Test embedding", { pooling: "mean", normalize: true });
        console.log(`✅ Local Embedding generated successfully (Dimension: ${output.data.length}).`);
    } catch (error) {
        console.error("❌ Local Embedding Error:", error.message);
    }

    // 3. Check Groq Connectivity
    console.log("\n3. Checking Groq API Connectivity (OpenAI-compatible)...");
    const groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
    });
    try {
        const response = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: "Hi" }],
            max_tokens: 5
        });
        console.log("✅ Groq API responded successfully.");
        console.log("Response snippet:", response.choices[0].message.content);
    } catch (error) {
        console.error("❌ Groq Error:", error.message);
    }

    // 4. Check Database
    console.log("\n4. Checking MongoDB Connectivity...");
    try {
        await prisma.$connect();
        const userCount = await prisma.user.count();
        console.log(`✅ Connected to MongoDB. Found ${userCount} users.`);
    } catch (error) {
        console.error("❌ MongoDB Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }

    console.log("\n--- Diagnosis Complete ---");
}

diagnose();
