import { createSafeActionClient } from "next-safe-action";
import { getServerSession } from "next-auth";
//import { getServerSession } from "next-auth/next";
// when the user sign in



async function getUser() {
  const session = await getServerSession();
  if (!session?.user) throw new Error("You must be signed in.");
  return session.user;
}

async function requireAdmin(user: any) {
  if (user.role !== "admin") throw new Error("Not authorized.");
}

// Base clients
export const actionClient = createSafeActionClient();

export const protectedClient = actionClient.use(async () => {
  const user = await getUser();
  return { user };
});

export const adminClient = protectedClient.use(async ({ user }) => {
  await requireAdmin(user);
  return { user };
});

// Example usage
import { z } from "zod";

//say hi to the user
export const greetAction = protectedClient
  .input(z.object({ name: z.string() }))
  .action(async ({ parsedInput, user }) => {
    return { message: `Hello, ${parsedInput.name}!`, user };
  });
