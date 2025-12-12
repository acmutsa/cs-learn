// src/components/course-sidebar.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Circle, PlayCircle, FileText } from "lucide-react";

// Types based on your schema
interface Lesson {
  id: number;
  title: string;
  unitId: number | null;
  position: number;
  mediaType: "youtube" | "markdown" | string;
}

interface Unit {
  id: number;
  title: string | null;
  position: number;
}

interface CourseSidebarProps {
  units: Unit[];
  lessons: Lesson[];
  courseId: number;
  currentLessonId: number;
  currentUnitId: number;
}

export function CourseSidebar({
  units,
  lessons,
  courseId,
  currentLessonId,
  currentUnitId,
}: CourseSidebarProps) {
  // Group lessons by Unit ID
  const lessonsByUnit = lessons.reduce((acc, lesson) => {
    if (!lesson.unitId) return acc;
    if (!acc[lesson.unitId]) acc[lesson.unitId] = [];
    acc[lesson.unitId].push(lesson);
    return acc;
  }, {} as Record<number, Lesson[]>);

  // Sort units by position
  const sortedUnits = [...units].sort((a, b) => a.position - b.position);

  return (
    <div className="h-full flex flex-col border-l bg-slate-50/50 w-full">
      <div className="p-4 border-b bg-background">
        <h3 className="font-semibold text-lg">Course Content</h3>
      </div>
      <ScrollArea className="flex-1">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={[currentUnitId.toString()]} // Open the current unit by default
        >
          {sortedUnits.map((unit) => (
            <AccordionItem value={unit.id.toString()} key={unit.id} className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-slate-100 hover:no-underline">
                <span className="font-semibold text-sm">
                  Unit {unit.position}: {unit.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-0">
                <div className="flex flex-col">
                  {(lessonsByUnit[unit.id] || [])
                    .sort((a, b) => a.position - b.position)
                    .map((lesson) => {
                      const isActive = lesson.id === currentLessonId;
                      return (
                        <Link
                          key={lesson.id}
                          href={`/course/${courseId}/${lesson.id}`}
                          className={cn(
                            "flex items-center gap-3 py-3 px-6 text-sm transition-colors border-l-2",
                            isActive
                              ? "bg-primary/5 border-l-primary text-primary font-medium"
                              : "border-l-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          )}
                        >
                          {/* Icon based on media type */}
                          {lesson.mediaType === "youtube" ? (
                            <PlayCircle size={16} className={cn(isActive ? "text-primary" : "text-slate-400")} />
                          ) : (
                            <FileText size={16} className={cn(isActive ? "text-primary" : "text-slate-400")} />
                          )}
                          <span className="line-clamp-1">{lesson.title}</span>
                        </Link>
                      );
                    })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}