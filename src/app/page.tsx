import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navbar"

export default function Home() {
  var isSignedIn = false;
  var mockUser = null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <Navigation isSignedIn={isSignedIn}/> {}
      </header>
    </div>
  );
}