import { getLessonById } from "@/actions/admin/lesson";
import { getUnitsForCourse } from "@/actions/admin/units";
import EditLessonForm from "@/components/admin/lesson/EditLessonForm";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const course_id = Number(courseId);
  const lesson_id = Number(lessonId);
  if (isNaN(course_id) || isNaN(lesson_id)) {
    return <div>Invalid ID.</div>;
  }
  const lesson = await getLessonById(lesson_id);
  if (!lesson) {
    return <div>Lesson not found.</div>;
  }
  const units = await getUnitsForCourse(course_id);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Lesson</h1>
      <EditLessonForm
        lesson={lesson}
        courseId={course_id}
        units={units}
      />
    </div>
  );
}
