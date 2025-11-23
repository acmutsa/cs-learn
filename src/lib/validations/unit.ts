import { z } from "zod";
export const unitFormSchema = z.object({
  title: z.string().min(1, "Unit title is required"),
  courseId: z.number().min(1, "Course ID is required"),
});

export type UnitFormValues = z.infer<typeof unitFormSchema>;