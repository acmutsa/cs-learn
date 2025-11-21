"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteCourseAction } from "@/actions/delete-course";
import { useTransition } from "react";

// Temporary placeholder data until backend fetch is added
const dummyCourses = [
  { id: 1, title: "Intro to Python", description: "Learn Python", status: "published" },
  { id: 2, title: "Web Development Basics", description: "Web dev fundamentals", status: "published" },
  { id: 3, title: "Data Structures", description: "Core data structures", status: "unpublished" },
  { id: 4, title: "Advanced JavaScript", description: "Advanced JS topics", status: "published" },
  { id: 5, title: "React Fundamentals", description: "React basics", status: "unpublished" },
];

export default function AdminCoursesPage() {
  const [isPending, startTransition] = useTransition();

  // Calls the Safe Action to delete a course by ID
  function handleDelete(id: number) {
    startTransition(() => {
      deleteCourseAction({ id });
    });
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Courses</h1>

      {/* Table of course data rendered from placeholder array */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dummyCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.status}</TableCell>

                {/* Delete button wrapped in confirmation dialog */}
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    {/* Confirmation modal to prevent accidental deletion */}
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete “{course.title}”?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone.
                          It will permanently delete this course and all related data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        {/* Executes the delete action when confirmed */}
                        <AlertDialogAction
                          disabled={isPending}
                          onClick={() => handleDelete(course.id)}
                        >
                          {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}
