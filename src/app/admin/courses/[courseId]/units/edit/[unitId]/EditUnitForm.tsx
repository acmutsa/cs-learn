"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unitFormSchema } from "@/lib/validations/unit";
import { updateUnitAction } from "@/actions/admin/units";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditUnitForm({ unit }: { unit: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();   // pending UI state
  const [serverError, setServerError] = useState("");     // holds backend validation error

  // initialize form with Zod validation and unit's default values
  const form = useForm<z.infer<typeof unitFormSchema>>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      title: unit.title,
      courseId: unit.courseId,
    },
  });

  // handle form submission
  const onSubmit = (values: z.infer<typeof unitFormSchema>) => {
    setServerError("");

    // wrap the server action in a transition for smoother UI
    startTransition(async () => {
      const result = await updateUnitAction({
        id: unit.id,     // include the unit ID for updating
        ...values,
      });

      // show errors
      if (result?.serverError) {
        setServerError(result.serverError);
        return;
      }

      // show success message
      toast.success("Unit updated successfully!");

      // redirect to the course page after saving
      router.push(`/admin/courses/${unit.courseId}`);
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      {/* show server side validation or duplicate title errors */}
      {serverError && (
        <p className="text-red-500 text-sm">{serverError}</p>
      )}

      {/* input: Unit title */}
      <div>
        <label className="block font-medium mb-1">Unit Title</label>
        <Input
          placeholder="Unit title"
          disabled={isPending}
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* submit button */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
