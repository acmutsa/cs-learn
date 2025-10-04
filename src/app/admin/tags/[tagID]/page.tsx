export default async function Page({
    params,
}: {
    params: Promise<{ tagID: string }>;
}) {
    const { tagID } = await params;
    return <div>Creating new unit for course {tagID}</div>;
}