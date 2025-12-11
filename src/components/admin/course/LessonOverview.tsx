'use client';
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { Lesson, Unit } from "@/db/schema";
import Link from "next/link";

interface LessonOverviewProps {
  courseId: number;
  lesson: Lesson | null;
  unit: Unit | null;
}

function extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function LessonOverview({ courseId, lesson, unit }: LessonOverviewProps) {
  if (!lesson) return <div>Select a lesson</div>;
  
  const isMarkdown = lesson.mediaType === "markdown";
  const isYouTube = lesson.mediaType === "youtube";

  const youtubeId = isYouTube ? extractYouTubeId(lesson.content) : null;

  const testMarkdown = `
  # Hello
  - Some Text
  - Some other text
  ## Subtitle

  \`\`\`javascript
  function add(a, b) {
    return a + b;
  } 
  \`\`\`

  You can use the \`add(a,b)\` function to sum two numbers.
  `;

  return (
    <div className="relative flex flex-col gap-4 w-full">
      <div className="flex items-center">
        <h2 className="flex-1 text-center text-lg font-semibold">{`Unit: ${unit?.position} / Lesson: ${lesson.position}: ${lesson.title}`}</h2>
        <Link href={`/admin/courses/${courseId}/lesson/edit/${lesson.id}`}>
          <Button variant={"outline"} className="cursor-pointer">Edit Lesson</Button>
        </Link>
      </div>
      {isMarkdown && (
        <div className="prose prose-sm max-w-none flex-1 
          prose-headings:underline prose-headings:font-mono
          prose-h1:mb-4
          prose-h2:mb-3
          prose-p:mb-2
          prose-li:mb-1 prose-li:font-mono
          prose-code:before:content-[''] prose-code:after:content-['']
          prose-code:p-1 prose-code:rounded-md
        ">
          <ReactMarkdown >
            {testMarkdown}
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
    </div>
  );
}
