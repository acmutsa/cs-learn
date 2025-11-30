"use server";

import { adminClient } from "@/lib/safe-action";
import { db } from "@/db";
import { courses, coursesTags, tags } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

// validation schema for updating a course
const updateCourseSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.array(z.string()).optional(), // safe to ignore for now
});

export const updateCourseAction = adminClient
  .schema(updateCourseSchema)
  .action(async ({ parsedInput }) => {
    const { id, title, description, difficulty, tags: tagNames } = parsedInput;

    // make sure the course exists
    const existing = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id));

    if (existing.length === 0) {
      return { success: false, serverError: "Course not found." };
    }

    // update the course fields
    await db
      .update(courses)
      .set({
        title,
        description,
        difficulty,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id));

    // tag updating logic
    if (tagNames && tagNames.length > 0) {
      await db.delete(coursesTags).where(eq(coursesTags.courseId, id));

      const dbTags = await db
        .select()
        .from(tags)
        .where(inArray(tags.tagName, tagNames));

      for (const tag of dbTags) {
        await db.insert(coursesTags).values({
          courseId: id,
          tagId: tag.id,
        });
      }
    }

    return { success: true, message: "Course updated successfully." };
  });
