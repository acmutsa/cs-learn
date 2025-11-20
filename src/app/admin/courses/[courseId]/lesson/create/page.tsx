// src/app/admin/courses/[courseId]/lesson/create/page.tsx

import { db } from "@/db/index";
import { units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CreateLessonForm } from "./CreateLessonForm";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CreateLessonPage({ params }: PageProps) {
  const { courseId } = await params;

  // courseId in the URL will be something like "1"
  const courseUnits = await db
    .select()
    .from(units)
    .where(eq(units.courseId, courseId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create lesson
        </h1>
        <p className="text-sm text-muted-foreground">
          Add a new lesson and assign it to a unit in this course.
        </p>
      </div>

      <CreateLessonForm
        courseId={courseId}
        initialUnits={courseUnits.map((u) => ({
          id: u.id,
          title: u.title ?? `Unit ${u.id}`,
        }))}
      />
    </div>
  );
}
