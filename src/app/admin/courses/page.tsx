import CourseTable from "@/components/admin/course/CourseTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminCoursePage() {
  return (
    <div>
      <Link href={"/admin/courses/create"}>
        <Button className="cursor-pointer" variant={"outline"}>Create a New Course</Button>
      </Link>
      <CourseTable />
    </div>
  );
}