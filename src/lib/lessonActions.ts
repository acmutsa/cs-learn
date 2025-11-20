// src/app/admin/courses/[courseId]/lesson/create/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/index";
import { units, lessons } from "@/db/schema";
import {
  lessonFormSchema,
  createUnitSchema,
  type LessonFormSchema,
  type CreateUnitSchema,
} from "@/lib/lesson";
import { actionClient } from "@/lib/safe-action";

// Create lesson
export const createLessonAction = actionClient
  .schema(lessonFormSchema)
  .action(async ({ parsedInput }) => {
    const { title, description, unitId, courseId } = parsedInput;

    // Build metadata JSON stored in lessons.metadata
    const metadata = JSON.stringify({
      title,
      description: description ?? "",
    });

    await db.insert(lessons).values({
      unitId,              // integer
      metadata,            // JSON string
      contentUrl: "http://placeholder",      // satisfy CHECK (exactly one of contentUrl/contentBlobId)
      // mediaType & position are using DB defaults:
      // mediaType: "markdown"
      // position: 1
    });

    // Revalidate course page or lessons list
    revalidatePath(`/admin/courses/${courseId}`);

    return { success: true };
  });

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
