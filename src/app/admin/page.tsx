import type { DashboardData } from "@/lib/types";
import { getAdminRows, getCourseDifficultyRows, getCourseRows, getCourseTagRows, getRegularRows } from "@/actions/admin/dashboard";
import UserRadialChart from "@/components/admin/dashboard/UserRadicalChart";
import PieChartGraph from "@/components/admin/dashboard/PieChartGraph";
import BarChartGraph from "@/components/admin/dashboard/BarChartGraph";

export default async function AdminHomePage() {
  const adminRows = await getAdminRows();
  const regularRows = await getRegularRows();
  const courseDifficultyRows = await getCourseDifficultyRows();
  const courseTagRows = await getCourseTagRows();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {adminRows.length === 0 && regularRows.length === 0 ? (
        <div className="text-center text-gray-500 p-6 border rounded-md">
          No user data available
        </div>
      ) : (
        <UserRadialChart adminCount={adminRows} regularCount={regularRows} />
      )}
      {courseDifficultyRows.length === 0 ? (
        <div className="text-center text-gray-500 p-6 border rounded-md">
          No course difficulty data
        </div>
      ) : (
        <PieChartGraph data={courseDifficultyRows} />
      )}
      {courseTagRows.length === 0 ? (
        <div className="text-center text-gray-500 p-6 border rounded-md">
          No course tag data
        </div>
      ) : (
        <BarChartGraph data={courseTagRows} />
      )}
    </div>
  );
}
