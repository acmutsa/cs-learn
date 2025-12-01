"use client";
import GraphCard from "./GraphCard";
import {
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

interface UserRadicalData {
  adminCount: number;
  regularCount: number;
}

export default function UserRadialChart({ adminCount, regularCount }: UserRadicalData) {
  const total = adminCount + regularCount;
  const chartData = [
    {
      name: "users",
      admin: adminCount,
      regular: regularCount,
    },
  ];

  // for center label
  const totalUsers = adminCount + regularCount;

  const chartConfig = {
    admin: {
      label: "Admin",
      color: "var(--chart-1)",
    },
    user: {
      label: "User",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <GraphCard title="User Types" description="Admin vs Regular Users">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={80}
            outerRadius={130}
            endAngle={180}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* Center label */}
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                    return null;
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 16}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalUsers.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="fill-muted-foreground"
                      >
                        Users
                      </tspan>
                    </text>
                  );
                }}
              />
            </PolarRadiusAxis>
            {/* Admin */}
            <RadialBar
              stackId="users"
              dataKey="regular"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
              fill="var(--chart-1)"
            />
            {/* Regular Users */}
            <RadialBar
              stackId="users"
              dataKey="admin"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
              fill="var(--chart-2)"
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="flex items-center justify-center font-medium">
            <ul className="flex flex-col gap-2">
              <li>Number of Regular User: {regularCount}</li>
              <li>Number of Admin User: {adminCount}</li>
            </ul>
          </div>
    </GraphCard>
  );
}