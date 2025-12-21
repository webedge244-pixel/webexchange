import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";

export async function GET(
  req: Request,
  // 1. Update the type definition for params to be a Promise
  props: { params: Promise<{ name: string }> }
) {
  const ua = req.headers.get("user-agent") || "";
  if (/bot|crawler|wallet|metamask/i.test(ua)) {
    return new Response("Forbidden", { status: 403 });
  }

  // 2. Await the params to extract the 'name'
  const { name } = await props.params;

  // 3. Await the cookies() function
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;

  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    await auth.verifySessionCookie(session);
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const filePath = path.join(
    process.cwd(),
    "pra/images/wall",
    name // 4. Use the extracted 'name' variable directly
  );

  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "no-store",
    },
  });
}
