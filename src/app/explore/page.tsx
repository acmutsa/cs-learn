import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ExploreCoursesClient } from "@/components/client/ExploreCoursesClient";

export default async function ExplorePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const inProgressCourseIds: Array<number | string> = [];

  const allCourses = await db
    .select()
    .from(courses)
    .orderBy(desc(courses.createdAt));

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <ExploreCoursesClient
        courses={allCourses.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description ?? "",
          difficulty: c.difficulty,
          createdAt: Number(c.createdAt || 0),
        }))}
        inProgressCourseIds={inProgressCourseIds}
      />
    </div>
  );
}
