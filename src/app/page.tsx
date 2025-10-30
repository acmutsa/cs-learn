import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navbar"
const stats = [
  { value: "120+", label: "Interactive lessons" },
  { value: "30K", label: "Learners enrolled" },
  { value: "92%", label: "Course completion rate" },
];
const features = [
  {
    title: "Practice-first approach",
    description:
      "Build real applications with guided walkthroughs, code reviews, and community feedback.",
    detail: "Every module ends with a practical milestone project.",
  },
  {
    title: "Mentor office hours",
    description:
      "Drop into weekly live sessions to ask questions, pair program, or get portfolio help.",
    detail: "Sessions are recorded so you can revisit the tricky bits later.",
  },
  {
    title: "Career toolkit",
    description:
      "Access templates, interview drills, and resume reviews tailored for first-time developers.",
    detail: "Gain confidence before you send that first application.",
  },
];
const courses = [
  {
    title: "Foundations of Web Development",
    level: "Beginner",
    duration: "6 weeks",
    description:
      "Learn the core building blocks of the web with hands-on HTML, CSS, and JavaScript challenges.",
  },
  {
    title: "Modern Frontend with React",
    level: "Intermediate",
    duration: "8 weeks",
    description:
      "Create interactive interfaces, manage state like a pro, and ship performant React apps.",
  },
  {
    title: "Backend APIs with Node and PostgreSQL",
    level: "Intermediate",
    duration: "7 weeks",
    description:
      "Design secure REST APIs, connect to databases, and deploy production-ready services.",
  },
];
const testimonials = [
  {
    name: "Shannon, Career Switcher",
    quote:
      "CS-Learn helped me close the gap between tutorials and building real products. I landed a junior role two months after finishing the program.",
  },
  {
    name: "Luis, College Student",
    quote:
      "The mix of guided lessons, projects, and mentor feedback kept me accountable. My portfolio finally feels job-ready.",
  },
];
export default function Home() {
  var isSignedIn = false;
  var mockUser = null;

  /*if testing just commented out this block of code */
  isSignedIn = true;
  mockUser = {
    name: "Frieren",
    email: "Frieren@gmail.com",
    avatar: "frieren.jpg",
    profileHref: "/profile",
    coursesHref: "/user/courses",
    historyHref: "/courses/history",
  }
  ///////////////////

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <Navigation isSignedIn={isSignedIn} User={mockUser}/> {}
      </header>
    </div>
  );
}