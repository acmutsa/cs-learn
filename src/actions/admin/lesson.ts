'use server';
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { lessons } from "@/db/schema";
import { lessonFormSchema } from "@/lib/validations/lesson";
import { actionClient } from "@/lib/safe-action";

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