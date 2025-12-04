import { db } from "@/db";
import { units } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditUnitForm from "./EditUnitForm";

export default async function EditUnitPage({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string }>;
}) {
  // must await params (Next.js rule)
  const { courseId, unitId } = await params;

  // convert route params to numbers
  const cid = Number(courseId);
  const uid = Number(unitId);

  // validation for bad URLs or IDs
  if (isNaN(cid) || isNaN(uid)) {
    return <div>Invalid ID.</div>;
  }

  // get the target unit from db
  const [unit] = await db
    .select()
    .from(units)
    .where(eq(units.id, uid));

  // error for when unit doesn't exist
  if (!unit) return <div>Unit not found.</div>;

  // render the edit form and pass the unit data down to the client component
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Unit</h1>
      <EditUnitForm unit={unit} />
    </div>
  );
}
