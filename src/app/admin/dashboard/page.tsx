import  FetchData from "./FetchData";
import { getDashboardData } from "@/lib/dashboard-data";
import PieChartGraph from "./PieChartGraph";
import BarChartGraph from "./BarChartGraph";
import StatCard from "./StatCard";
export default function Page() {
    return (
      <div className="p-6">
      <FetchData />
    </div>);

  }
  