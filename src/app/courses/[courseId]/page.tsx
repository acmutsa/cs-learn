export default async function Page({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    return <div>Managing tag: {courseId}</div>;
}