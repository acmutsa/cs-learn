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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { courseSchema, type CourseFormValues } from "@/lib/validations/course";
import { useState, useEffect } from "react";
import { getAllTags } from "@/actions/admin/tag";
import { X } from 'lucide-react';
import { toast } from "sonner";
import { createCourse } from "@/actions/admin/course";
import { useRouter } from "next/navigation";

export default function CourseForm() {
    const router = useRouter();

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "beginner",
            tags: [],
        },
    });

    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const fetchAllTags = async () => {
        const result = await getAllTags();
        setAllTags(result.map(t => t.tagName));
    }

    useEffect(() => {
        fetchAllTags();
    }, []);

    const onSubmit = async (values: CourseFormValues) => {
        const result = courseSchema.safeParse(values);
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            result.error.issues.forEach(issue => {
                form.setError(issue.path[0] as keyof CourseFormValues, {
                    type: "manual",
                    message: issue.message,
                })
            })
        } else {
            const response = await createCourse(result.data);
            if (!response.success) {
                toast.error(response.message);
                form.setError("title", { type: "manual", message: response.message });
            } else {
                toast.success(response.message);
                router.push("/admin/courses");
            }
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
                                    <Input placeholder="Course Title" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the course public title name.
                                </FormDescription>
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
                                    <Input placeholder="Course Description" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the course description.
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
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-[180px] cursor-pointer">
                                            <SelectValue placeholder="Select Difficulty"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Difficulty</SelectLabel>
                                                {courseSchema.shape.difficulty.options.map((option) => (
                                                    <SelectItem className="cursor-pointer" key={option} value={option}>
                                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    This is the course public difficult.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value: string) => {
                                            setSelectedTags([...selectedTags, value]);
                                            field.onChange([...selectedTags, value]);
                                        }}
                                        value=""
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Select Tag"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            {allTags
                                                .filter((tag) => !selectedTags.includes(tag))
                                                .map((tag) => (
                                                <SelectItem key={tag} value={tag}>
                                                    {tag}
                                                </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    This is the course public title name.
                                </FormDescription>
                                <FormMessage/>
                                <div className="flex flex-wrap mt-2 gap-2">
                                    {selectedTags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                        type="button"
                                        className="cursor-pointer"
                                        onClick={() => {
                                            const newTags = selectedTags.filter((t) => t !== tag);
                                            setSelectedTags(newTags);
                                            field.onChange(newTags);
                                        }}
                                        >
                                            <X size={15}/>
                                        </button>
                                    </div>
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
