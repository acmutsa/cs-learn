"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCourse, ActionResult } from "./actions";

const CourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.coerce.number().min(0),
  published: z.coerce.boolean().optional(),
});
type CourseForm = z.infer<typeof CourseSchema>;

export default function CreateCoursePage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CourseForm>({
    resolver: zodResolver(CourseSchema) as any,
    defaultValues: { title: "",  description: "", difficulty: 0, published: false },
  });

  const onSubmit: SubmitHandler<CourseForm> = async (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, String(v ?? "")));

    try {
      const result: ActionResult = await createCourse(fd);
      if (!result.success) {
        alert("Error: " + (result.message ?? "Unknown error"));
        console.debug("Issues:", result.issues);
        return;
      }

      alert("Course created: " + (result.course?.title ?? "unknown"));
      reset();
    } catch (err: any) {
      alert("Unexpected error: " + String(err?.message ?? err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create a New Course</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Title</label>
          <input {...register("title")} className="block w-full border p-2 rounded" />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea {...register("description")} rows={6} className="block w-full border p-2 rounded" />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <label>Difficulty</label>
          <input type="number" step="0.01" {...register("difficulty")} className="block w-full border p-2 rounded" />
          {errors.difficulty && <p className="text-sm text-red-600">{errors.difficulty.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("published")} />
          <label>Published</label>
        </div>

        <div>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-black text-white rounded">
            {isSubmitting ? "Creating…" : "Create course"}
          </button>
        </div>
      </form>
    </div>
  );
}

