"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { courseSchema, type CourseFormValues } from "@/lib/validations/course";

export default function CourseForm() {
    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema)
    });


    return (
        <div>
            Hello
        </div>
    )
}
