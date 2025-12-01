import type { DashboardData } from "@/lib/types";
import { getAdminRows, getCourseDifficultyRows, getCourseRows, getCourseTagRows, getRegularRows } from "@/actions/admin/dashboard";
import UserRadialChart from "@/components/admin/dashboard/UserRadicalChart";
import PieChartGraph from "@/components/admin/dashboard/PieChartGraph";
import BarChartGraph from "@/components/admin/dashboard/BarChartGraph";

export default async function AdminHomePage() {
  const adminRows = await getAdminRows();
  const regularRows = await getRegularRows();
  // const courseRows = await getCourseRows();
  const courseDifficultyRows = await getCourseDifficultyRows();
  const courseTagRows = await getCourseTagRows();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <UserRadialChart adminCount={adminRows} regularCount={regularRows}/>
      <PieChartGraph data={courseDifficultyRows}/>
      <BarChartGraph data={courseTagRows} />
    </div>
  );
}
