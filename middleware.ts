import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  return withAuth(req, {
    // Custom auth pages + Kinde API routes + landing page are all public
    isPublic: [
      "/",
      "/login",
      "/register",
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/callback",
      "/api/auth/logout",
    ],
    // Redirect unauthenticated users to our custom login page
    loginPage: "/login",
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
