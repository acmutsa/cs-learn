// src/app/course/[courseId]/[lessonId]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";

// DB Imports
import { db } from "@/db"; // Ensure this path points to your Drizzle client instance
import { lessons } from "@/db/schema";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarkdownViewer } from "@/components/client/markdown-viewer"; // Based on your screenshot folder structure

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  // 1. Await params (Next.js 15 requirement)
  const { courseId, lessonId } = await params;
  const lId = parseInt(lessonId);

  if (isNaN(lId)) return notFound();

  // 2. Fetch the lesson from the database
  // We use findFirst to get the specific lesson data
  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lId),
    with: {
      unit: true, // Fetch unit info for context (optional)
    },
  });

  if (!lesson) {
    return notFound();
  }

  // 3. Convert the BLOB content to a String
  // The schema defines content as 'blob()', so we must decode it.
  let contentString = "";
  
  if (lesson.content) {
    if (typeof lesson.content === 'string') {
       // Safety check: if it was somehow stored as string
       contentString = lesson.content;
    } else if (Buffer.isBuffer(lesson.content)) {
       // Standard Node.js Buffer
       contentString = lesson.content.toString("utf-8");
    } else {
       // Fallback for Uint8Array (common in some Drizzle adapters)
       contentString = new TextDecoder().decode(lesson.content as unknown as Uint8Array);
    }
  }

  return (
    <div className="flex-1 flex flex-col px-2 pb-2 md:px-5 md:pb-5 max-w-5xl mx-auto w-full">
      {/* Navigation Header */}
      <div className="mb-4">
        <Link href={`/course/${courseId}`}>
          <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
            <ChevronLeft size={16} />
            Back to Course
          </Button>
        </Link>
      </div>

      <Card className="flex-1">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              {lesson.unit?.title ? `Unit: ${lesson.unit.title}` : "Lesson"}
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
            {/* 4. Render the Markdown */}
            {lesson.mediaType === "markdown" ? (
                <MarkdownViewer content={contentString} />
            ) : (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                    <p className="font-semibold">Media Type: {lesson.mediaType}</p>
                    <p>This lesson content is not markdown. Custom rendering for {lesson.mediaType} is needed.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}