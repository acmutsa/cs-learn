import { z } from "zod";
export const courseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").trim(),
    description: z.string().max(500, "Description is too long").trim().optional().or(z.literal("")),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).refine((val) => val != undefined, {
        message: "Please select a difficult level.",
    }),
    tags: z.array(z.string()).optional(),

});
export type CourseFormValues = z.infer<typeof courseSchema>;
