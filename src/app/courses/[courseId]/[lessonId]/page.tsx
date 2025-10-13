export default async function Page({
    params,
}: {
    params: Promise<{ courseId: string; lessonId: string }>;
}) {
    const { courseId, lessonId } = await params;
    return <div>Managing lesson: {lessonId} for course {courseId}</div>;
}