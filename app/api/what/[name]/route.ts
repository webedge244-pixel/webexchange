import fs from "fs";
import path from "path";
// Removed: import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";

const MIME_TYPES: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
};

export async function GET(
  req: Request,
  props: { params: Promise<{ name: string }> }
) {
  const ua = req.headers.get("user-agent") || "";
  if (/bot|crawler|wallet|metamask/i.test(ua)) {
    return new Response("Forbidden", { status: 403 });
  }

  // Await params (Next.js 15 pattern)
  const { name } = await props.params;

  // --- START REFACTOR ---

  // 1. Get the Authorization header
  const authHeader = req.headers.get("Authorization");

  // 2. Check if the header exists and has the 'Bearer ' prefix
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized: Missing or malformed header", {
      status: 401,
    });
  }

  // 3. Extract the token string (remove "Bearer ")
  const token = authHeader.split("Bearer ")[1];

  try {
    // 4. Verify the Firebase ID Token instead of the Session Cookie
    await auth.verifyIdToken(token);
  } catch (error) {
    // Log error for server-side debugging if necessary
    console.error("Token verification failed:", error);
    return new Response("Unauthorized: Invalid token", { status: 401 });
  }

  // --- END REFACTOR ---

  const filePath = path.join(process.cwd(), "pra/images/wall", name);

  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  // Detect file extension and set MIME type
  const ext = path.extname(name).slice(1).toLowerCase();
  const contentType = MIME_TYPES[ext];

  if (!contentType) {
    return new Response("Unsupported file type", { status: 415 });
  }

  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600", // Changed to private since it requires auth
    },
  });
}
