import { auth } from "@/lib/firebase-admin"; // Importing your initialized instance
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // 5 days expiration
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Use the auth instance from your lib file
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true, // Prevents JS access (Anti-bot/Anti-XSS)
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ isLogged: true }, { status: 200 });
  } catch (error) {
    console.error("Session Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("__session");
  return NextResponse.json({ isLogged: false }, { status: 200 });
}