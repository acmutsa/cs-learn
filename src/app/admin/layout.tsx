import React from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Toaster } from "sonner"


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Top nav bar */}
      <AdminNavbar />

      {/* Page content */}
      <main className="flex-1 p-6">
        {children}
        <Toaster richColors position="top-right" />
      </main>

      {/* Footer */}
    </section>
  );
}
