"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";

import {
  lessonFormSchema,
  type LessonFormSchema,
} from "@/lib/lesson";
import { createLessonAction } from "@/lib/lessonActions";

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

import { CreateUnitDialog } from "@/components/CreateUnitDialog";

type UnitOption = {
  id: number;
  title: string | null;
};

type CreateLessonFormProps = {
  courseId: string;
  initialUnits: UnitOption[];
};

const NEW_UNIT_VALUE = "__new_unit__";

export function CreateLessonForm({
  courseId,
  initialUnits,
}: CreateLessonFormProps) {
  const router = useRouter();

  const [units, setUnits] = React.useState<UnitOption[]>(initialUnits);
  const [openUnitDialog, setOpenUnitDialog] = React.useState(false);

    const form = useForm<LessonFormSchema>({
        resolver: zodResolver(lessonFormSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            unitId: 0,
            courseId,
            mediaType: "markdown", // sensible default
            contentUrl: "",
        },
    }) as any;


  const { execute, status, result } = useAction(createLessonAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push(`/admin/courses/${courseId}`);
      }
    },
  });

  const isSubmitting = status === "executing";

  const onSubmit = (values: LessonFormSchema) => {
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
        courseId={courseId}
        onCreated={handleUnitCreated}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-xl"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. What is a variable?" {...field} />
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
                    placeholder="Short summary of this lesson..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden courseId so it gets sent along with the form */}
          <input type="hidden" {...form.register("courseId")} value={courseId} />

          {/* Media type */}
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

            {/* Main content URL */}
            <FormField
            control={form.control}
            name="contentUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Content URL</FormLabel>
                <FormControl>
                    <Input
                    placeholder="https://..."
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
                  onValueChange={(val) => handleUnitChange(val, field.onChange)}
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
                    <SelectItem value={NEW_UNIT_VALUE}>
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

          <div className="flex gap-2">
            <Button
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
