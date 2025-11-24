"use client";

import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const today = new Date().toLocaleDateString(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const AdminNavbar = () => {
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
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Courses */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/admin/courses">Courses</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Tags */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/admin/tags">Tags</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Users */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
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
