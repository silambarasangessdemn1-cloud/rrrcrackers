import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/upload/:path*",
    "/api/images/:path*",
    "/api/settings",
  ],
};

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  // The storefront reads the live/maintenance flag via GET - keep it public.
  if (pathname === "/api/settings" && request.method === "GET") {
    return NextResponse.next();
  }

  // Always allow the login page itself, or we'd redirect-loop.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_PASSWORD;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthed = Boolean(secret) && (await verifySessionToken(token, secret));

  if (isAuthed) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 },
  );
}
