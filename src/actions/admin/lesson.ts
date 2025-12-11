'use server';
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { lessons, units } from "@/db/schema";
import { lessonFormSchema } from "@/lib/validations/lesson";
import { actionClient, adminClient } from "@/lib/safe-action";
import { eq, asc, sql } from "drizzle-orm";
import { z } from "zod";

export const createLessonAction = actionClient
  .schema(lessonFormSchema)
  .action(async ({ parsedInput }) => {
    const {
      title,
      description,
      unitId,
      courseId,
      mediaType,
      contentUrl,
    } = parsedInput;

    const [maxPosition] = await db
      .select({ maxPosition: sql<number>`MAX(${lessons.position})` })
      .from(lessons)
      .where(eq(lessons.unitId, unitId))

    const newPosition = (maxPosition?.maxPosition ?? 0) + 1;

    // store contentUrl in metadata JSON (contentUrl is not a DB column)
    const metadata = JSON.stringify({
      title,
      description: description ?? "",
      contentUrl,
    });

    await db.insert(lessons).values({
      unitId,
      title,
      description,
      mediaType,
      metadata,
      position: newPosition,
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return { success: true };
});

// fetch lessons for a course (exclude content blob for client component compatibility)
export async function getLessonsForCourse(courseId: number) {
  const rows = await db
    .select({
      id: lessons.id,
      unitId: lessons.unitId,
      title: lessons.title,
      description: lessons.description,
      mediaType: lessons.mediaType,
      metadata: lessons.metadata,
      position: lessons.position,
      createdAt: lessons.createdAt,
      updatedAt: lessons.updatedAt,
    })
    .from(units)
    .innerJoin(lessons, eq(units.id, lessons.unitId))
    .where(eq(units.courseId, courseId))
    .orderBy(asc(units.position), asc(lessons.position));

  return rows;
}

// Update an existing lesson's details
export const updateLessonAction = adminClient
  // extend lesson schema to require lesson ID
  .schema(
    lessonFormSchema.extend({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput }) => {
    const { id, title, description, unitId, courseId, mediaType, contentUrl } =
      parsedInput;

    // build metadata JSON to store contentUrl and other info
    const metadata = JSON.stringify({
      title,
      description: description ?? "",
      contentUrl,
    });

    // update the lesson in the database
    await db
      .update(lessons)
      .set({
        title,
        description,
        unitId,
        mediaType,
        metadata,
      })
      .where(eq(lessons.id, id));

    // revalidate the course page so it shows updated data
    revalidatePath(`/admin/courses/${courseId}`);

    return { success: true };
  });

// Fetch a single lesson by ID (for loading into edit form)
export async function getLessonById(lessonId: number) {
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId));

  return lesson ?? null;
}