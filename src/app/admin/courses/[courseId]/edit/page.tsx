import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditCourseForm from "./EditCourseForm";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  // Next.js route params must be awaited
  const { courseId } = await params;

  // convert URL param from string to number
  const id = Number(courseId);

  // guard against invalid IDs
  if (isNaN(id)) {
    return <div>Invalid course id.</div>;
  }

  // fetch course row by ID using Drizzle ORM (returns array)
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id));

  // course not found error
  if (!course) {
    return <div>Course not found.</div>;
  }

  // if the course exists, render the edit page and pass the course record into the EditCourseForm component
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <EditCourseForm course={course} />
    </div>
  );
}
