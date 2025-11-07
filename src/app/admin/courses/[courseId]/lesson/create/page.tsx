// src/app/admin/courses/[courseId]/lesson/create/page.tsx
import React from "react";

export default async function CreateLessonPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Create Lesson</h1>
        <p className="text-sm text-neutral-500">
          Course ID: <span className="font-mono">{courseId}</span>
        </p>
      </header>

      {/* placeholder */}
      <div className="rounded-lg border bg-white p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        Form coming next: unit dropdown, media type, content URL/blob, create-unit modal.
      </div>
    </div>
  );
}
