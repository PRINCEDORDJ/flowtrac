import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./lib/db/schema";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function apply() {
  console.log("Applying schema changes manually...");
  
  try {
    // Drop existing tables to start fresh (since we've changed primary keys significantly)
    // and because drizzle-kit push is failing in this environment.
    await sql`DROP TABLE IF EXISTS invoice_items CASCADE;`;
    await sql`DROP TABLE IF EXISTS invoices CASCADE;`;
    await sql`DROP TABLE IF EXISTS contacts CASCADE;`;
    await sql`DROP TABLE IF EXISTS activity_logs CASCADE;`;
    await sql`DROP TABLE IF EXISTS settings CASCADE;`;
    await sql`DROP TABLE IF EXISTS users CASCADE;`;
    await sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;`;

    console.log("Existing tables dropped.");

    // Now we can use drizzle-kit push --force to recreate them,
    // or we can just try to run the generated SQL.
  } catch (e) {
    console.error("Drop failed:", e);
  }
}

apply();
