export default async function Page({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    return <div>Edit page for courseID: {courseId}</div>;
}