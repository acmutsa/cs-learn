'use server';
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { lessons, units } from "@/db/schema";
import { lessonFormSchema } from "@/lib/validations/lesson";
import { actionClient, adminClient } from "@/lib/safe-action";
import { eq, asc, sql } from "drizzle-orm";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export const createLessonAction = actionClient
  .schema(lessonFormSchema)
  .action(async ({ parsedInput }) => {
    const {
      title,
      description,
      unitId,
      courseId,
      mediaType,
      content,
    } = parsedInput;

    const safeContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const [maxPosition] = await db
      .select({ maxPosition: sql<number>`MAX(${lessons.position})` })
      .from(lessons)
      .where(eq(lessons.unitId, unitId))
    const newPosition = (maxPosition?.maxPosition ?? 0) + 1;
    await db.insert(lessons).values({
      unitId,
      title,
      description,
      mediaType,
      content: safeContent,
      position: newPosition,
    });
    revalidatePath(`/admin/courses/${courseId}`);

    return { success: true };
});

export async function getLessonsForCourse(courseId: number) {
  const rows = await db
    .select({
      id: lessons.id,
      unitId: lessons.unitId,
      title: lessons.title,
      description: lessons.description,
      mediaType: lessons.mediaType,
      content: lessons.content,
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

export const updateLessonAction = adminClient
  .schema(
    lessonFormSchema.safeExtend({
      lessonId: z.number(),
    })
  )
  .action(async ({ parsedInput }) => {
    const { lessonId, title, description, unitId, courseId, mediaType, content } =
      parsedInput;
    await db
      .update(lessons)
      .set({
        title,
        description,
        unitId,
        mediaType,
        content,
      })
      .where(eq(lessons.id, lessonId));
    revalidatePath(`/admin/courses/${courseId}`);
    
    return { success: true };
  });

export async function getLessonById(lessonId: number) {
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId));
  return lesson ?? null;
}