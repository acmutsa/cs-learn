'use server';
import { adminClient } from "@/lib/safe-action";
import { coursesTags, courses, users, tags } from "@/db/schema";
import { courseSchema, type CourseFormValues } from "@/lib/validations/course";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { CourseWithData } from "@/lib/types";

export const createCourseAction = adminClient
  .schema(courseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { title, description, difficulty, tags: tagNames } = parsedInput;
    const existing = await db
      .select()
      .from(courses)
      .where(eq(courses.title, title));
    if (existing.length > 0) {
      return { success: false, message: "Course with this title already exists.",}
    }
    const [created] = await db
      .insert(courses)
      .values({
        title,
        description,
        difficulty,
        createdBy: ctx.userId,
      })
      .returning();
    if (tagNames?.length) {
      for (const tagName of tagNames) {
        const [tag] = await db
          .select()
          .from(tags)
          .where(eq(tags.tagName, tagName));

        if (tag) {
          await db.insert(coursesTags).values({
            courseId: created.id,
            tagId: tag.id,
          });
        }
      }
    }
    return { success: true, message: "Course created!",};
  });

export async function getAllCourses(): Promise<CourseWithData[]> {
  const rows = await db
    .select({
      courseId: courses.id,
      title: courses.title,
      description: courses.description,
      difficulty: courses.difficulty,
      createdBy: users.name,
      tagName: tags.tagName,
    })
    .from(courses)
    .leftJoin(coursesTags, eq(coursesTags.courseId, courses.id))
    .leftJoin(tags, eq(tags.id, coursesTags.tagId))
    .leftJoin(users, eq(users.id, courses.createdBy));

  // Group rows by courseId
  const coursesMap: Record<number, CourseWithData> = {};

  for (const row of rows) {
    if (!coursesMap[row.courseId]) {
      coursesMap[row.courseId] = {
        id: row.courseId,
        title: row.title,
        description: row.description,
        difficulty: row.difficulty,
        createdBy: row.createdBy,
        tags: [],
      };
    }
    if (row.tagName) {
      coursesMap[row.courseId].tags.push(row.tagName);
    }
  }

  return Object.values(coursesMap);
}

export async function getCourseById(id: number) {
  const rows = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      difficulty: courses.difficulty,
      createdBy: users.name,
      tagName: tags.tagName,
    })
    .from(courses)
    .leftJoin(users, eq(users.id, courses.createdBy))
    .leftJoin(coursesTags, eq(coursesTags.courseId, courses.id))
    .leftJoin(tags, eq(tags.id, coursesTags.tagId))
    .where(eq(courses.id, id));

  if (rows.length === 0) return null;

  const course = {
    id: rows[0].id,
    title: rows[0].title,
    description: rows[0].description,
    difficulty: rows[0].difficulty,
    createdBy: rows[0].createdBy,
    tags: rows.map((r) => r.tagName).filter(Boolean),
  };

  return course;
}