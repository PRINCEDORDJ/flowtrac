import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  return withAuth(req, {
    // Specify the paths that should be accessible without authentication
    isPublic: [
      "/",
    ],
    // Redirect unauthenticated users to our custom login page
    loginPage: "/login",
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - login, register (custom auth pages)
     * - api (includes /api/auth)
     * - _next/static, _next/image (static files)
     * - favicon.ico
     */
    "/((?!login|register|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
