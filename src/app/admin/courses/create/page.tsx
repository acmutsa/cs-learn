"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCourse, ActionResult } from "./actions";
import { useAction } from "next-safe-action/hooks";
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

const CourseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.coerce.number().min(0),
  published: z.coerce.boolean().optional(),
});
type CourseForm = z.infer<typeof CourseSchema>;

export default function CreateCoursePage() {
  const form =useForm<CourseForm>({
    resolver: zodResolver(CourseSchema) as any,
    defaultValues: {
       title: "",  
       description: "", 
       difficulty: 0, 
       published: false,
    }
  });

   const {execute, result} = useAction(createCourse, {
    onSuccess: (data) => {
      console.log("course created: ", data);
    }
   });


  const onSubmit: SubmitHandler<CourseForm> = async (
    values: z.infer<typeof CourseSchema>
  ) =>{
    await execute(values);
  }


  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* <h1 className="text-2xl font-semibold mb-4">Create a New Course</h1> */}

       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="my-course-slug" {...field} />
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>


        {/* <div className="flex items-center gap-2">
          <input type="checkbox" {...register("published")} />
          <label>Published</label>
        </div> */}

        {/* <div>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-black text-white rounded">
            {isSubmitting ? "Creating…" : "Create course"}
          </button>
        </div> */}
      
    </div>
  );
}

