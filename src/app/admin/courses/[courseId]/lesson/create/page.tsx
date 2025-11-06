import React from "react";

export default function CreateLessonPage({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Create Lesson</h1>
        <p className="text-sm text-neutral-500">
          Course ID: <span className="font-mono">{params.courseId}</span>
        </p>
      </header>

      {/* Step 2 will replace this with the real form */}
      <div className="rounded-lg border bg-white p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        Form coming next: title, description, unit dropdown, “Create Unit” modal.
      </div>
    </div>
  );
}
