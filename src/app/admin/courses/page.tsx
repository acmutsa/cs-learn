import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// dummy course array
const dummyCourses = [
  {
    id: "1",
    title: "Intro to Python",
    description: "Learn Python for beginners",
    status: "published",
  },
  {
    id: "2",
    title: "Web Development Basics",
    description: "Web dev fundamentals",
    status: "published",
  },
  {
    id: "3",
    title: "Data Structures",
    description: "Learn about core data structures",
    status: "unpublished",
  },
  {
    id: "4",
    title: "Advanced JavaScript",
    description: "Advanced topics in JavaScript",
    status: "published",
  },
  {
    id: "5",
    title: "React Fundamentals",
    description: "Build modern web apps with React",
    status: "unpublished",
  },
];

// admin course page setup
export default function AdminCoursesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Data Table</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}