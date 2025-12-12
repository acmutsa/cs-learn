"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type CourseItem = {
  id: number | string;
  title: string;
  description: string;
  difficulty: string | null;
  createdAt: number;
};

type ExploreCoursesClientProps = {
  courses: CourseItem[];
  inProgressCourseIds: Array<number | string>;
};

const PAGE_SIZE = 10;

export function ExploreCoursesClient({
  courses,
  inProgressCourseIds,
}: ExploreCoursesClientProps) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCourses = useMemo(() => {
    if (!normalizedSearch) return courses;
    return courses.filter((course) => {
      const haystack = `${course.title} ${course.description}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [courses, normalizedSearch]);

  const popularCourses = useMemo(() => {
    return filteredCourses.slice(0, 5);
  }, [filteredCourses]);

  const inProgressCourses = useMemo(() => {
    if (!inProgressCourseIds.length) return [];
    const set = new Set(inProgressCourseIds.map(String));
    return filteredCourses.filter((c) => set.has(String(c.id)));
  }, [filteredCourses, inProgressCourseIds]);

  const visibleCourses = filteredCourses.slice(0, visibleCount);
  const hasMore = filteredCourses.length > visibleCourses.length;

  const renderCourseCard = (course: CourseItem) => {
    const difficultyLabel =
      course.difficulty?.charAt(0).toUpperCase() +
        course.difficulty?.slice(1) || "Beginner";

    const date =
      course.createdAt && !Number.isNaN(course.createdAt)
        ? new Date(course.createdAt * 1000)
        : null;

    return (
      <Link key={course.id} href={`/course/${course.id}`}>
        <Card className="h-full transition hover:border-primary/60 hover:shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="line-clamp-1 text-base">
                {course.title}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {difficultyLabel}
              </Badge>
            </div>
            {date && (
              <p className="text-[11px] text-muted-foreground">
                Created on{" "}
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-2 text-sm">
              {course.description || "No description provided yet."}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Explore Courses
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse all available courses or jump back into what you&apos;re
            working on.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // reset pagination when search changes
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search courses…"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          {/* <TabsTrigger value="in-progress">In progress</TabsTrigger> */}
          <TabsTrigger value="all">All courses</TabsTrigger>
        </TabsList>

        {/* Popular */}
        <TabsContent value="popular" className="mt-4 space-y-4">
          {popularCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No courses to show here yet. Once courses are added and gets
              activity, they&apos;ll show up under Popular.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularCourses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>

        {/* In progress */}
        {/* <TabsContent value="in-progress" className="mt-4 space-y-4">
          {inProgressCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any courses in progress yet. Start any course
              to see it here.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressCourses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent> */}

        {/* All courses with pagination */}
        <TabsContent value="all" className="mt-4 space-y-4">
          {visibleCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No courses match your search.
            </p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCourses.map(renderCourseCard)}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setVisibleCount((prev) => prev + PAGE_SIZE)
                    }
                  >
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
