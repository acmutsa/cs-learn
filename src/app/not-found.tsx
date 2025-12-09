import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background light">
      <main>
        <h1 className="text-9xl font-bold text-gray-800 mr-8">404</h1>
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-semibold text-gray-700">Sorry</h2>
          <h3 className="text-lg text-gray-600">We couldn't find that page</h3>
          <p className="text-gray-500">
            Please try again or go back to our{" "}
            <Link
              href="/home"
              className="font-semibold text-blue-500 hover:underline"
            >
              main page
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-between gap-6 px-6 mt-8">
          {/* image + button */}
          <img src={"404.png"} alt="404-logo" className="w-64 h-auto"></img>
          <Link href="/home">
            <Button className="text-white rounded-md px-6 py-7">
              {" "}
              go back to the main page
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
