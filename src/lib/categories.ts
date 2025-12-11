import { eq } from "drizzle-orm";
import { db } from "@/db"; 
import { tags, courses, coursesTags, type Tag, type Course } from "@/db/schema";

export type TagWithCourses = Tag & {
  courses: Course[];
};

export async function getCoursesGroupedByTag(): Promise<TagWithCourses[]> {
  const rows = await db
    .select({
      tagId: tags.id,
      tagName: tags.tagName,
      tagCreatedAt: tags.createdAt,
      tagUpdatedAt: tags.updatedAt,
      courseId: courses.id,
      courseTitle: courses.title,
      courseDescription: courses.description,
      courseDifficulty: courses.difficulty,
      courseCreatedBy: courses.createdBy,
      courseCreatedAt: courses.createdAt,
      courseUpdatedAt: courses.updatedAt,
    })
    .from(tags)
    .leftJoin(coursesTags, eq(tags.id, coursesTags.tagId))
    .leftJoin(courses, eq(coursesTags.courseId, courses.id));

  const map = new Map<number, TagWithCourses>();

  for (const row of rows) {
    if (!row.tagId) continue;

    let tag = map.get(row.tagId);
    if (!tag) {
        tag = {
            id: row.tagId,
            tagName: row.tagName,
            createdBy: null, 
            createdAt: row.tagCreatedAt,
            updatedAt: row.tagUpdatedAt,
            courses: [],
        };
        map.set(row.tagId, tag);
    }

    if (
        row.courseId &&
        row.courseTitle &&
        row.courseDifficulty &&
        row.courseCreatedAt &&
        row.courseUpdatedAt
    ) {
        const course: Course = {
        id: row.courseId,
        title: row.courseTitle,
        description: row.courseDescription, 
        difficulty: row.courseDifficulty,
        createdBy: row.courseCreatedBy,
        createdAt: row.courseCreatedAt,
        updatedAt: row.courseUpdatedAt,
        };

        tag.courses.push(course);
    }
}

  return Array.from(map.values()).filter((t) => t.courses.length > 0);
}
