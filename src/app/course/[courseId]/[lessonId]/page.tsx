import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getLessonById } from "@/actions/admin/lesson";
import { getUnitById } from "@/actions/admin/units";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

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
  const lesson = await getLessonById(lesson_id);
  if (!lesson) {
    return notFound();
  }
  const unit = await getUnitById({ unitId: lesson.unitId });

  const isMarkdown = lesson.mediaType === "markdown";
  const isYouTube = lesson.mediaType === "youtube";

  const youtubeId = isYouTube ? extractYouTubeId(lesson.content) : null;

  return (
    <div className="flex-1 flex flex-col px-2 pb-2 md:px-5 md:pb-5 max-w-5xl mx-auto w-full">
      {/* Navigation Header */}
      <div className="mb-4">
        <Link href={`/course/${courseId}`}>
          <Button variant="ghost" className="cursor-pointer gap-2 pl-0 hover:pl-2 transition-all">
            <ChevronLeft size={16} />
            Back to Course
          </Button>
        </Link>
      </div>

      <Card className="flex-1">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              {`Unit: ${unit.data?.position} ${unit.data?.title}`}
            </span>
            <CardTitle className="text-3xl font-bold">{lesson.title}</CardTitle>
          </div>
          {lesson.description && (
            <CardDescription className="text-lg mt-2">
              {lesson.description}
            </CardDescription>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {isMarkdown && (
            <div className="prose prose-sm max-w-none flex-1 border p-2 rounded-md 
              prose-headings:underline prose-headings:font-mono
              prose-h1:mb-4
              prose-h2:mb-3
              prose-p:mb-2
              prose-li:mb-1 prose-li:font-mono
              prose-code:before:content-[''] prose-code:after:content-['']
              prose-code:p-1 prose-code:rounded-md
            ">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {lesson.content}
              </ReactMarkdown>
            </div>
          )}
          {isYouTube && youtubeId && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={`${lesson.title} - Video Player`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {!isMarkdown && !isYouTube && (
            <div>Missing Content</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}