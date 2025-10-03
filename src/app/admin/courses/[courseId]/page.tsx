export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <div>This is the admin course page for {courseId}</div>;
}
