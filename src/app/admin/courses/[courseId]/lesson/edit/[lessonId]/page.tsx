import { db } from "@/db";
import { lessons, units } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditLessonForm from "./EditLessonForm";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  // await params
  const { courseId, lessonId } = await params;

  // convert route params from strings to numbers
  const cid = Number(courseId);
  const lid = Number(lessonId);

  // validate IDs are valid numbers
  if (isNaN(cid) || isNaN(lid)) {
    return <div>Invalid ID.</div>;
  }

  // fetch the lesson from the database (exclude 'content' blob - can't pass to client)
  const [lesson] = await db
    .select({
      id: lessons.id,
      unitId: lessons.unitId,
      title: lessons.title,
      description: lessons.description,
      mediaType: lessons.mediaType,
      metadata: lessons.metadata,
    })
    .from(lessons)
    .where(eq(lessons.id, lid));

  if (!lesson) {
    return <div>Lesson not found.</div>;
  }

  // fetch all units for this course (for the unit dropdown)
  const courseUnits = await db
    .select({ id: units.id, title: units.title })
    .from(units)
    .where(eq(units.courseId, cid));

  // render the edit form with lesson data
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Lesson</h1>
      <EditLessonForm
        lesson={lesson}
        courseId={cid}
        units={courseUnits}
      />
    </div>
  );
}
