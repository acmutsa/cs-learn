'use server';
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { lessons, units } from "@/db/schema";
import type { Lesson } from "@/db/schema";
import { lessonFormSchema } from "@/lib/validations/lesson";
import { actionClient } from "@/lib/safe-action";
import { eq, asc, sql } from "drizzle-orm";

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

    const metadata = JSON.stringify({
      title,
      description: description ?? "",
    });

    await db.insert(lessons).values({
      unitId,
      title,
      description,
      mediaType,   // now real value from the form
      metadata,
      contentUrl,  // real URL from the form
      position: newPosition,
      // contentBlobId stays null
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return { success: true };
});

export async function getLessonsForCourse(courseId: number): Promise<Lesson[]> {
  const rows = await db
    .select({
      id: lessons.id,
      unitId: lessons.unitId,
      title: lessons.title,
      description: lessons.description,
      mediaType: lessons.mediaType,
      contentUrl: lessons.contentUrl,
      contentBlobId: lessons.contentBlobId,
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