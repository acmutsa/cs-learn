import { z } from "zod";
// For the “create unit” modal
export const createUnitSchema = z.object({
  title: z.string().min(1, "Unit title is required"),
  courseId: z.string().min(1),
});

export type CreateUnitValues = z.infer<typeof createUnitSchema>;