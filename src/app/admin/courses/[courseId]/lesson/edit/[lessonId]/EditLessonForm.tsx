"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// extend the base lesson schema to include ID for updates
const editLessonSchema = lessonFormSchema.extend({
  id: z.number(),
});

type EditLessonFormValues = z.infer<typeof editLessonSchema>;

type UnitOption = {
  id: number;
  title: string | null;
};

type EditLessonFormProps = {
  lesson: {
    id: number;
    unitId: number;
    title: string;
    description: string | null;
    mediaType: string;
    metadata: string;
  };
  courseId: number;
  units: UnitOption[];
};

// helper to safely parse metadata JSON
function parseMetadata(metadata: string): { contentUrl?: string } {
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
}

export default function EditLessonForm({
  lesson,
  courseId,
  units,
}: EditLessonFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");

  // parse contentUrl from metadata (stored as JSON string)
  const meta = parseMetadata(lesson.metadata);

  // initialize the form with existing lesson values
  // "as any" fixes typescript errors between React hook form and Zod
  const form = useForm<EditLessonFormValues>({
    resolver: zodResolver(editLessonSchema) as any,
    defaultValues: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description ?? "",
      unitId: lesson.unitId,
      courseId: courseId,
      mediaType: lesson.mediaType as EditLessonFormValues["mediaType"],
      contentUrl: meta.contentUrl ?? "",
    },
  }) as any;

  // handle form submission
  const onSubmit = (values: EditLessonFormValues) => {
    setServerError("");

    // wrap in transition for smooth pending state
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

        {/* lesson description textarea */}
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

        {/* unit selection dropdown */}
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

        {/* content type dropdown - determines how content is rendered */}
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
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* content URL input */}
        <FormField
          control={form.control}
          name="contentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* hidden fields for IDs */}
        <input type="hidden" {...form.register("id")} />
        <input type="hidden" {...form.register("courseId")} />

        {/* action buttons */}
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
