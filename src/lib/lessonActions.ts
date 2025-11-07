"use server";

import { z } from "zod";
import { db } from "@/db";
import { lessons, units, mediaTypeValues } from "@/db/schema";
import { adminClient } from "@/lib/safe-action";
import { asc, eq } from "drizzle-orm";

// ----- Zod Schemas -----
// Create a lesson that belongs to a unit.
// Exactly one of (contentUrl, contentBlobId) must be present.
export const CreateLessonSchema = z
  .object({
    unitId: z.coerce.number().int().min(1, "Unit is required"),
    mediaType: z.enum(mediaTypeValues),
    contentUrl: z.string().url().optional().or(z.literal("").transform(() => undefined)),
    contentBlobId: z.coerce.number().int().optional(),
    metadata: z.string().optional(), // JSON string (we'll default "{}" on insert)
    position: z.coerce.number().int().min(1).optional(),
  })
  .refine(
    (v) => !!v.contentUrl !== !!v.contentBlobId,
    "Provide either a Content URL or a Content Blob, not both."
  );

export const CreateUnitSchema = z.object({
    courseId: z.string().min(1),       // units.courseId is TEXT in schema
    title: z.string().min(2, "Unit title must be at least 2 characters"),
    position: z.coerce.number().int().min(1).optional(),
});

// ----- Actions -----
export const createLesson = adminClient
  .schema(CreateLessonSchema)
  .action(async ({ parsedInput }) => {
    const { unitId, mediaType, contentUrl, contentBlobId, metadata, position } = parsedInput;

    const [row] = await db
      .insert(lessons)
      .values({
        unitId,                           // INTEGER FK
        mediaType,                        // enum value
        contentUrl: contentUrl ?? null,   // exactly one of the two
        contentBlobId: contentBlobId ?? null,
        metadata: metadata ?? "{}",       // store JSON string
        position: position ?? 1,
      })
      .returning({ id: lessons.id });

    return { ok: true as const, lessonId: row.id };
  });

export const createUnit = adminClient
  .schema(CreateUnitSchema)
  .action(async ({ parsedInput }) => {
    const { courseId, title, position } = parsedInput;

    const [row] = await db
      .insert(units)
      .values({
        courseId,                // TEXT (matches schema)
        title,
        position: position ?? 1,
      })
      .returning({ id: units.id, title: units.title, courseId: units.courseId });

    return { ok: true as const, unit: { id: row.id, name: row.title ?? "Untitled Unit" } };
  });

// ----- Loader -----
export async function getUnitsForCourse(courseId: string) {
  // units.courseId is TEXT; route param is string -> compare as string
  const rows = await db
    .select({ id: units.id, name: units.title })
    .from(units)
    .where(eq(units.courseId, courseId))
    .orderBy(asc(units.position), asc(units.title));

  return rows.map((r) => ({ id: r.id.toString(), name: r.name ?? "Untitled Unit" }));
}
