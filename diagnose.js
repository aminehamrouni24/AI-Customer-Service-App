const { OpenAI } = require("openai");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const prisma = new PrismaClient();

async function diagnose() {
    console.log("--- SupportIQ Diagnosis ---");

    // 1. Check Env
    console.log("1. Checking Environment Variables...");
    if (!process.env.OPENAI_API_KEY) {
        console.error("❌ OPENAI_API_KEY is missing!");
    } else {
        console.log("✅ OPENAI_API_KEY is present.");
    }

    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is missing!");
    } else {
        console.log("✅ DATABASE_URL is present.");
    }

    // 2. Check OpenAI
    console.log("\n2. Checking OpenAI Connectivity...");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: "Test embedding",
        });
        console.log("✅ OpenAI Embedding generated successfully.");
    } catch (error) {
        console.error("❌ OpenAI Error:", error.message);
    }

    // 3. Check Database
    console.log("\n3. Checking MongoDB Connectivity...");
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
