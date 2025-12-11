// src/app/categories/page.tsx
import { getCoursesGroupedByTag } from "@/lib/categories";
import { CourseCard } from "@/components/client/course-card";

export const metadata = {
  title: "Categories | Learning with ACM",
};

export default async function CategoriesPage() {
  const tags = await getCoursesGroupedByTag();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-slate-600">
          Browse all courses grouped by category tags.
        </p>
      </header>

      {tags.map((tag) => (
        <section key={tag.id} className="space-y-3">
          <h2 className="text-xl font-semibold">{tag.tagName}</h2>
          <div className="flex flex-wrap gap-4">
            {tag.courses.map((course) => (
                <div key={course.id} className="w-full sm:w-[48%] lg:w-[45%]">
                <CourseCard
                    title={course.title}
                    type="popular"
                    tags={[tag.tagName]}
                />
                </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
