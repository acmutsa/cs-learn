
export default async function CourseIdPage({ 
  params 
}: { 
  params: Promise<{ courseId: string}> 
}) {
  const { courseId } = await params; 
  const id = Number(courseId);
  
  return <div className="">
    Course ID: {id}
  </div>
}