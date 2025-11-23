import UnitForm from "@/components/admin/unit/UnitForm";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const id = Number(courseId);
  return (
    <div className="flex justify-center">
      <UnitForm courseId={id}/>
    </div>
  );
}
