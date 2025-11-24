import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import CourseController from "@/components/admin/course/CourseController";
import { getCourseById } from "@/actions/admin/course";
import { getUnitsForCourse } from "@/actions/admin/units";
import { getLessonsForCourse } from "@/actions/admin/lesson";
import Link from "next/link";

export default async function CourseIdPage({ 
  params 
}: { 
  params: Promise<{ courseId: string}> 
}) {
  const { courseId } = await params; 
  const id = Number(courseId);
  const [course, units, lessons] = await Promise.all([
    getCourseById(id),
    getUnitsForCourse(id),
    getLessonsForCourse(id),
  ]);
  console.log("Courses:", course);
  console.log("Units:", units);
  console.log("Lessons:", lessons);

  if (!course) {
    return (
      // Should be 404 we need one
      <div className="">empty</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-4">
        <Link href={`/admin/courses/${id}/lesson/create`}>
          <Button variant={"outline"} className="cursor-pointer">Create Lesson</Button>
        </Link>
        <Link href={`/admin/courses/${id}/units/create`}>
          <Button variant={"outline"} className="cursor-pointer">Create Unit</Button>
        </Link>
      </div>
      <Card>
        <CardTitle className="px-6 text-3xl">
          <span className="font-semibold">Course: </span>
          <span className="font-light">{course.title}</span>
        </CardTitle>
        <CardDescription className="px-6 text-md">{course.description}</CardDescription>
        <CardContent>
          <CourseController units={units} lessons={lessons} />
        </CardContent>
      </Card>
    </div>
  )
}