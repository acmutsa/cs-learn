// import CourseId from "@/components/admin/CourseId";
import { getCourseById } from "@/actions/admin/course";
import { getUnitsForCourse } from "@/actions/admin/units";
import { getLessonsForCourse } from "@/actions/admin/lesson";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="">
      <Link href={`/admin/courses/${id}/units/create`}>
        <Button variant={"outline"} className="cursor-pointer">Create Unit</Button>
      </Link>
      <Link href={`/admin/courses/${id}/lesson/create`}>
        <Button variant={"outline"} className="cursor-pointer">Create Lesson</Button>
      </Link>
    </div>
  )
}