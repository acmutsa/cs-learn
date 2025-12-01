'use client';
import { Button } from "@/components/ui/button";
import type { Lesson, Unit } from "@/db/schema";
import Link from "next/link";

interface LessonOverviewProps {
  courseId: number;
  lesson: Lesson | null;
  unit: Unit | null; // unit can be null
}

export default function LessonOverview({ courseId, lesson, unit }: LessonOverviewProps) {
  if (!lesson) return <div>Select a lesson</div>;

  return (
    <div className="relative flex w-full h-fit items-center justify-center">
      <h2 className="flex-1 text-center text-lg font-semibold">{`Unit: ${unit?.position} / Lesson: ${lesson.position}: ${lesson.title}`}</h2>
      <Link href={`/admin/courses/${courseId}/lesson/edit/${lesson.id}`}>
        <Button variant={"outline"} className="cursor-pointer">Edit Lesson</Button>
      </Link>
    </div>
  );
}