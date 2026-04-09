import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";
import { users } from "./db/schema";

export async function getUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/api/auth/login");
  }
  return user;
}

export async function getAuthenticatedUser() {
  const user = await getUser();
  if (!user || !user.id || !user.email) {
    throw new Error("Unauthorized");
  }

  // Sync user with database
  await db.insert(users).values({
    id: user.id,
    name: `${user.given_name || ""} ${user.family_name || ""}`.trim() || user.username || "User",
    email: user.email,
  }).onConflictDoNothing();

  return user;
}
