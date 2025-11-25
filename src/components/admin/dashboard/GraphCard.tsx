// components/dashboard/GraphCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ReactNode } from "react";

interface GraphCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function GraphCard({ title,description, children }: GraphCardProps) {
  return (
    <Card className="shadow-sm">
    <div className="flex flex-col gap-4">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
      <div className="w-full h-full">
          {children}
        </div>

      </CardContent>
      </div>
    </Card>
  );
}