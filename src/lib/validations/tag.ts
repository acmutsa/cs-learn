import { z } from "zod";
export const tagSchema = z.object({
    tagName: z.string().min(3, "Tag must be at least 3 characters long.").max(10, "Tag must be less than or equal to 10 characters long."), 
});
export type TagFormValues = z.infer<typeof tagSchema>;
