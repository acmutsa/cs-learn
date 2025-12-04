'use server';
import { users } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

// Types you may want to define in "@/lib/types"
import { CreateResponse, Users} from "@/lib/types";

// Example: creating a new user (if your schema allows it)
export async function createUser(data: { name: string; email: string; role: string }): Promise<CreateResponse> {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session) throw new Error("Unauthorized");

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, data.email));
    if (existingUser.length > 0) {
      return { success: false, message: "User already exists." };
    }

    await db.insert(users).values({
      name: data.name,
      email: data.email,
      role: data.role,
    });

    return { success: true, message: "User created successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to create user." };
  }
}

// Get all users with optional stats (customize as needed)
export async function getAllUsersData(): Promise<Users[]> {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      // Example: if you want to count something related to users, add here
      // courseCount: sql<number>`CAST(COUNT(${courses.id}) AS INTEGER)`
    })
    .from(users);

  return result;
}

export async function getAllRegularUsers(): Promise<Users[]> {
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
  }).from(users)
  .where(eq(users.role, "user"));
  return result;
}


// Get a simple list of all users
export async function getAllUsers(): Promise<Users[]> {
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
  }).from(users);

  return result;
}