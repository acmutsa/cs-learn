import { z } from "zod";

export const courseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().max(500, "Description is too long").optional().or(z.literal("")),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).refine((val) => val != undefined, {
        message: "Please select a difficult level.",
    }),
    tags: z.array(z.string()).optional(),

});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const tagSchema = z.object({
    tagName: z.string().min(3, "Tag must be at least 3 characters long.").max(10, "Tag must be less than or equal to 10 characters long."), 
});

export type TagFormValues = z.infer<typeof tagSchema>;