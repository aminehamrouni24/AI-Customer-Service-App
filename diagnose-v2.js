const { OpenAI } = require("openai");
const { pipeline } = require("@xenova/transformers");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const prisma = new PrismaClient();

async function diagnose() {
    console.log("--- SupportIQ Free AI Stack Diagnosis ---");

    // 1. Check Env
    console.log("1. Checking Environment Variables...");
    if (!process.env.DEEPSEEK_API_KEY) {
        console.error("❌ DEEPSEEK_API_KEY is missing!");
    } else {
        console.log("✅ DEEPSEEK_API_KEY is present.");
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

    // 3. Check DeepSeek Connectivity
    console.log("\n3. Checking DeepSeek API Connectivity...");
    const deepseek = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: "https://api.deepseek.com"
    });
    try {
        const response = await deepseek.chat.completions.create({
            model: "deepseek-chat",
            messages: [{ role: "user", content: "Hi" }],
            max_tokens: 5
        });
        console.log("✅ DeepSeek API responded successfully.");
    } catch (error) {
        console.error("❌ DeepSeek Error:", error.message);
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
