"use server";

import * as z from "zod";

const CourseServerSchema = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "may only contain lowercase letters, numbers and hyphens"),
  description: z.string().min(10),
  difficulty: z.coerce.number().min(0),
  published: z.coerce.boolean().optional(),
});

type ActionResultSuccess = { success: true; course: Record<string, any> };
type ActionResultFailure = { success: false; message: string; issues?: any };
export type ActionResult = ActionResultSuccess | ActionResultFailure;

function parseFormDataToObj(formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, FormDataEntryValue | undefined>;

  const title = raw.title ? String(raw.title) : "";
  const description = raw.description ? String(raw.description) : "";
  const difficulty = raw.difficulty === undefined ? 0 : Number(raw.difficulty);
  const publishedRaw = raw.published === undefined ? "" : String(raw.published).toLowerCase();
  const published = publishedRaw === "true" || publishedRaw === "on" || publishedRaw === "1";

  return { title, description, difficulty, published };
}

export async function createCourse(formData: FormData): Promise<ActionResult> {
  const parsedInput = parseFormDataToObj(formData);
  const safe = CourseServerSchema.safeParse(parsedInput);
  if (!safe.success) {
    return { success: false, message: "Validation failed", issues: safe.error.format() };
  }
  const data = safe.data;

  try {
    
    console.log("FAKE CREATE COURSE (server):", data);
    return { success: true, course: data };
  } catch (err: any) {
    console.error("DB insert failed:", err);
    return { success: false, message: "DB insert failed", issues: String(err?.message ?? err) };
  }
}
