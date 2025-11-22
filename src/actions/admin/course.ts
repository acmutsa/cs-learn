'use server';
import { coursesTags, courses, users, tags } from "@/db/schema";
import { type CourseFormValues } from "@/lib/validations/course";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { CreateResponse, CourseWithData } from "@/lib/types";

export async function createCourse(data: CourseFormValues): Promise<CreateResponse> {
    const user = await auth.api.getSession({
        headers: await headers()
    });
    if (!user) throw new Error("Unauthorized");
    try {
        const existingCourse = await db.select().from(courses).where(eq(courses.title, data.title));
        if (existingCourse.length > 0) {
            return { success: false, message: "Course with title already made."}
        }
        const [newCourse] = await db.insert(courses).values({
            title: data.title,
            description: data.description,
            difficulty: data.difficulty,
            createdBy: user.user.id,
        }).returning({ id: courses.id});
        const courseId = newCourse.id;
        if (data.tags && data.tags.length > 0) {
            for (const tagName of data.tags) {
                const tag = await db.select({ id: tags.id }).from(tags).where(eq(tags.tagName, tagName)).limit(1);
                if (tag.length > 0) {
                    await db.insert(coursesTags).values({
                        courseId: courseId,
                        tagId: tag[0].id,
                    });
                }
            }
        }
        return { success: true, message: "Course created successfully!" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to create course." };
    }
}

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