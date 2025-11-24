"use client";

import GraphCard from "./GraphCard";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

export default function PieChartGraph({ data }) {
  return (
    <GraphCard title="Course Difficulty Distribution">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="diff"
            outerRadius={100}
            fill="hsl(var(--primary))"
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={`hsl(var(--muted-foreground))`} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </GraphCard>
  );
}
