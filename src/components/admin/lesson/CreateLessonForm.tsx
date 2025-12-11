"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";

import {
  lessonFormSchema,
  type LessonFormValues,
} from "@/lib/validations/lesson";
import { createLessonAction } from "@/actions/admin/lesson";

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

import { CreateUnitDialog } from "./CreateUnitDialog";

type UnitOption = {
  id: number;
  title: string | null;
};

type CreateLessonFormProps = {
  courseId: number;
  initialUnits: UnitOption[];
};

const NEW_UNIT_VALUE = "__new_unit__";

export default function CreateLessonForm({
  courseId,
  initialUnits,
}: CreateLessonFormProps) {
  const id = Number(courseId);
  const router = useRouter();

  const [units, setUnits] = React.useState<UnitOption[]>(initialUnits);
  const [openUnitDialog, setOpenUnitDialog] = React.useState(false);

  // Relaxed typing around resolver to avoid RHF + zod generic noise,
  // while still keeping LessonFormSchema as the form's value type.
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      unitId: 0,
      courseId: id,
      mediaType: "markdown",
      content: "",
    },
  });
  const mediaType = form.watch("mediaType");

  const { execute, status, result } = useAction(createLessonAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push(`/admin/courses/${id}`);
      }
    },
  });

  const isSubmitting = status === "executing";

  const onSubmit = (values: LessonFormValues) => {
    execute(values);
  };

  const handleUnitChange = (
    value: string,
    onChange: (val: number) => void
  ) => {
    if (value === NEW_UNIT_VALUE) {
      setOpenUnitDialog(true);
      return;
    }
    onChange(Number(value));
  };

  const handleUnitCreated = (unit: { id: number; title: string | null }) => {
    setUnits((prev) => [...prev, unit]);
    form.setValue("unitId", unit.id, { shouldValidate: true });
  };

  return (
    <>
      <CreateUnitDialog
        open={openUnitDialog}
        onOpenChange={setOpenUnitDialog}
        courseId={id}
        onCreated={handleUnitCreated}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Top section: basic info */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Lesson title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Introduction to Variables"
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
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short summary of what this lesson covers..."
                      className="min-h-[96]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Content section */}
          <div className="grid gap-6 md:grid-cols-2 rounded-lg border border-dashed border-border/60 bg-muted/40 p-4">
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
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
                <FormItem className="md:col-span-1">
                  <FormLabel>Content URL</FormLabel>
                  <FormControl>
                    {mediaType === "youtube" ? (
                      <Input
                        placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        {...field}
                      />
                    ) : (
                      <Textarea
                        placeholder="Enter your detailed lesson content here using Markdown syntax..."
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Hidden courseId so it gets sent along with the form */}
          <input type="hidden" {...form.register("courseId")} value={id} />

          {/* Unit selection */}
          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) => handleUnitChange(val, field.onChange)}
                >
                  <FormControl>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem className="cursor-pointer" key={unit.id} value={String(unit.id)}>
                        {unit.title ?? `Unit ${unit.id}`}
                      </SelectItem>
                    ))}
                    <SelectItem className="cursor-pointer" value={NEW_UNIT_VALUE}>
                      + Create new unit
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {result.serverError && (
            <p className="text-sm text-destructive">
              {String(result.serverError)}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create lesson"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}