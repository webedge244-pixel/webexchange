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

// 2. Bot / scraper signatures
const BLOCKED_AGENTS = [
  "bot",
  "crawler",
  "spider",
  "slurp",
  "googlebot",
  "bingbot",
  "duckduckgo",
  "yandex",
  "baidu",

  "facebookexternalhit",
  "twitterbot",
  "discordbot",
  "telegrambot",
  "whatsapp",
  "slackbot",
  "linkedinbot",
  "pinterest",

  "metamask",
  "phantom",
  "solflare",
  "coinbase",
  "trustwallet",
  "ledger",
  "wallet",
  "crypto",

  "headless",
  "puppeteer",
  "selenium",
  "playwright",
  "curl",
  "wget",
  "python",
  "axios",
  "postman",
  "insomnia",
  "go-http",
  "okhttp",
  "lighthouse",
];

const BOT_REGEX = new RegExp(BLOCKED_AGENTS.join("|"), "i");

export async function GET(
  req: Request,
  props: { params: Promise<{ name: string[] }> }
) {
  // Await params (Next.js 15 pattern)
  const { name } = await props.params;
  const ua = req.headers.get("user-agent") || "";
  if (!ua || BOT_REGEX.test(ua)) {
    console.warn(`Blocked request: ${ua} -> ${name.join("/")}`);
    return new Response("Forbidden", { status: 403 });
  }

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

  // 2️⃣ Build relative path safely
  const relativePath = name.join("/");

  // 3️⃣ Base image directory
  const baseDir = path.join(process.cwd(), "pra/images");

  // 4️⃣ Resolve full path (prevents ../ attacks)
  const filePath = path.resolve(baseDir, relativePath);

  // 🚨 Directory traversal protection
  if (!filePath.startsWith(baseDir)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  // 6️⃣ MIME type detection
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const contentType = MIME_TYPES[ext];

  if (!contentType) {
    return new Response("Unsupported file type", { status: 415 });
  }

  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
