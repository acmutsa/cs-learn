"use client";
import GraphCard from "./GraphCard";
import { ChartContainer, ChartTooltip, ChartConfig, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";

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

export default function BarChartGraph({ data }) {
  const maxValue = Math.max(...data.map((d) => d.count))
  const chartConfig: ChartConfig = data.reduce((acc, entry, idx) => {
    acc[entry.tag] = {
      label: entry.tag,
      color: palette[idx % palette.length],
    };
    return acc;
  }, {} as ChartConfig);
    
  return (
    <GraphCard title="Courses per Tag" description="">
      <ResponsiveContainer width="100%" height="100%" >
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <XAxis dataKey="tag" />
            <YAxis
                ticks={[...Array(maxValue + 1).keys()]}   // [0, 1, 2, ..., max]
                domain={[0, maxValue]}
                allowDecimals={false}
                />
            {/* Shadcn style tooltip */}
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count">
              {data.map((entry) => (
                <Cell
                  key={entry.tag}
                  fill={chartConfig[entry.tag].color}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </GraphCard>
  );
}