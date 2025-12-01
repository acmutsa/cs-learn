import UnitForm from "@/components/admin/unit/UnitForm";
import type { CourseIdPageProps } from "@/lib/types";

export default async function Page({ params }: CourseIdPageProps) {
  const { courseId } = await params;
  const id = Number(courseId);
  return (
    <div className="flex justify-center">
      <UnitForm courseId={id}/>
    </div>
  );
}
