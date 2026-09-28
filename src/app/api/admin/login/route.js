import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionToken, safeStringEqual } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function POST(request) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    console.error("ADMIN_PASSWORD is not set - admin login is disabled.");
    return NextResponse.json(
      { success: false, error: "Admin login is not configured on the server." },
      { status: 500 }
    );
  }

  let password;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  if (!safeStringEqual(password, secret)) {
    return NextResponse.json({ success: false, error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken(secret, SESSION_MAX_AGE_SECONDS);

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
