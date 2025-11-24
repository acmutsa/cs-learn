"use client";

import GraphCard from "./GraphCard";

export default function StatCard({ title, value }) {
  return (
    <GraphCard title={title}>
      <div className="flex items-center justify-center h-full text-4xl font-bold">
        {value}
      </div>
    </GraphCard>
  );
}
