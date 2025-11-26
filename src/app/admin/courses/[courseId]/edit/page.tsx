import type { CourseIdPageProps } from "@/lib/types";

export default async function Page({ params }: CourseIdPageProps) {
    const { courseId } = await params;
    return <div>Edit page for courseID: {courseId}</div>;
}