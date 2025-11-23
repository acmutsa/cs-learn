'use server';
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { lessons, units } from "@/db/schema";
import { lessonFormSchema } from "@/lib/validations/lesson";
import { actionClient } from "@/lib/safe-action";
import { eq, asc } from "drizzle-orm";

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

    const metadata = JSON.stringify({
      title,
      description: description ?? "",
    });

    await db.insert(lessons).values({
      unitId,
      mediaType,   // now real value from the form
      metadata,
      contentUrl,  // real URL from the form
      // contentBlobId stays null
    });

    revalidatePath(`/admin/courses/${courseId}`);

    return { success: true };
});

export async function getLessonsForCourse(courseId: number) {
  return await db
    .select({
      lessonId: lessons.id,
      unitId: lessons.unitId,
      mediaType: lessons.mediaType,
      contentUrl: lessons.contentUrl,
      contentBlobId: lessons.contentBlobId,
      metadata: lessons.metadata,
      lessonPosition: lessons.position,
      unitPosition: units.position,
    })
    .from(units)
    .innerJoin(lessons, eq(units.id, lessons.unitId))
    .where(eq(units.courseId, courseId))
    .orderBy(asc(units.position), asc(lessons.position));
}