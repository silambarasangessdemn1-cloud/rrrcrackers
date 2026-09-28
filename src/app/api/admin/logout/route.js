import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Plain <form method="POST"> logout - no client JS needed - so this
// redirects back to the login page rather than returning JSON.
export async function POST(request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
