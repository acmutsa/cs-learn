// src/db/seed.ts
import { getDb } from "./client";
import { users, profiles, courses, tags, units, coursesTags } from "./schema";

const id = () => crypto.randomUUID();

async function main() {
  const db = getDb();

  const userId = id();
  await db.insert(users).values({
    userId, provider: "better-auth", subject: "demo-123",
    email: "demo@example.com", displayName: "Demo Instructor",
  }).onConflictDoNothing();

  await db.insert(profiles).values({ profileId: id(), userId, role: "instructor" })
    .onConflictDoNothing();

  const tagId = id();
  await db.insert(tags).values({ tagId, tagName: "cuda" }).onConflictDoNothing();

  const courseId = id();
  await db.insert(courses).values({
    courseId, title: "Intro to Parallel Programming",
    description: "CUDA • OpenMP • MPI", difficulty: "intermediate", createdBy: userId,
  });

  await db.insert(coursesTags).values({ courseId, tagId });

  const unitId = id();
  await db.insert(units).values({ unitId, courseId, title: "CUDA Basics", position: 1 });

  console.log("✅ Seed complete");
}
main().catch((e) => { console.error(e); process.exit(1); });
