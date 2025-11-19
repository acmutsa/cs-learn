"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

const actionClient = createSafeActionClient();

export const deleteCourseAction = actionClient
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;

    await db.delete(courses).where(eq(courses.id, id));

    return { success: true };
  });
