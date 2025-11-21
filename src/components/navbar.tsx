"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
type NavigationProps = {
    isSignedIn: boolean;
    User?: {
      name: string;
      email: string;
      avatar?: string;
      profileHref?:string;
      coursesHref?:string;
      historyHref?: string;
    };
  };


export default function Navigation({ isSignedIn, User }: NavigationProps) {

  return (
    <div className="p-5" >
      <nav className="bg-background w-full flex justify-between items-center px-10 py-6 rounded-md border border-border text-foreground">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl font-bold hover:text-primary transition-colors">
            ACM Learn
          </h1>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8 font-semibold text-lg">
          <li>
            <Button className="text-lg pr-5 bg-transparent text-foreground hover:text-gray-300 transition-all duration-300">
              <Link
              href="/explore"
              
              >Explore</Link>
            </Button>
          </li>
          <li>
            <Button className=" text-lg pr-5 bg-transparent text-foreground  hover:text-gray-300 transition-all duration-300">
              <Link
                href="/categories"
                
              >
                Categories
              </Link>
            </Button>
          </li>
          {isSignedIn && User ? (
            <>
            
          <li>
            <Button className="text-lg px-4 py-2 border border-border rounded-md transition-all duration-300 hover:bg-muted hover:text-foreground">
            <Link
              href="/logout"
            >
              Logout
            </Link>
            </Button>
          </li>
          {/* Profile Pic Placeholder */}
          <li>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-12 h-12 border-2 border-white rounded-full overflow-hidden transition-all duration-300 hover:border-blue-300 hover:drop-shadow-[1px_1px_40px_rgba(255,215,100,1)] cursor-pointer">
              <AvatarImage
                src={`/${User.avatar ?? "user.png"}`}
                alt={User.name}
                className="object-cover w-full h-full"
              />
              <AvatarFallback>{User.name?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-semibold">{User.name}</p>
                <p className="text-sm text-gray-500">{User.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={User.profileHref ?? "/profile"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={User.coursesHref ?? "/courses"}>My Courses</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={User.historyHref ?? "/history"}>History</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/logout" className="text-red-600">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </li>
          </>
          ) : (
            <>
            <li>
            <Button className="px-4 py-2 border border-border rounded-md transition-all duration-300 hover:bg-muted hover:text-foreground">
            <Link
              href="/sign-in"
            >
              Login
            </Link>
            </Button>

          </li>
          <li>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Avatar className="block w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:border-blue-300 transition-all duration-300">
              <AvatarImage
                src={ "/user.png"}
                alt="Guest profile"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
          </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuItem asChild className="">
              <Button className="px-4 py-2 border border-border rounded-md transition-all duration-300 hover:bg-muted hover:text-foreground">
            <Link
              href="/login"
            >
              Login
            </Link>
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
