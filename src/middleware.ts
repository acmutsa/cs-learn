import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";



export async function middleware(req : NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });
    const role = session?.user.role;
    const path = req.nextUrl.pathname;

  // Protect admin section
    if (path.startsWith("/admin") &&!["admin", "super admin"].includes(role ?? "")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

  // Protect instructor pages
    if (path.startsWith("/instructor") && !["admin", "instructor"].includes(role ?? "")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
}


export const config = { matcher: ["/admin/:path*", "/instructor/:path*"] };