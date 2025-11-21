// src/lib/lesson.ts
import { z } from "zod";

// keep this in sync with mediaTypeValues in your schema.ts
const mediaTypeValues = [
  "youtube",
  "markdown",
  "pdf",
  "image",
  "audio",
  "other",
] as const;

export const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  unitId: z.coerce.number().int().positive("Unit is required"),
  courseId: z.string().min(1),

  mediaType: z.enum(mediaTypeValues),
  contentUrl: z
    .string()
    .url("Must be a valid URL (starts with http:// or https://)"),
});

export type LessonFormSchema = z.infer<typeof lessonFormSchema>;

// For the “create unit” modal
export const createUnitSchema = z.object({
  title: z.string().min(1, "Unit title is required"),
  courseId: z.string().min(1),
});

export type CreateUnitSchema = z.infer<typeof createUnitSchema>;
