// src/lib/validations/lesson.ts
import { z } from "zod";

export const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  unitId: z.coerce.number().int().positive("Unit is required"),
  courseId: z.string().min(1),
});

export type LessonFormSchema = z.infer<typeof lessonFormSchema>;

// For the “create unit” modal
export const createUnitSchema = z.object({
  title: z.string().min(1, "Unit title is required"),
  courseId: z.string().min(1),
});

export type CreateUnitSchema = z.infer<typeof createUnitSchema>;
