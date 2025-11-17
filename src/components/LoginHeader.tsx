// src/components/Header.tsx
"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex justify-center py-10">
      <Link href="/" className="text-6xl font-semibold cursor-pointer">
        ACM Learn
      </Link>
    </header>
  );
}