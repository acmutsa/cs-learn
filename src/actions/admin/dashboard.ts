import { db } from "@/db";
import { users, courses, tags } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export async function getAdminRows() {
    const adminRows = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.role, "admin"));
    const adminCount = adminRows[0]?.count ?? 0;
    return adminCount;
}

export async function getRegularRows() {
    const regularRows = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.role, "user"));
    const regularCount = regularRows[0]?.count ?? 0;
    return regularCount;
}

export async function getCourseRows() {
    const coursesCountRows = await db
        .select({ count: sql<number>`count(*)` })
        .from(courses);
    const totalCourses = coursesCountRows[0]?.count ?? 0;
    return totalCourses;
}

export async function getCourseDifficultyRows() {
    const difficultyRows = await db
        .select({
            difficulty: courses.difficulty,
            count: sql<number>`count(*)`,
        })
        .from(courses)
        .groupBy(courses.difficulty);
    const courseByDifficulty = difficultyRows.map((row) => ({
        diff: row.difficulty,
        count: Number(row.count),
    }));
    return courseByDifficulty;
}

export async function getCourseTagRows() {
    const coursesByTagRows = await db
        .select({
        tag: tags.tagName,
        count: sql<number>`count(*)`,
        })
        .from(tags)
        .groupBy(tags.tagName);
    const coursesByTag = coursesByTagRows.map((row) => ({
        tag: row.tag,
        count: row.count,
    }));
    return coursesByTag;
}