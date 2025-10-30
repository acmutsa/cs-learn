import Link from "next/link";
import Image from "next/image"; // Optional: if using Next.js Image optimization

export default function Navigation() {
  return (
    <div className="p-5" >
      <nav className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 w-full flex justify-between items-center px-10 py-6 text-white rounded-md border shadow-md">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-4xl font-bold hover:text-cyan-300 hover:drop-shadow-[0_0_30px_rgba(236,72,153,0.9)]  transition-all duration-300 ease-in-out">
            ACM Learn
          </h1>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8 font-semibold">
          <li>
            <Link
              href="/categories"
              className="text-lg pr-5 hover:text-cyan-300  transition-all duration-300 ease-in-out"
            >
              Categories
            </Link>
          </li>

          <li>
            <Link
              href="/login"
              className="px-4 py-2 text-sm border  border-white rounded-md transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-300 hover:to-purple-300  hover:text-blue-600 hover:border-blue-600"
            >
              Login
            </Link>
          </li>

          {/* Profile Pic Placeholder */}
          <li>
            <Link href="/profile" className="block">
              <div className="w-12 h-12 hover:drop-shadow-[1px_1px_40px_rgba(255,215,100,1)] rounded-full overflow-hidden border-2 border-white hover:border-blue-300 transition-all duration-300">
                {/* Replace with actual image */}
                <Image
                  src="/profile-placeholder.jpg"
                  alt="Profile"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
