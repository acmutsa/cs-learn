"use server";

import { actionClient } from "@/lib/safe-action";
import { insertCourseSchema } from "@/lib/types";
import { db } from "@/db";
import { courses } from "@/db/schema";

export const createCourse = actionClient
  .inputSchema(insertCourseSchema)
  .action(async ({ parsedInput }) => {
    const course = await db.insert(courses).values(parsedInput).returning();
    return course[0].id;
});