import Link from "next/link";
import LogoutButton from "../auth/SignOutButton";
import { headers } from "next/headers"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";

export default async function Navigation() {
  const h = await headers();
  const session = await auth.api.getSession({
    headers: h,
  });
  const user = session?.user;
  const isSignedIn = Boolean(user);
  const isAdmin = user?.role === "admin" ? true : false;

  const avatarSrc = user?.image ?? "/user.png";
  const displayName = user?.name ?? "User";
  const email = user?.email ?? "";

  return (
    <div className="w-full p-2 md:p-5">
      <nav className="bg-background w-full flex justify-between items-center px-4 md:px-8 py-2 rounded-md border border-border text-foreground">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-xl md:text-3xl font-bold hover:text-primary transition-colors">
            ACM Learn
          </h1>
        </Link>
        {/* Navigation Links */}
        <ul className="flex items-center gap-0 md:gap-8 font-semibold">
          {isSignedIn && user ? (
            <>
              {isAdmin && (
                <li className="hidden md:flex">
                  <Button variant={"secondary"} className="text-md md:text-lg text-foreground hover:text-gray-300 transition-all duration-300">
                    <Link
                      href="/admin"
                    >Admin</Link>
                  </Button>
                </li>
              )}
              <li className="hidden md:flex">
                <Button variant="outline" className="text-md md:text-lg text-foreground hover:text-gray-300 transition-all duration-300">
                  <Link
                  href="/explore"
                  >Explore</Link>
                </Button>
              </li>
              <li className="hidden md:flex">
                <Button variant="outline" className="text-md md:text-lg text-foreground  hover:text-gray-300 transition-all duration-300">
                  <Link href="/categories">Categories</Link>
                </Button>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-12 h-12 border-2 border-white rounded-full overflow-hidden transition-all duration-300 hover:border-blue-300 hover:drop-shadow-[1px_1px_40px_rgba(255,215,100,1)] cursor-pointer">
                      <AvatarImage
                        src={avatarSrc}
                        alt={displayName}
                        className="object-cover w-full h-full"
                      />
                      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="font-semibold">{displayName}</p>
                      {email && <p className="text-sm text-gray-500">{email}</p>}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="bg-secondary cursor-pointer">Admin</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/explore" className="cursor-pointer">Explore</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/categories" className="cursor-pointer">Categories</Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem asChild>
                      <Link href="/courses" className="cursor-pointer">My Courses</Link>
                    </DropdownMenuItem> */}
                    {/* <DropdownMenuItem asChild>
                      <Link href="/history" className="cursor-pointer">History</Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          ) : (
            <>
              <li className="hidden md:flex">
                <Button className="px-4 py-2 border border-border rounded-md transition-all duration-300 hover:bg-muted hover:text-foreground">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </li>
              <li className="hidden md:flex">
                <Button variant={"outline"} className="px-4 py-2 border border-border rounded-md transition-all duration-300 hover:bg-muted hover:text-foreground">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="block w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:border-blue-300 transition-all duration-300">
                        <AvatarImage
                          src={"/user.png"}
                          alt="Guest profile"
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="flex flex-col gap-2 py-2">
                    <DropdownMenuItem asChild>
                      <Button className="px-4 py-2 border border-border rounded-md transition-all duration-300 hover:bg-muted hover:text-foreground">
                        <Link href="/sign-in">Sign in</Link>
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Button variant={"outline"} className="px-4 py-2 border border-border rounded-md transition-all duration-300 hover:bg-muted hover:text-foreground">
                        <Link href="/sign-up">Sign Up</Link>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
