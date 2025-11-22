// src/lib/lesson.ts
import { z } from "zod";
import { mediaTypeValues } from "@/db/schema";
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
export type LessonFormValues = z.infer<typeof lessonFormSchema>;
