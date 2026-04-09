import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { eq } from "drizzle-orm";

async function verifyConnection() {
  console.log("🚀 Testing database connection...");

  try {
    // 1. Try to fetch all users
    const allUsers = await db.select().from(users);
    console.log(`✅ Connection successful. Found ${allUsers.length} users.`);

    // 2. Insert a test user
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`📝 Inserting test user: ${testEmail}...`);
    
    const [insertedUser] = await db.insert(users).values({
      id: `test-user-${Date.now()}`,
      name: "Test User",
      email: testEmail,
    }).returning();

    console.log("✅ User inserted successfully:", insertedUser);

    // 3. Clean up (optional, but good for test)
    console.log(`🧹 Cleaning up test user...`);
    await db.delete(users).where(eq(users.id, insertedUser.id));
    console.log("✅ Cleanup complete.");

    console.log("\n✨ Database verification PASSED!");
  } catch (error) {
    console.error("❌ Database verification FAILED:");
    console.error(error);
    process.exit(1);
  }
}

verifyConnection();
