"use client";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { unitFormSchema, type UnitFormValues } from "@/lib/validations/unit";
import { toast } from "sonner";
import { createUnitAction } from "@/actions/admin/units";

interface UnitFormProps {
  courseId: number;
}

export default function UnitForm({courseId}: UnitFormProps) {
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
        title: "",
        courseId,
    },
  });
  const onSubmit = async (values: UnitFormValues) => {
    try {
      const result = await createUnitAction({ ...values, courseId });
      if (!result.data?.success) {
        toast.error(result.data?.message);
        form.setError("title", { type: "manual", message: result.data?.message });
      } else {
        toast.success(result.data?.message);
        form.reset();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="max-w-3xl w-full border p-4 rounded-2xl">
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                              <Input placeholder="Unit Title" {...field} />
                          </FormControl>
                          <FormDescription>
                              This is the Units Title.
                          </FormDescription>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <Button className="cursor-pointer" type="submit">Submit</Button>
          </form>
      </Form>
  </div>
  );
}
