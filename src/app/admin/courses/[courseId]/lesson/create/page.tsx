import { db } from "@/db/index";
import { units } from "@/db/schema";
import { eq } from "drizzle-orm";
import CreateLessonForm from "@/components/admin/lesson/CreateLessonForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { CourseIdPageProps } from "@/lib/types"; 

export default async function CreateLessonPage({ params }: CourseIdPageProps) {
  const { courseId } = await params;
  const id = Number(courseId);

  const courseUnits = await db
    .select()
    .from(units)
    .where(eq(units.courseId, id));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Create lesson
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Define lesson details, add content, and assign it to a unit in this
          course.
        </p>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lesson details</CardTitle>
          <CardDescription>
            Fill out the fields below to create a new lesson. You can also
            create a new unit on the fly if you need one.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <CreateLessonForm
            courseId={id}
            initialUnits={courseUnits.map((u) => ({
              id: u.id,
              title: u.title ?? `Unit ${u.id}`,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
