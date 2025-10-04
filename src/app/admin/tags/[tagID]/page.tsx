export default async function Page({
    params,
}: {
    params: Promise<{ tagID: string }>;
}) {
    const { tagID } = await params;
    return <div>Managing tag: {tagID}</div>;
}