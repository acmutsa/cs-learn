"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateCourseAction } from "@/actions/admin/update-course"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

// zod form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export default function EditCourseForm({ course }: { course: any }) {
  const router = useRouter();

  // `useTransition` lets us show a pending state during async work
  const [isPending, startTransition] = useTransition();

  // holds any server side validation errors from the action
  const [serverError, setServerError] = useState("");

  const {executeAsync: updateCourse} = useAction(updateCourseAction, {
    onSuccess: () => {
      router.push("/admin/courses");
    },
    onError: ({error}) => {
      console.log(error);
      setServerError(error.serverError ?? "Something went wrong");
    },
  });

  // react-hook-form setup with Zod resolver and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      description: course.description ?? "",
      difficulty: course.difficulty ?? "beginner",
    },
  });

  // handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setServerError("");

    // run async update inside startTransition for smoother UX
    startTransition(async () => {
      await updateCourse({
        id: course.id, // pass the course id
        ...values,     // pass updated form values
      });
    });
  };

  return (
    <form 
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-w-xl"
    >
      {/* Server-side error display */}
      {serverError && (
        <p className="text-red-500 text-sm">{serverError}</p>
      )}

      {/* course title Input*/}
      <div>
        <label className="block font-medium mb-1">Title</label>
        <Input
          placeholder="Course title"
          disabled={isPending}
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* course description input */}
      <div>
        <label className="block font-medium mb-1">Description</label>
        <Textarea
          placeholder="Course description"
          disabled={isPending}
          {...form.register("description")}
        />
      </div>

      {/* difficulty dropdown menu */}
      <div>
        <label className="block font-medium mb-1">Difficulty</label>
        <select
          className="border rounded p-2 w-full"
          disabled={isPending}
          {...form.register("difficulty")}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* submit button */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
