// src/app/admin/courses/[courseId]/lesson/create/page.tsx
import React from "react";

export default async function CreateLessonPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Lesson</h1>
      <p className="text-sm text-muted-foreground">
        Create a lesson for course <span className="font-mono">{courseId}</span>.
      </p>

      {/* Placeholder until LessonForm is added */}
      <div className="rounded-lg border bg-card p-6 text-sm text-foreground/80 dark:border-neutral-800">
        Form coming next: unit dropdown, media type, content URL/blob, create-unit modal.
      </div>
    </div>
  );
}
