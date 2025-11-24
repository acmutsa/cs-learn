// src/lib/dashboard-data.ts
import { db } from "@/db";              // whatever your db import is
import { users, courses, tags } from "@/db/schema"; // adjust to your tables
import { sql } from "drizzle-orm";

export type DashboardData = {
  totalUsers: number;
  totalCourses: number;
  courseByDifficulty: { diff: string, count: number}[];
  coursesByTag: { tag: string; count: number }[];
};

export async function getDashboardData(): Promise<DashboardData> {
  // total users
  const usersCountRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);
  const totalUsers = usersCountRows[0]?.count ?? 0;

  // total courses
  const coursesCountRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(courses);
  const totalCourses = coursesCountRows[0]?.count ?? 0;

  //course difficulty

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
  

  // courses per tag (for bottom bar charts later)
  const coursesByTagRows = await db
    .select({
      tag: tags.tagName,                          // change if your column is different
      count: sql<number>`count(*)`,
    })
    .from(tags)
    .groupBy(tags.tagName);

  const coursesByTag = coursesByTagRows.map((row) => ({
    tag: row.tag,
    count: row.count,
  }));

  return {
    totalUsers,
    totalCourses,
    courseByDifficulty,
    coursesByTag,
  };
}


  export default async function FetchData() {
    const data = await getDashboardData();

    return (
      <pre className="p-4">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
};
