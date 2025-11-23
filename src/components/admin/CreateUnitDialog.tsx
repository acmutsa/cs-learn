"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createUnitAction } from "@/actions/admin/units";
import { unitFormSchema, type UnitFormValues } from "@/lib/validations/unit";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type CreateUnitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: number;
  onCreated?: (unit: { id: number; title: string | null }) => void;
};

export function CreateUnitDialog({
  open,
  onOpenChange,
  courseId,
  onCreated,
}: CreateUnitDialogProps) {

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
        if (onCreated && result.data.unitId) {
          onCreated({ id: result.data.unitId, title: result.data.unitTitle });
        }
        toast.success(result.data?.message);
        form.reset();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Create new unit
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Week 1: Introduction"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-2">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Create unit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
