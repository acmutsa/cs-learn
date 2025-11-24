// components/dashboard/GraphCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GraphCard({ title, children }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {children}
      </CardContent>
    </Card>
  );
}
