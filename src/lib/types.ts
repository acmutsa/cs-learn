import { courses } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const roles = ["user", "admin"] as const;
export type Role = (typeof roles)[number];

export const insertCourseSchema = createInsertSchema(courses);
