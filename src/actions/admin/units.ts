'use server';
import { db } from "@/db/index";
import { units } from "@/db/schema";
import { unitFormSchema } from "@/lib/validations/unit";
import { adminClient } from "@/lib/safe-action";
import { eq, asc, sql, and } from "drizzle-orm";
import { z } from "zod";

export const createUnitAction = adminClient
  .schema(unitFormSchema)
  .action(async ({ parsedInput }) => {
    const { title, courseId } = parsedInput;
    const [maxPositionRow] = await db
    .select({ maxPosition: sql<number>`MAX(${units.position})` })
    .from(units)
    .where(eq(units.courseId, courseId));
    
    const newPosition = (maxPositionRow?.maxPosition ?? 0) + 1;

    const existing = await db
      .select()
      .from(units)
      .where(and(eq(units.title, title), eq(units.courseId, courseId)));
    if (existing.length > 0) {
      return { success: false, message: "Unit with this title already exists.", }
    }
    const [newUnit] = await db
      .insert(units)
      .values({
        courseId,
        title,
        position: newPosition,
      })
      .returning({ id: units.id, title: units.title});

    return { 
      success: true, 
      message: "Success",
      unitId: newUnit.id,
      unitTitle: newUnit.title,
    };
});

export async function getUnitsForCourse(courseId: number) {
  return await db
    .select()
    .from(units)
    .where(eq(units.courseId, courseId))
    .orderBy(asc(units.position));
}

// update an existing unit
export const updateUnitAction = adminClient
  // extend schema to require ID of the unit to update
  .schema(
    unitFormSchema.extend({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput }) => {
    const { id, title, courseId } = parsedInput;

    // check if another unit with same title exists
    const existing = await db
      .select()
      .from(units)
      .where(and(eq(units.title, title), eq(units.courseId, courseId)));

    // if a duplicate exists AND it's not this unit, return an error
    if (existing.length > 0 && existing[0].id !== id) {
      return {
        success: false,
        serverError: "A unit with this title already exists.",
      };
    }

    // update the unit's title
    await db
      .update(units)
      .set({ title })
      .where(eq(units.id, id));

    return { success: true };
  });
