import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { getCourseById } from "@/actions/admin/course";
import { getUnitsForCourse } from "@/actions/admin/units";
import { getLessonsForCourse } from "@/actions/admin/lesson";
import type { CourseIdPageProps } from "@/lib/types";
import type { Lesson } from "@/db/schema";

export default async function CoursePage({ params }: CourseIdPageProps) {
  const { courseId } = await params;
  const id = Number(courseId);
  const [course, units, lessons] = await Promise.all([
    getCourseById(id),
    getUnitsForCourse(id),
    getLessonsForCourse(id),
  ]);
  // Change this so it finds the first lesson position
  const firstUnit = units.reduce((min, u) =>
    !min || u.position < min.position ? u : min,
    null as (typeof units)[number] | null
  );
  let firstLesson: number | null = null;
  if (firstUnit) {
    const lessonsInUnit = lessons.filter(l => l.unitId === firstUnit.id);
    if (lessonsInUnit.length > 0) {
      const firstLessonObj = lessonsInUnit.reduce((min, l) =>
        !min || l.position < min.position ? l : min,
        null as Lesson | null
      );
      firstLesson = firstLessonObj?.id ?? null;
    }
  }

  const buildLessonsByUnit = (lessonsArr: Lesson[]) => {
    return lessonsArr.reduce((acc: Record<number, Lesson[]>, l) => {
      if (l.unitId == null) return acc;
      if (!acc[l.unitId]) acc[l.unitId] = [];
      acc[l.unitId].push({ ...l });
      return acc;
    }, {} as Record<number, Lesson[]>);
  };
  const lessonByUnit = buildLessonsByUnit(lessons);
  
  if (!course) {
    return (
      <div className="">empty</div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-2 pb-2 md:px-5 md:pb-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-2xl">{course.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Star size={10}/>
            <p className="text-xs text-yellow-500">
              {course.difficulty[0].toUpperCase()}
              {course.difficulty.slice(1)}
            </p>
          </div>
          <CardDescription>{course.description}</CardDescription>
          <CardAction>
            <Link href={`/course/${id}/${firstLesson}`}>
              <Button variant={"outline"}>Get Started</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1">
          {/* <CourseOverview units={units} lessons={lessons}/> */}
          <Accordion type="multiple" className="flex flex-col gap-4">
            {units.map((unit, index) => (
              <AccordionItem value={`${unit.id}`} key={unit.id}>
                <AccordionTrigger className="w-full">
                  <div className="flex-1 min-w-0 flex gap-2 cursor-pointer">
                    <span className="font-bold shrink-0">
                      {`Unit ${unit.position}:`}
                    </span>
                    <span className="truncate">
                      {unit.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  {(lessonByUnit[unit.id] || []).map((lesson, lessonIndex) => (
                    <Link className="cursor-pointer hover:bg-accent/20" href={`/course/${id}/${lesson.id}`} key={lesson.id}>
                      <div className="flex gap-2 p-2 border rounded">
                          <span className="font-serif font-bold text-md">
                            {`Lesson ${lesson.position}.`}
                          </span>
                          <span>{lesson.title}</span>
                      </div>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
        <CardFooter>
          <p className="text-xs font-light italic">{`Course created by: ${course.createdBy}`}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
