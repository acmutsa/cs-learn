'use server';
import { adminClient } from "@/lib/safe-action";
import { coursesTags, courses, users, tags } from "@/db/schema";
import { courseSchema, type CourseFormValues } from "@/lib/validations/course";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { CourseWithData } from "@/lib/types";
import { units, lessons } from "@/db/schema";
import { z } from "zod";

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

export const updateLessonUnitOrder = adminClient
  .schema(
    z.object({
      updatedUnits: z.array(
        z.object({
          id: z.number(),
          position: z.number(),
        })
      ),
      updatedLessons: z.array(
        z.object({
          id: z.number(),
          unitId: z.number(),
          position: z.number(),
        })
      ),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { updatedUnits, updatedLessons } = parsedInput;

    try {
      // --- Step 1: Validate unit IDs exist ---
      const dbUnits = await db.select().from(units).where(inArray(units.id, updatedUnits.map(u => u.id)));
      if (dbUnits.length !== updatedUnits.length) {
        return { success: false, message: "One or more units are invalid." };
      }

      // --- Step 2: Validate lesson IDs exist ---
      const dbLessons = await db.select().from(lessons).where(inArray(lessons.id, updatedLessons.map(l => l.id)));
      if (dbLessons.length !== updatedLessons.length) {
        return { success: false, message: "One or more lessons are invalid." };
      }

      // --- Step 3: Check unique and sequential positions for units ---
      const unitPositions = updatedUnits.map(u => u.position);
      const uniqueUnitPositions = new Set(unitPositions);
      if (uniqueUnitPositions.size !== updatedUnits.length) {
        return { success: false, message: "Duplicate positions found for units." };
      }

      const sortedUnitPositions = [...unitPositions].sort((a, b) => a - b);
      for (let i = 0; i < sortedUnitPositions.length; i++) {
        if (sortedUnitPositions[i] !== i + 1) {
          return { success: false, message: "Unit positions must be sequential starting from 1." };
        }
      }

      // --- Step 4: Check unique and sequential positions for lessons within each unit ---
      const lessonsByUnit = updatedLessons.reduce((acc: Record<number, number[]>, l) => {
        if (!acc[l.unitId]) acc[l.unitId] = [];
        acc[l.unitId].push(l.position);
        return acc;
      }, {} as Record<number, number[]>);

      for (const unitId in lessonsByUnit) {
        const positions = lessonsByUnit[unitId].sort((a, b) => a - b);
        for (let i = 0; i < positions.length; i++) {
          if (positions[i] !== i + 1) {
            return { success: false, message: `Lesson positions in unit ${unitId} must be sequential starting from 1.` };
          }
        }
      }

      // --- Step 5: Update within a transaction ---
      await db.transaction(async (tx) => {
        for (const unit of updatedUnits) {
          await tx.update(units)
            .set({ position: unit.position })
            .where(eq(units.id, unit.id));
        }

        for (const lesson of updatedLessons) {
          await tx.update(lessons)
            .set({ position: lesson.position, unitId: lesson.unitId })
            .where(eq(lessons.id, lesson.id));
        }
      });

      return { success: true, message: "Units and lessons order updated successfully." };
    } catch (error) {
      console.error("Failed to update lesson/unit order", error);
      return { success: false, message: "Failed to update order." };
    }
  });