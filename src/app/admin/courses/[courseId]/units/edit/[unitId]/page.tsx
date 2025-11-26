import type { CourseIdPageProps } from '@/lib/types'

export default async function page({ params }: CourseIdPageProps) {
  const { courseId } = await params; 
  const id = Number(courseId);
  return (
    <div>{id}</div>
  )
}
