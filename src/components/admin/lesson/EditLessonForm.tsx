"use client";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { lessonFormSchema } from "@/lib/validations/lesson";
import { updateLessonAction } from "@/actions/admin/lesson";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { UpdateUnit } from "@/lib/types";

export default function EditLessonForm({ lesson, courseId, units }: {
  lesson: any,
  courseId: number;
  units: UpdateUnit[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");

  const editLessonFormSchema = lessonFormSchema.safeExtend({
    lessonId: z.number().min(1),
  });
  type EditLessonFormValues = z.infer<typeof editLessonFormSchema>;

  const form = useForm<EditLessonFormValues>({
    resolver: zodResolver(editLessonFormSchema),
    defaultValues: {
      lessonId: lesson.id,
      title: lesson.title,
      description: lesson.description ?? "",
      unitId: lesson.unitId,
      courseId: courseId,
      mediaType: lesson.mediaType,
      content: lesson.content,
    },
  });
  const mediaType = form.watch("mediaType");

  const onSubmit = (values: EditLessonFormValues) => {
    setServerError("");
    startTransition(async () => {
      const result = await updateLessonAction(values);
      if (result?.serverError) {
        setServerError(result.serverError);
        return;
      }
      toast.success("Lesson updated successfully!");
      router.push(`/admin/courses/${courseId}`);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        {/* show server-side errors */}
        {serverError && (
          <p className="text-red-500 text-sm">{serverError}</p>
        )}

        {/* lesson title input */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Introduction to Variables"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short summary of what this lesson covers..."
                  className="min-h-[96px]"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(Number(val))}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={String(unit.id)}>
                      {unit.title ?? `Unit ${unit.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mediaType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a content type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="youtube">YouTube video</SelectItem>
                  <SelectItem value="markdown">Markdown page</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content URL</FormLabel>
              <FormControl>
                {mediaType === "youtube" ? (
                  <Input
                    placeholder="https://..."
                    disabled={isPending}
                    {...field}
                  />
                ) : (
                  <Textarea
                    placeholder="Enter your detailed lesson content here using Markdown syntax..."
                    disabled={isPending}
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type="hidden" {...form.register("lessonId")} />
        <input type="hidden" {...form.register("courseId")} />
        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
