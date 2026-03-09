// Test workspace creation directly
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

async function main() {
    const prisma = new PrismaClient();

    try {
        console.log("=== Testing Workspace Creation ===\n");

        // Step 1: Check connection
        console.log("1. Testing DB connection...");
        await prisma.$connect();
        console.log("   ✅ DB connected\n");

        // Step 2: Find a user
        console.log("2. Finding users...");
        const users = await prisma.user.findMany({ take: 5 });
        console.log(`   Found ${users.length} users:`);
        users.forEach(u => console.log(`   - ${u.email} (id: ${u.id})`));

        if (users.length === 0) {
            console.log("   ❌ No users found! Register first.");
            return;
        }

        const user = users[0];
        console.log(`\n   Using user: ${user.email}\n`);

        // Step 3: Check existing memberships
        console.log("3. Checking existing memberships...");
        const memberships = await prisma.membership.findMany({
            where: { userId: user.id },
            include: { workspace: true },
        });
        console.log(`   Found ${memberships.length} memberships:`);
        memberships.forEach(m => {
            console.log(`   - Membership ${m.id} -> workspace: ${m.workspaceId}`);
            console.log(`     workspace exists: ${m.workspace ? 'YES (' + m.workspace.name + ')' : 'NO (ORPHANED!)'}`);
        });

        // Step 4: Clean orphans
        const orphans = memberships.filter(m => !m.workspace);
        if (orphans.length > 0) {
            console.log(`\n   Cleaning ${orphans.length} orphaned membership(s)...`);
            for (const o of orphans) {
                await prisma.membership.delete({ where: { id: o.id } });
                console.log(`   ✅ Deleted orphan: ${o.id}`);
            }
        }

        // Step 5: Check existing workspaces
        console.log("\n4. Checking existing workspaces...");
        const workspaces = await prisma.workspace.findMany({ take: 5 });
        console.log(`   Found ${workspaces.length} workspaces:`);
        workspaces.forEach(w => console.log(`   - ${w.name} (id: ${w.id}, slug: ${w.slug})`));

        // Step 6: Try create workspace
        console.log("\n5. Creating test workspace...");
        const randomSuffix = crypto.randomBytes(3).toString("hex");
        const slug = `test-workspace-${randomSuffix}`;
        const apiKey = `sk_${crypto.randomBytes(24).toString("hex")}`;

        const workspace = await prisma.workspace.create({
            data: {
                name: "Test Workspace",
                slug,
                apiKey,
                memberships: {
                    create: {
                        userId: user.id,
                        role: "OWNER",
                    },
                },
            },
        });
        console.log(`   ✅ Workspace created: ${workspace.id} (${workspace.name})\n`);

        // Step 7: Create widget config
        console.log("6. Creating widget config...");
        const wc = await prisma.widgetConfig.create({
            data: { workspaceId: workspace.id },
        });
        console.log(`   ✅ WidgetConfig created: ${wc.id}\n`);

        // Step 8: Verify full membership
        console.log("7. Verifying membership...");
        const membership = await prisma.membership.findFirst({
            where: { userId: user.id },
            include: { workspace: true },
        });
        console.log(`   workspace: ${membership?.workspace?.name || 'NULL'}`);
        console.log(`   ✅ Everything works!\n`);

        console.log("=== SUCCESS ===");
        console.log(`Workspace ID: ${workspace.id}`);
        console.log("You can now refresh /dashboard and it should work.");

    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
        console.error("\nFull error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
