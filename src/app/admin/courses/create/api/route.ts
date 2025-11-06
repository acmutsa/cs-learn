import { NextResponse } from "next/server";
import * as z from "zod";

const CourseInput = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens"),
  description: z.string().min(10),
  price: z.number().min(0),
  published: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CourseInput.parse(body);

    // FAKE: log the payload while schema/DB is not ready
    console.log("API: create course (fake):", parsed);

    // TODO: replace with Drizzle insert when schema is ready:
    // import { db } from "@/db/index";
    // import { courses } from "@/db/schema";
    // const inserted = await db.insert(courses).values({
    //   title: parsed.title,
    //   slug: parsed.slug,
    //   description: parsed.description,
    //   price: parsed.price,
    //   published: parsed.published ?? false,
    // }).returning();

    // send back created object (fake)
    return NextResponse.json({ success: true, course: parsed }, { status: 201 });
  } catch (err: any) {
    console.error("create course error:", err);
    if (err?.issues || err?.name === "ZodError") {
      // zod errors
      return NextResponse.json(
        { success: false, message: "Validation error", issues: err.errors ?? err.issues },
        { status: 422 }
      );
    }
    return NextResponse.json({ success: false, message: err?.message ?? "Server error" }, { status: 500 });
  }
}
