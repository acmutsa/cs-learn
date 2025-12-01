// src/actions/update-profile.ts
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const userId = session.user.id as any;

  const name = formData.get("name");
  const image = formData.get("image");

  if (typeof name !== "string" || name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters");
  }

  await db
    .update(users)
    .set({
      name: name.trim(),
      image:
        typeof image === "string" && image.trim().length > 0
          ? image.trim()
          : null,
    })
    .where(eq(users.id, userId));

  revalidatePath("/profile");
}