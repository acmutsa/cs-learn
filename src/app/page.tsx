import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navbar"

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