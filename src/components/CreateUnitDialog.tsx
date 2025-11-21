"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";

import {
  createUnitAction,
} from "@/lib/lessonActions";
import {
  createUnitSchema,
  type CreateUnitSchema,
} from "@/lib/lesson";

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
  courseId: string;
  onCreated?: (unit: { id: number; title: string | null }) => void;
};

export function CreateUnitDialog({
  open,
  onOpenChange,
  courseId,
  onCreated,
}: CreateUnitDialogProps) {
  const form = useForm<CreateUnitSchema>({
    resolver: zodResolver(createUnitSchema),
    defaultValues: {
      title: "",
      courseId,
    },
  });

  const { execute, status, result } = useAction(createUnitAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        onCreated?.({
          id: data.unitId,
          title: data.unitTitle,
        });
        form.reset({ title: "", courseId });
        onOpenChange(false);
      }
    },
  });

  const isSubmitting = status === "executing";

  const onSubmit = (values: CreateUnitSchema) => {
    execute(values);
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

            {result.serverError && (
              <p className="text-sm text-destructive">
                {String(result.serverError)}
              </p>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create unit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
