import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/shared/navbar";
import AutoSignInTestComponent from "@/components/auth/autoSignIn";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-800">
      <section className="mx-auto flex max-w-4xl flex-col gap-6 px-6 text-center text-slate-50">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          Learning with ACM
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Level up your skills with the ACM learning platform
        </h1>

        <p className="text-base sm:text-lg text-slate-300">
          Centralize course tracks, lessons, and resources for members so they can
          learn, practice, and grow all in one place.
        </p>

        <div className="mt-4 flex flex-col items-center justify-center gap-2">
          <Link 
            href="/sign-up" 
            className="rounded-lg px-6 py-3 text-sm sm:text-base font-semibold bg-blue-500 text-white shadow-md hover:bg-blue-600"
          >
            Get Started
          </Link>

          <Link
            href="/sign-in"
            className="text-sm sm:text-base font-medium text-slate-400 underline-offset-4 hover:underline"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </section>
    </div>
  );
}