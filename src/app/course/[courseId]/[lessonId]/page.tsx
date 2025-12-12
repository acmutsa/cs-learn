// src/app/course/[courseId]/[lessonId]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

// Actions
import { getLessonById, getLessonsForCourse } from "@/actions/admin/lesson";
import { getUnitsForCourse } from "@/actions/admin/units";

// Components
import { CourseSidebar } from "@/components/client/course-sidebar";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

function extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;
  const course_id = Number(courseId);
  const lesson_id = Number(lessonId);

  if (isNaN(course_id) || isNaN(lesson_id)) {
    return notFound();
  }

  // 1. Fetch the specific lesson
  const currentLesson = await getLessonById(lesson_id);
  
  if (!currentLesson) {
    return notFound();
  }

  // 2. Fetch context data (All Units & All Lessons)
  // We removed 'getUnitById' and will use 'courseUnits' to find the current unit instead.
  const [courseUnits, courseLessons] = await Promise.all([
    getUnitsForCourse(course_id),
    getLessonsForCourse(course_id)
  ]);

  // 3. Find the current unit from the list we already have
  const currentUnit = courseUnits.find((unit) => unit.id === currentLesson.unitId);

  // 4. Format the label
  const unitLabel = currentUnit 
    ? `Unit ${currentUnit.position}: ${currentUnit.title}` 
    : "Unit Info Unavailable";

  const isMarkdown = currentLesson.mediaType === "markdown";
  const isYouTube = currentLesson.mediaType === "youtube";
  const youtubeId = isYouTube ? extractYouTubeId(currentLesson.content) : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      
      {/* LEFT SIDE: Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <div className="mb-4">
          <Link href={`/course/${courseId}`}>
            <Button variant="ghost" className="cursor-pointer gap-2 pl-0 hover:pl-2 transition-all">
              <ChevronLeft size={16} />
              Back to Course
            </Button>
          </Link>
        </div>

        <Card className="flex-1 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                {unitLabel}
              </span>
              <CardTitle className="text-3xl font-bold">{currentLesson.title}</CardTitle>
            </div>
            {currentLesson.description && (
              <CardDescription className="text-lg mt-2">
                {currentLesson.description}
              </CardDescription>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {isMarkdown && (
              <div className="prose prose-sm md:prose-base max-w-none flex-1 border p-4 rounded-md 
                prose-headings:underline prose-headings:font-mono
                prose-h1:mb-4
                prose-h2:mb-3
                prose-p:mb-2
                prose-li:mb-1 prose-li:font-mono
                prose-code:before:content-[''] prose-code:after:content-['']
                prose-code:bg-slate-100 prose-code:p-1 prose-code:rounded-md
              ">
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                  {currentLesson.content}
                </ReactMarkdown>
              </div>
            )}
            
            {isYouTube && youtubeId && (
              <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={`${currentLesson.title} - Video Player`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            
            {!isMarkdown && !isYouTube && (
              <div className="p-8 text-center border border-dashed rounded-lg bg-slate-50 text-slate-500">
                Content format not supported or missing.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT SIDE: Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 sticky top-0 h-[calc(100vh-4rem)] overflow-hidden border-l">
        <CourseSidebar 
            courseId={course_id}
            currentLessonId={lesson_id}
            currentUnitId={currentLesson.unitId}
            units={courseUnits}
            lessons={courseLessons}
        />
      </aside>
    </div>
  );
}