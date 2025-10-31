"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Optional: if using Next.js Image optimization
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
            <button className="text-lg pr-5 hover:text-cyan-300  transition-all duration-300 ease-in-out">
              <Link
              href="/explore"
              
              >Explore</Link>
            </button>
          </li>
          <li>
            <button>
              <Link
                href="/categories"
                className="text-lg pr-5 hover:text-cyan-300  transition-all duration-300 ease-in-out"
              >
                Categories
              </Link>
            </button>
          </li>
          {isSignedIn && User ? (
            <>
            
          <li>
            <button className="px-4 py-2 text-sm border  border-white rounded-md transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-300 hover:to-purple-300  hover:text-blue-600 hover:border-blue-600">
            <Link
              href="/logout"
            >
              Logout
            </Link>
            </button>
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
            <button className="px-4 py-2 text-sm border  border-white rounded-md transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-300 hover:to-purple-300  hover:text-blue-600 hover:border-blue-600">
            <Link
              href="/login"
            >
              Login
            </Link>
            </button>

          </li>
          <li>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Avatar className="block w-12 h-12 hover:drop-shadow-[1px_1px_40px_rgba(255,215,100,1)] rounded-full overflow-hidden border-2 border-white hover:border-blue-300 transition-all duration-300">
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
              <button className="px-4 py-2 text-sm border  border-white rounded-md transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-300 hover:to-purple-300  hover:text-blue-600 hover:border-blue-600">
            <Link
              href="/login"
            >
              Login
            </Link>
            </button>
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
