import { CourseCard } from "@/components/course-card";

// sample data - replace with real data later
const inProgressCourses = [
  { id: 1, title: "Introduction to Python", progress: 45, units: 10, rating: 4, tags: ["Programming", "Python"] },
  { id: 2, title: "Web Development Basics", progress: 70, units: 8, rating: 5, tags: ["HTML", "CSS", "JavaScript"] },
  { id: 3, title: "Data Structures", progress: 20, units: 15, rating: 3, tags: ["Data Structures", "Algorithms"] },
];

const favoriteCourses = [
  { id: 4, title: "Advanced JavaScript", units: 12, rating: 5, tags: ["JavaScript", "Frontend"] },
  { id: 5, title: "React Fundamentals", units: 8, rating: 4, tags: ["React", "Web Dev"] },
];

const popularCourses = [
  { id: 6, title: "Machine Learning 101", units: 20, rating: 5, tags: ["AI", "ML"] },
  { id: 7, title: "Database Design", units: 10, rating: 4, tags: ["SQL", "Database"] },
  { id: 8, title: "Algorithm Analysis", units: 12, rating: 5, tags: ["Algorithms", "Optimization"] },
];

const completedCourses = [
  { id: 9, title: "Git & GitHub Essentials", units: 6, rating: 5, tags: ["Version Control", "GitHub"] },
];

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      
      {/* In Progress Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">In progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inProgressCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              type="in-progress"
              progress={course.progress}
              units={course.units}
              rating={course.rating}
              tags={course.tags}
            />
          ))}
        </div>
      </section>

      {/* Favorites Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              type="favorite"
              units={course.units}
              rating={course.rating}
              tags={course.tags}
            />
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Popular</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              type="popular"
              units={course.units}
              rating={course.rating}
              tags={course.tags}
            />
          ))}
        </div>
      </section>

      {/* Completed Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Completed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              type="completed"
              units={course.units}
              rating={course.rating}
              tags={course.tags}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
