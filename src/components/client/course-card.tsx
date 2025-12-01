import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  title: string;
  type: "in-progress" | "favorite" | "popular" | "completed";
  progress?: number;
  units?: number;
  rating?: number;
  tags?: string[];
}

export function CourseCard({ title, type, progress, units, rating, tags = [] }: CourseCardProps) {
  return (
    <Card className="relative hover:shadow-lg transition-shadow cursor-pointer p-6">
      {/* Title and rating row */}
      <CardHeader className="p-0 mb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>

          {rating !== undefined && (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      {/* Bottom info row */}
      <CardContent className="p-0">
        <div className="flex justify-between items-center mt-4">
          {/* Units on bottom left */}
          {units !== undefined && (
            <Badge variant="secondary">{units} units</Badge>
          )}

          {/* Tags on bottom right */}
          <div className="flex flex-wrap justify-end gap-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}

            {type === "popular" && (
              <Badge>Popular</Badge>
            )}

            {type === "completed" && (
              <Badge variant="outline" className="bg-green-50">
                ✓ Completed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
