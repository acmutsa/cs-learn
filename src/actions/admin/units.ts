// src/app/admin/courses/[courseId]/lesson/create/actions.ts
'use server';

import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { units } from "@/db/schema";
import { createUnitSchema } from "@/lib/validations/unit";
import { actionClient } from "@/lib/safe-action";

// Create unit (for the modal)
export const createUnitAction = actionClient
  .schema(createUnitSchema)
  .action(async ({ parsedInput }) => {
    const { title, courseId } = parsedInput;
    // Minimal insert: courseId (text) + title; position defaults to 1
    const [unit] = await db
      .insert(units)
      .values({
        courseId,
        title,
      })
      .returning();

    revalidatePath(`/admin/courses/${courseId}`);

    return {
      success: true,
      unitId: unit.id,
      unitTitle: unit.title,
    };
});
