"use client";
import GraphCard from "./GraphCard";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartConfig, ChartTooltipContent } from "@/components/ui/chart";

/* //uncomment this when the theme is activate
const palette = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];
*/

//delete this when the theme is activate
const palette = [
  "hsl(200, 100%, 50%)", // bright blue
  "hsl(120, 60%, 45%)",  // green
  "hsl(40, 90%, 55%)",   // orange
  "hsl(340, 80%, 60%)",  // pink/red
  "hsl(260, 70%, 50%)",  // purple
];


export default function PieChartGraph({ data }) {
  const totalCourses = data.reduce((sum, item) => sum + item.count, 0);
  const description = "";
  // Build shadcn chart config
  const chartConfig: ChartConfig = data.reduce((acc, entry, idx) => {
    acc[entry.diff] = {
      label: entry.diff,
      color: palette[idx % palette.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <GraphCard title="Course Difficulty Distribution">
      <div className="flex flex-col gap-4">

        {/* --- Chart --- */}
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="diff"
                outerRadius={100}
                labelLine={false}
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={entry.diff}
                    fill={chartConfig[entry.diff].color}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* --- Labels Legend --- */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {data.map((entry, idx) => (
            <div key={entry.diff} className="flex items-center gap-2">
              {/* Color box */}
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: chartConfig[entry.diff].color }}
              />
              {/* Label + count */}
              <span className="text-sm text-foreground">
                {entry.diff} — <span className="font-medium">{entry.count}</span>
              </span>
            </div>
          ))}
          {/* --- Total Courses --- */}
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Total Courses: <span className="font-semibold text-foreground">{totalCourses}</span>
          </div>
        </div>

  

      </div>
    </GraphCard>
  );
}
