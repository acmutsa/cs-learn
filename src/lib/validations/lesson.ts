import { z } from "zod";
import { mediaTypeValues } from "@/db/schema";
export const lessonFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    unitId: z.number().min(1, "Unit is required"),
    courseId: z.number().min(1),
    mediaType: z.enum(mediaTypeValues),
    content: z.string().min(1, "Content is required"),
  })
  .superRefine((data, ctx) => {
    if (data.mediaType === "youtube") {
      const isValidUrl = /^https?:\/\//.test(data.content);
      if (!isValidUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Content must be a valid URL for youtube lessons",
          path: ["content"],
        });
      }
    }
  });
export type LessonFormValues = z.infer<typeof lessonFormSchema>;