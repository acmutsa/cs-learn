"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const today = new Date().toLocaleDateString(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const AdminNavbar = () => {
  const pathname = usePathname();
  const segment = pathname.split('/');
  const isActive = (href: string) => {
    if (pathname === href) {
      return true;
    }
    const temp = "/" + segment[1] + "/" +segment[2];
    if (temp === href) {
      return true;
    }
    return false;
  }
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-3 sm:px-4 lg:px-5">
        
        {/* Left side: logo */}
        <div className="mr-6 flex flex-col leading-tight">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            Admin Panel
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            ACM @ UTSA
          </span>
        </div>

        {/* Center: nav menu links */}
        <nav aria-label="Admin navigation" className="flex-1">
          <NavigationMenu>
            <NavigationMenuList className="flex-wrap">

              {/* Dashboard */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={isActive("/admin") ? "bg-accent dark:bg-accent" : "bg-background"}>
                  <Link href="/admin">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Courses */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={isActive("/admin/courses") ? "bg-accent dark:bg-accent" : "bg-background"}>
                  <Link href="/admin/courses">Courses</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Tags */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={isActive("/admin/tags") ? "bg-accent dark:bg-accent" : "bg-background"}>
                  <Link href="/admin/tags">Tags</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Users */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={isActive("/admin/users") ? "bg-accent dark:bg-accent" : "bg-background"}>
                  <Link href="/admin/users">Users</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right side: date */}
        <div className="hidden text-xs text-neutral-500 dark:text-neutral-400 md:block">
            {today}
        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;
